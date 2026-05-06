/**
 * @file message_server.hpp
 * @brief 消息存储服务模块
 * @details 提供消息持久化、历史消息查询、消息搜索等功能，集成MySQL、ES、RabbitMQ
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#define IM_LOG_SERVICE_TAG "消息存储服务"
#include <boost/date_time/posix_time/conversion.hpp>
#include <boost/date_time/posix_time/ptime.hpp>
#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "data_es.hpp"
#include "etcd.hpp"
#include "file.pb.h"
#include "logger.hpp"
#include "message.pb.h"
#include "mysql_message.hpp"
#include "rabbitmq.hpp"
#include "user.pb.h"
#include "utils.hpp"
#include <cstddef>
#include <cstdint>
#include <functional>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
namespace im_server {

/**
 * @class MessageServiceImpl
 * @brief 消息存储服务RPC接口实现类
 * @details 提供消息持久化、历史查询、搜索功能，集成MySQL、ES、RabbitMQ和下游服务
 */
class MessageServiceImpl : public MsgStorageService {
public:
    /**
     * @brief 构造函数
     * @param es_client Elasticsearch客户端（用于消息搜索）
     * @param mysql_client MySQL数据库连接（用于消息持久化）
     * @param mm_channels 下游服务管理器
     * @param file_service_name 文件服务名称
     * @param user_service_name 用户服务名称
     */
    MessageServiceImpl(const std::shared_ptr<elasticlient::Client> &es_client,
                       const std::shared_ptr<odb::core::database> &mysql_client,
                       const std::shared_ptr<ServiceManager> &mm_channels,
                       const std::string &file_service_name,
                       const std::string &user_service_name)
        : _es_message(std::make_shared<ESMessage>(es_client)),
          _mysql_message(std::make_shared<MessageTable>(mysql_client)),
          _mm_channels(mm_channels), _file_service_name(file_service_name),
          _user_service_name(user_service_name) {
        _es_message->createIndex();
    }
    
    ~MessageServiceImpl() {}

    /**
     * @brief 获取历史消息
     * @param controller RPC控制器
     * @param request 请求（包含会话ID、起止时间）
     * @param response 响应（包含消息列表）
     * @param done RPC回调
     * @details 从MySQL按时间范围查询消息，批量拉取文件和用户信息
     */
    virtual void GetHistoryMsg(::google::protobuf::RpcController *controller,
                               const ::im_server::GetHistoryMsgReq *request,
                               ::im_server::GetHistoryMsgRsp *response,
                               ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string rid = request->request_id();
        std::string chat_ssid = request->chat_session_id();
        boost::posix_time::ptime stime =
            boost::posix_time::from_time_t(request->start_time());
        boost::posix_time::ptime etime =
            boost::posix_time::from_time_t(request->over_time());
        
        LOG_INFO("RPC GetHistoryMsg | request_id={} | session_id={} | start_time={} | end_time={}", 
                 rid, chat_ssid, request->start_time(), request->over_time());
        
        auto msg_list = _mysql_message->range(chat_ssid, stime, etime);
        if (msg_list.empty()) {
            LOG_DEBUG("RPC GetHistoryMsg | request_id={} | 结果=无历史消息", rid);
            response->set_request_id(rid);
            response->set_success(true);
            return;
        }
        
        LOG_DEBUG("RPC GetHistoryMsg | request_id={} | 阶段=MySQL查询完成 | count={}", rid, msg_list.size());
        
        std::unordered_set<std::string> file_id_list;
        for (auto &msg : msg_list) {
            if (msg.file_id().empty())
                continue;
            file_id_list.insert(msg.file_id());
        }
        std::unordered_set<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.insert(msg.user_id());
        }

        std::unordered_map<std::string, std::string> file_data_list;
        bool ret = _GetFile(rid, file_id_list, file_data_list);
        if (ret == false) {
            LOG_ERROR("RPC GetHistoryMsg | request_id={} | 阶段=批量拉取文件 | 结果=失败", rid);
            return err_response(rid, "批量文件数据下载失败");
        }
        
