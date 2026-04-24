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
#include <utility>
#include <vector>
namespace im_server {
class MessageServiceImpl : public MsgStorageService {
public:
    MessageServiceImpl(const std::shared_ptr<elasticlient::Client> &es_client,
                       const std::shared_ptr<odb::core::database> &mysql_client,
                       const std::shared_ptr<ServiceManager> &mm_channels,
                       const std::string &file_service_name,
                       const std::string &user_service_name)
        : _es_message(std::make_shared<ESMessage>(es_client)),
          _mysql_message(std::make_shared<MessageTable>(mysql_client)),
          _mm_channels(mm_channels), _file_service_name(file_service_name),
          _user_service_name(user_service_name) {}
    ~MessageServiceImpl() {}

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
        auto msg_list = _mysql_message->range(chat_ssid, stime, etime);
        std::vector<std::string> file_id_list;
        for (auto &msg : msg_list) {
            if (msg.file_id().empty())
                continue;
            file_id_list.push_back(msg.file_id());
        }
        std::vector<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.push_back(msg.user_id());
        }

        std::unordered_map<std::string, std::string> file_data_list;
        bool ret = _GetFile(rid, file_id_list, file_data_list);
        if (ret == false) {
            LOG_ERROR("{} - 批量文件数据下载失败", rid);
            return err_response(request->request_id(), "批量文件数据下载失败");
        }
        std::unordered_map<std::string, UserInfo> user_info_list;
        ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("{} - 批量用户数据获取失败", rid);
            return err_response(request->request_id(), "批量用户数据获取失败");
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
                    ->set_content(file_data_list[msg.file_id()]);
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
                LOG_ERROR("消息类型错误");
                return;
            }
            response->add_msg_list()->mutable_message();
        }
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
        auto msg_list = _mysql_message->recent(chat_ssid, msg_count);
        std::vector<std::string> file_id_list;
        for (auto &msg : msg_list) {
            if (msg.file_id().empty())
                continue;
            file_id_list.push_back(msg.file_id());
        }
        std::vector<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.push_back(msg.user_id());
        }

        std::unordered_map<std::string, std::string> file_data_list;
        bool ret = _GetFile(rid, file_id_list, file_data_list);
        if (ret == false) {
            LOG_ERROR("{} - 批量文件数据下载失败", rid);
            return err_response(request->request_id(), "批量文件数据下载失败");
        }
        std::unordered_map<std::string, UserInfo> user_info_list;
        ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("{} - 批量用户数据获取失败", rid);
            return err_response(request->request_id(), "批量用户数据获取失败");
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
                    ->set_content(file_data_list[msg.file_id()]);
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
                LOG_ERROR("消息类型错误");
                return;
            }
            response->add_msg_list()->mutable_message();
        }
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
        auto msg_list = _es_message->search(skey, chat_ssid);
        std::vector<std::string> user_id_list;
        for (auto &msg : msg_list) {
            user_id_list.push_back(msg.user_id());
        }
        std::unordered_map<std::string, UserInfo> user_info_list;
        bool ret = _GetUser(rid, user_id_list, user_info_list);
        if (ret == false) {
            LOG_ERROR("{} - 批量用户数据获取失败", rid);
            return err_response(request->request_id(), "批量用户数据获取失败");
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
            response->add_msg_list()->mutable_message();
        }
        response->set_request_id(rid);
        response->set_success(true);
        return;
    }

    void onMessage(const char *body, size_t sz) {
        MessageInfo message;
        bool ret = message.ParseFromArray(body, sz);
        if (ret == false) {
            LOG_ERROR("对消费到的消息进行反序列化失败");
            return;
        }
        std::string file_id, file_name, content;
        int64_t file_size;
        switch (message.message().message_type()) {
        case MessageType::STRING:
            content = message.message().string_message().content();
            ret = _es_message->appendData(
                message.sender().user_id(), message.message_id(),
                message.timestamp(), message.chat_session_id(), content);
            if (ret == false) {
                LOG_ERROR("文本消息向存储引擎存储失败");
                return;
            }
            break;
        case MessageType::IMAGE: {
            const auto &msg = message.message().image_message();
            file_size = msg.image_content().size();
            ret = _PutFile("", msg.image_content(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("上传图片到文件子服务失败");
                return;
            }
        } break;
        case MessageType::FILE: {
            const auto &msg = message.message().file_message();
            file_name = msg.file_name();
            file_size = msg.file_size();
            ret = _PutFile(file_name, msg.file_contents(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("上传文件到文件子服务失败");
                return;
            }
        } break;
        case MessageType::SPEECH: {
            const auto &msg = message.message().speech_message();
            file_size = msg.file_contents().size();
            ret = _PutFile("", msg.file_contents(), file_size, file_id);
            if (ret == false) {
                LOG_ERROR("上传语音到文件子服务失败");
                return;
            }
        } break;
        default:
            LOG_ERROR("消息类型错误");
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
            LOG_ERROR("向数据库插入新消息失败");
            return;
        }
    }

private:
    bool
    _GetFile(const std::string &rid,
             const std::vector<std::string> &file_id_list,
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

    bool _GetUser(const std::string &rid,
                  const std::vector<std::string> &user_id_list,
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
    ESMessage::ptr _es_message;
    MessageTable::ptr _mysql_message;
    // rpc调用客户端
    std::string _file_service_name;
    std::string _user_service_name;
    ServiceManager::ptr _mm_channels;
};

class MessageServer {
public:
    using ptr = std::shared_ptr<MessageServer>;
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
            LOG_ERROR("Mysql数据库模块未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("ES数据库模块未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("信道管理模块未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("服务发现模块未初始化");
            abort();
        }
        _rpc_server = std::make_shared<brpc::Server>();

        MessageServiceImpl *message_service =
            new MessageServiceImpl(_es_client, _mysql_client, _mm_channels,
                                   _file_service_name, _user_service_name);
        int ret = _rpc_server->AddService(
            message_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
        if (ret == -1) {
            LOG_ERROR("添加Rpc服务失败");
            abort();
        }
        brpc::ServerOptions options;
        options.idle_timeout_sec = timeout;
        options.num_threads = num_threads;
        ret = _rpc_server->Start(port, &options);
        if (ret == -1) {
            LOG_ERROR("启动Rpc服务失败");
            abort();
        }
        auto callback =
            std::bind(&MessageServiceImpl::onMessage, message_service,
                      std::placeholders::_1, std::placeholders::_2);
        _mq_client->consume(_queue_name, callback);
    }

    MessageServer::ptr build() {
        if (!_mysql_client) {
            LOG_ERROR("Mysql数据库模块未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("ES数据库模块未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("信道管理模块未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("服务发现模块未初始化");
            abort();
        }
        if (!_registry_client) {
            LOG_ERROR("服务注册模块未初始化");
            abort();
        }
        if (!_rpc_server) {
            LOG_ERROR("Rpc服务器模块未初始化");
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