        std::unordered_map<std::string, UserInfo> user_info_list;
        ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("RPC GetHistoryMsg | request_id={} | 阶段=批量拉取用户 | 结果=失败", rid);
            return err_response(rid, "批量用户数据获取失败");
        }
        for (auto &msg : msg_list) {
            auto message_info = response->add_msg_list();
            message_info->set_message_id(msg.message_id());
            message_info->set_chat_session_id(msg.session_id());
            message_info->set_timestamp(
                boost::posix_time::to_time_t(msg.create_time()));
            message_info->mutable_sender()->CopyFrom(
                user_info_list[msg.user_id()]);
            switch (msg.message_type()) {
            case MessageType::STRING:
                message_info->mutable_message()->set_message_type(
                    MessageType::STRING);
                message_info->mutable_message()
                    ->mutable_string_message()
                    ->set_content(msg.content());
                break;
            case MessageType::IMAGE:
                message_info->mutable_message()->set_message_type(
                    MessageType::IMAGE);
                message_info->mutable_message()
                    ->mutable_image_message()
                    ->set_image_content(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_image_message()
                    ->set_file_id(msg.file_id());
                break;
            case MessageType::FILE:
                message_info->mutable_message()->set_message_type(
                    MessageType::FILE);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_contents(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_id(msg.file_id());
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_size(msg.file_size());
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_name(msg.file_name());
                break;
            case MessageType::SPEECH:
                message_info->mutable_message()->set_message_type(
                    MessageType::SPEECH);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_contents(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_id(msg.file_id());
                break;
            default:
                LOG_ERROR("RPC GetRecentMsg | request_id={} | 消息类型未知 | type={}", rid, msg.message_type());
                return;
            }
        }
        
        LOG_INFO("RPC GetRecentMsg | request_id={} | 阶段=完成 | msg_count={}", rid, msg_list.size());
        response->set_request_id(rid);
        response->set_success(true);
        return;
    }
    virtual void GetRecentMsg(::google::protobuf::RpcController *controller,
                              const ::im_server::GetRecentMsgReq *request,
                              ::im_server::GetRecentMsgRsp *response,
                              ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string rid = request->request_id();
        std::string chat_ssid = request->chat_session_id();
        int64_t msg_count = request->msg_count();
        
        LOG_INFO("RPC GetRecentMsg | request_id={} | session_id={} | count={}", rid, chat_ssid, msg_count);
        
        auto msg_list = _mysql_message->recent(chat_ssid, msg_count);
        if (msg_list.empty()) {
            LOG_DEBUG("RPC GetRecentMsg | request_id={} | 结果=无最近消息", rid);
            response->set_request_id(rid);
            response->set_success(true);
            return;
        }
        
        LOG_DEBUG("RPC GetRecentMsg | request_id={} | 阶段=MySQL查询完成 | count={}", rid, msg_list.size());
        std::unordered_set<std::string> file_id_list;
        for (auto &msg : msg_list) {
            if (msg.file_id().empty())
                continue;
            file_id_list.insert(msg.file_id());
        }
        std::unordered_set<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.insert(msg.user_id());
        }

        std::unordered_map<std::string, std::string> file_data_list;
        bool ret = _GetFile(rid, file_id_list, file_data_list);
        if (ret == false) {
            LOG_ERROR("RPC GetRecentMsg | request_id={} | 阶段=批量拉取文件 | 结果=失败", rid);
            return err_response(rid, "批量文件数据下载失败");
        }
        std::unordered_map<std::string, UserInfo> user_info_list;
        ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("RPC GetRecentMsg | request_id={} | 阶段=批量拉取用户 | 结果=失败", rid);
            return err_response(rid, "批量用户数据获取失败");
        }
        for (auto &msg : msg_list) {
            auto message_info = response->add_msg_list();
            message_info->set_message_id(msg.message_id());
            message_info->set_chat_session_id(msg.session_id());
            message_info->set_timestamp(
                boost::posix_time::to_time_t(msg.create_time()));
            message_info->mutable_sender()->CopyFrom(
                user_info_list[msg.user_id()]);
            switch (msg.message_type()) {
            case MessageType::STRING:
                message_info->mutable_message()->set_message_type(
                    MessageType::STRING);
                message_info->mutable_message()
                    ->mutable_string_message()
                    ->set_content(msg.content());
                break;
            case MessageType::IMAGE:
                message_info->mutable_message()->set_message_type(
                    MessageType::IMAGE);
                message_info->mutable_message()
                    ->mutable_image_message()
                    ->set_image_content(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_image_message()
                    ->set_file_id(msg.file_id());
                break;
            case MessageType::FILE:
                message_info->mutable_message()->set_message_type(
                    MessageType::FILE);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_contents(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_id(msg.file_id());
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_size(msg.file_size());
                message_info->mutable_message()
                    ->mutable_file_message()
                    ->set_file_name(msg.file_name());
                break;
            case MessageType::SPEECH:
                message_info->mutable_message()->set_message_type(
                    MessageType::SPEECH);
                message_info->mutable_message()
                    ->mutable_speech_message()
                    ->set_file_contents(file_data_list[msg.file_id()]);
                message_info->mutable_message()
                    ->mutable_speech_message()
                    ->set_file_id(msg.file_id());
                break;
            default:
                LOG_ERROR("RPC GetHistoryMsg | request_id={} | 消息类型未知 | type={}", rid, msg.message_type());
                return;
            }
        }
        
        LOG_INFO("RPC GetHistoryMsg | request_id={} | 阶段=完成 | msg_count={}", rid, msg_list.size());
        response->set_request_id(rid);
        response->set_success(true);
        return;
    }
    virtual void MsgSearch(::google::protobuf::RpcController *controller,
                           const ::im_server::MsgSearchReq *request,
                           ::im_server::MsgSearchRsp *response,
                           ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string rid = request->request_id();
        std::string chat_ssid = request->chat_session_id();
        std::string skey = request->search_key();
        
        LOG_INFO("RPC MsgSearch | request_id={} | session_id={} | search_key={}", rid, chat_ssid, skey);
        
        auto msg_list = _es_message->search(skey, chat_ssid);
        if (msg_list.empty()) {
            LOG_DEBUG("RPC MsgSearch | request_id={} | 结果=无匹配消息", rid);
            response->set_request_id(rid);
            response->set_success(true);
            return;
        }
        
        LOG_DEBUG("RPC MsgSearch | request_id={} | 阶段=ES搜索完成 | count={}", rid, msg_list.size());
        
        std::unordered_set<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.insert(msg.user_id());
        }
        std::unordered_map<std::string, UserInfo> user_info_list;
        bool ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("RPC MsgSearch | request_id={} | 阶段=批量拉取用户 | 结果=失败", rid);
            return err_response(rid, "批量获取用户信息失败");
        }
        for (auto &msg : msg_list) {
            auto message_info = response->add_msg_list();
            message_info->set_message_id(msg.message_id());
            message_info->set_chat_session_id(msg.session_id());
            message_info->set_timestamp(
                boost::posix_time::to_time_t(msg.create_time()));
            message_info->mutable_sender()->CopyFrom(
                user_info_list[msg.user_id()]);
            message_info->mutable_message()->set_message_type(
                MessageType::STRING);
            message_info->mutable_message()
                ->mutable_string_message()
                ->set_content(msg.content());
        }
        
        LOG_INFO("RPC MsgSearch | request_id={} | 阶段=完成 | result_count={}", rid, msg_list.size());
        response->set_request_id(rid);
        response->set_success(true);
        return;
    }

    /**
     * @brief MQ消息消费回调
     * @param body 消息体二进制数据
     * @param sz 消息体大小
     * @details 从MQ消费消息，反序列化后根据类型处理（文本/图片/文件/语音），写入MySQL和ES
     */
    void onMessage(const char *body, size_t sz) {
        LOG_DEBUG("MQ消费 | body_size={}", sz);
        
        MessageInfo message;
        bool ret = message.ParseFromArray(body, sz);
        if (ret == false) {
            LOG_ERROR("MQ消费 | 阶段=反序列化消息 | 结果=失败");
            return;
        }
        
        std::string msg_id = message.message_id();
        std::string session_id = message.chat_session_id();
        std::string sender_id = message.sender().user_id();
        MessageType msg_type = message.message().message_type();
        
        LOG_INFO("MQ消费 | msg_id={} | session_id={} | sender={} | type={}", 
                 msg_id, session_id, sender_id, msg_type);
        
        std::string file_id, file_name, content;
        int64_t file_size;
        switch (message.message().message_type()) {
        case MessageType::STRING:
            content = message.message().string_message().content();
            ret = _es_message->appendData(
                message.sender().user_id(), message.message_id(),
                message.timestamp(), message.chat_session_id(), content);
            if (ret == false) {
                LOG_ERROR("MQ消费 | msg_id={} | 阶段=ES写入文本消息 | 结果=失败", msg_id);
                return;
            }
            LOG_DEBUG("MQ消费 | msg_id={} | 阶段=ES写入文本消息 | 结果=成功", msg_id);
            break;
        case MessageType::IMAGE: {
            const auto &msg = message.message().image_message();
            file_size = msg.image_content().size();
            LOG_DEBUG("MQ消费 | msg_id={} | 阶段=处理图片消息 | size={}", msg_id, file_size);
            ret = _PutFile("", msg.image_content(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("MQ消费 | msg_id={} | 阶段=上传图片到文件服务 | 结果=失败", msg_id);
                return;
            }
        } break;
        case MessageType::FILE: {
            const auto &msg = message.message().file_message();
            file_name = msg.file_name();
            file_size = msg.file_size();
            LOG_DEBUG("MQ消费 | msg_id={} | 阶段=处理文件消息 | name={} | size={}", msg_id, file_name, file_size);
            ret = _PutFile(file_name, msg.file_contents(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("MQ消费 | msg_id={} | 阶段=上传文件到文件服务 | 结果=失败", msg_id);
                return;
            }
        } break;
        case MessageType::SPEECH: {
            const auto &msg = message.message().speech_message();
            file_size = msg.file_contents().size();
            LOG_DEBUG("MQ消费 | msg_id={} | 阶段=处理语音消息 | size={}", msg_id, file_size);
            ret = _PutFile("", msg.file_contents(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("MQ消费 | msg_id={} | 阶段=上传语音到文件服务 | 结果=失败", msg_id);
                return;
            }
        } break;
        default:
            LOG_ERROR("MQ消费 | msg_id={} | 消息类型未知 | type={}", msg_id, msg_type);
            return;
        }
        Message msg(message.message_id(), message.chat_session_id(),
                    message.sender().user_id(),
                    message.message().message_type(),
                    boost::posix_time::from_time_t(message.timestamp()));
        msg.file_id(file_id);
        msg.file_name(file_name);
        msg.file_size(file_size);
        msg.content(content);
        ret = _mysql_message->insert(msg);
        if (ret == false) {
            LOG_ERROR("MQ消费 | msg_id={} | 阶段=MySQL写入消息 | 结果=失败", msg_id);
            return;
        }
        
        LOG_INFO("MQ消费 | msg_id={} | 阶段=完成 | file_id={}", msg_id, file_id);
    }

private:
    /**
     * @brief 批量获取文件内容
     * @param rid 请求ID
     * @param file_id_list 文件ID集合
     * @param[out] file_data_list 输出文件ID到内容的映射
     * @return true=成功，false=失败
     * @details 调用文件服务批量下载文件
     */
    bool
    _GetFile(const std::string &rid,
             const std::unordered_set<std::string> &file_id_list,
             std::unordered_map<std::string, std::string> &file_data_list) {
        auto channel = _mm_channels->choose(_file_service_name);
        if (!channel) {
            LOG_ERROR("{} 没有可供访问的文件子服务节点", _file_service_name);
            return false;
        }
        FileService_Stub stub(channel.get());
        brpc::Controller cntl;
        GetMultiFileReq req;
        GetMultiFileRsp rsp;
        req.set_request_id(rid);
        for (auto &id : file_id_list) {
            req.add_file_id_list(id);
        }
        stub.GetMultiFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() || rsp.success() == false) {
            LOG_ERROR("文件子服务调用失败 - {}", cntl.ErrorText());
            return false;
        }
        const auto &fmap = rsp.file_data();
        for (auto it = fmap.begin(); it != fmap.end(); it++) {
            file_data_list.insert(
                std::make_pair(it->first, it->second.file_content()));
        }
        return true;
    }

    /**
     * @brief 批量获取用户信息
     * @param rid 请求ID
     * @param user_id_list 用户ID集合
     * @param[out] user_info_list 输出用户ID到信息的映射
     * @return true=成功，false=失败
     * @details 调用用户服务批量获取用户详细信息
     */
    bool _GetUser(const std::string &rid,
                  const std::unordered_set<std::string> &user_id_list,
                  std::unordered_map<std::string, UserInfo> &user_info_list) {
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 没有可供访问的用户子服务节点", _user_service_name);
            return false;
        }
        UserService_Stub stub(channel.get());
        brpc::Controller cntl;
        GetMultiUserInfoReq req;
        GetMultiUserInfoRsp rsp;
        req.set_request_id(rid);
        for (auto &id : user_id_list) {
            req.add_users_id(id);
        }
        stub.GetMultiUserInfo(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() || rsp.success() == false) {
            LOG_ERROR("用户子服务调用失败 - {}", cntl.ErrorText());
            return false;
        }
        const auto &umap = rsp.users_info();
        for (auto it = umap.begin(); it != umap.end(); it++) {
            user_info_list.insert(std::make_pair(it->first, it->second));
        }
        return true;
    }

    /**
     * @brief 上传单个文件
     * @param filename 文件名
     * @param body 文件内容
     * @param fsize 文件大小
     * @param[out] file_id 输出文件ID
     * @return true=成功，false=失败
     * @details 调用文件服务上传文件并获取文件ID
     */
    bool _PutFile(const std::string &filename, const std::string &body,
                  const int64_t fsize, std::string &file_id) {
        auto channel = _mm_channels->choose(_file_service_name);
        if (!channel) {
            LOG_ERROR("{} 没有可供访问的文件子服务节点", _file_service_name);
            return false;
        }
        FileService_Stub stub(channel.get());
        brpc::Controller cntl;
        PutSingleFileReq req;
        PutSingleFileRsp rsp;
        req.set_request_id(uuid());
        req.mutable_file_data()->set_file_name(filename);
        req.mutable_file_data()->set_file_size(fsize);
        req.mutable_file_data()->set_file_content(body);
        stub.PutSingleFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() || rsp.success() == false) {
            LOG_ERROR("文件子服务调用失败 - {}", cntl.ErrorText());
            return false;
        }
        file_id = rsp.file_info().file_id();
        return true;
    }

private:
    ESMessage::ptr _es_message;           ///< Elasticsearch消息索引管理
    MessageTable::ptr _mysql_message;     ///< MySQL消息表操作
    std::string _file_service_name;       ///< 文件服务名称
    std::string _user_service_name;       ///< 用户服务名称
    ServiceManager::ptr _mm_channels;     ///< 下游服务管理器
};

/**
 * @class MessageServer
 * @brief 消息存储服务器主类
 * @details 封装消息存储服务的所有依赖组件，提供启动接口
 */
class MessageServer {
public:
    using ptr = std::shared_ptr<MessageServer>;
    
    /**
     * @brief 构造函数
     * @param mq_client RabbitMQ客户端
     * @param service_discoverer 服务发现客户端
     * @param registry_client 服务注册客户端
     * @param es_client Elasticsearch客户端
     * @param mysql_client MySQL数据库连接
     * @param rpc_server RPC服务器实例
     */
    MessageServer(const std::shared_ptr<MQClient> &mq_client,
                  const std::shared_ptr<Discoverer> &service_discoverer,
                  const std::shared_ptr<Registrar> &registry_client,
                  const std::shared_ptr<elasticlient::Client> &es_client,
                  const std::shared_ptr<odb::core::database> &mysql_client,
                  const std::shared_ptr<brpc::Server> &rpc_server)
        : _mq_client(mq_client), _mysql_client(mysql_client),
          _es_client(es_client), _service_discoverer(service_discoverer),
          _registry_client(registry_client), _rpc_server(rpc_server) {}
    ~MessageServer() {}

    // 启动RPC服务器
    void start() { _rpc_server->RunUntilAskedToQuit(); }

private:
    std::shared_ptr<odb::core::database> _mysql_client;
    std::shared_ptr<elasticlient::Client> _es_client;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
    MQClient::ptr _mq_client;
};

class MessageServerBuilder {
public:
    void make_mq_object(const std::string &user, const std::string &passwd,
                        const std::string &host,
                        const std::string &exchange_name,
                        const std::string &queue_name,
                        const std::string &binding_key) {
        _queue_name = queue_name;
        _exchange_name = exchange_name;
        _mq_client = std::make_shared<MQClient>(user, passwd, host);
        _mq_client->declareComponents(_exchange_name, queue_name, binding_key);
    }

    void make_mysql_object(const std::string &user, const std::string &passwd,
                           const std::string &host, const std::string &db,
                           const std::string &cset, int port,
                           int &conn_pool_count) {
        _mysql_client = im_server::ODBFactory::create(
            user, passwd, host, db, cset, port, conn_pool_count);
    }

    void make_es_object(const std::vector<std::string> &host_list) {
        _es_client = im_server::ESClientFactory::create(host_list);
    }

    void make_discovery_object(const std::string &reg_host,
                               const std::string &base_service_name,
                               const std::string &file_service_name,
                               const std::string &user_service_name) {
        // Discoverer(const std::string &host, const std::string &basedir, const
        // NotifyCallback &put_cb, const NotifyCallback &del_cb)
        _file_service_name = file_service_name;
        _user_service_name = user_service_name;
        _mm_channels = std::make_shared<ServiceManager>();
        _mm_channels->declared(_file_service_name);
        _mm_channels->declared(_user_service_name);
        auto put_cb =
            std::bind(&ServiceManager::onServiceOnline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        auto del_cb =
            std::bind(&ServiceManager::onServiceOffline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        _service_discoverer = std::make_shared<Discoverer>(
            reg_host, base_service_name, put_cb, del_cb);
    }

    void make_registry_object(const std::string &reg_host,
                              const std::string &service_name,
                              const std::string &access_host) {
        _registry_client = std::make_shared<Registrar>(reg_host);
        bool ret = _registry_client->registry(service_name, access_host);
        if (ret == false)
            abort();
    }

    void make_rpc_object(const uint16_t &port, const uint32_t &timeout,
                         const uint8_t &num_threads) {
        if (!_mysql_client) {
            LOG_ERROR("消息服务启动检查失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("消息服务启动检查失败 | 组件=Elasticsearch | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("消息服务启动检查失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("消息服务启动检查失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        _rpc_server = std::make_shared<brpc::Server>();

        MessageServiceImpl *message_service =
            new MessageServiceImpl(_es_client, _mysql_client, _mm_channels,
                                   _file_service_name, _user_service_name);
        int ret = _rpc_server->AddService(
            message_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
        if (ret == -1) {
            LOG_ERROR("消息服务启动失败 | 阶段=添加RPC服务");
            abort();
        }
        brpc::ServerOptions options;
        options.idle_timeout_sec = timeout;
        options.num_threads = num_threads;
        ret = _rpc_server->Start(port, &options);
        if (ret == -1) {
            LOG_ERROR("消息服务启动失败 | 阶段=启动RPC服务器 | port={}", port);
            abort();
        }
        LOG_INFO("消息服务启动成功 | port={} | timeout={}s | threads={}", port, timeout, num_threads);
        
        auto callback =
            std::bind(&MessageServiceImpl::onMessage, message_service,
                      std::placeholders::_1, std::placeholders::_2);
        _mq_client->consume(_queue_name, callback);
        LOG_INFO("消息服务MQ消费启动 | queue={}", _queue_name);
    }

    MessageServer::ptr build() {
        if (!_mysql_client) {
            LOG_ERROR("消息服务构建失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("消息服务构建失败 | 组件=Elasticsearch | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("消息服务构建失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("消息服务构建失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        if (!_registry_client) {
            LOG_ERROR("消息服务构建失败 | 组件=etcd服务注册 | 原因=未初始化");
            abort();
        }
        if (!_rpc_server) {
            LOG_ERROR("消息服务构建失败 | 组件=RPC服务器 | 原因=未初始化");
            abort();
        }

        return std::make_shared<MessageServer>(_mq_client, _service_discoverer,
                                               _registry_client, _es_client,
                                               _mysql_client, _rpc_server);
    }

private:
    MQClient::ptr _mq_client;
    std::shared_ptr<odb::core::database> _mysql_client;
    std::shared_ptr<elasticlient::Client> _es_client;
    std::string _file_service_name;
    std::string _user_service_name;
    std::string _exchange_name;
    std::string _queue_name;
    ServiceManager::ptr _mm_channels;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
};
} // namespace im_server