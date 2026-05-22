/**
 * @file transmite_server.hpp
 * @brief 消息转发服务模块
 * @details 负责消息转发目标解析、消息发布到MQ、会话成员查询
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#define IM_LOG_SERVICE_TAG "消息转发服务"
#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "etcd.hpp"
#include "logger.hpp"
#include "mysql_chat_session_member.hpp"
#include "rabbitmq.hpp"
#include "transmite.pb.h"
#include "user.pb.h"
#include "utils.hpp"
namespace im_server {

/**
 * @class TransmiteServiceImpl
 * @brief 消息转发服务RPC接口实现类
 * @details 负责解析消息转发目标、发布消息到MQ、查询会话成员
 */
class TransmiteServiceImpl : public MsgTransmitService {
public:
    /**
     * @brief 构造函数
     * @param mysql_client MySQL数据库连接（用于查询会话成员）
     * @param exchange_name RabbitMQ交换机名称
     * @param routing_key RabbitMQ路由键
     * @param mq_client RabbitMQ客户端
     * @param mm_channels 下游服务管理器
     * @param user_service_name 用户服务名称
     */
    TransmiteServiceImpl(
        const std::shared_ptr<odb::core::database> &mysql_client,
        const std::string &exchange_name, const std::string &routing_key,
        const std::shared_ptr<MQClient> &mq_client,
        const std::shared_ptr<ServiceManager> &mm_channels,
        const std::string &user_service_name)
        : _mq_client(mq_client),
          _mysql_chat_session_member_table(
              std::make_shared<ChatSessionMemberTable>(mysql_client)),
          _mm_channels(mm_channels), _user_service_name(user_service_name),
          _exchange_name(exchange_name), _routing_key(routing_key) {}
    
    ~TransmiteServiceImpl() {}

    /**
     * @brief 获取消息转发目标列表
     * @param controller RPC控制器
     * @param request 请求（包含发送者ID、会话ID、消息内容）
     * @param response 响应（包含目标用户ID列表、完整消息）
     * @param done RPC回调
     * @details 拉取发送者信息，组装完整消息，发布到MQ，返回会话成员列表
     */
    virtual void
    GetTransmitTarget(::google::protobuf::RpcController *controller,
                      const ::im_server::NewMessageReq *request,
                      ::im_server::GetTransmitTargetRsp *response,
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
        std::string uid = request->user_id();
        std::string chat_ssid = request->chat_session_id();
        const MessageContent &content = request->message();
        
        LOG_INFO("RPC GetTransmitTarget | request_id={} | user_id={} | session_id={} | msg_type={}", 
                 rid, uid, chat_ssid, content.message_type());
        
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("RPC GetTransmitTarget | request_id={} | 阶段=RPC选路 | 结果=失败 | target={}", 
                      rid, _user_service_name);
            return err_response(rid, "未找到用户管理子服务节点");
        }
        
        UserService_Stub stub(channel.get());
        GetUserInfoReq req;
        GetUserInfoRsp resp;
        brpc::Controller cntl;
        req.set_request_id(rid);
        req.set_user_id(uid);
        stub.GetUserInfo(&cntl, &req, &resp, nullptr);
        if (cntl.Failed() || resp.success() == false) {
            LOG_ERROR("RPC GetTransmitTarget | request_id={} | 阶段=拉取发送者信息 | 结果=失败 | brpc={}", 
                      rid, cntl.ErrorText());
            return err_response(rid, "用户子服务调用失败");
        }
        
        MessageInfo message;
        message.set_message_id(uuid());
        message.set_chat_session_id(chat_ssid);
        message.set_timestamp(time(nullptr));
        message.mutable_sender()->CopyFrom(resp.user_info());
        message.mutable_message()->CopyFrom(request->message());
        
        std::string data = message.SerializeAsString();
        LOG_DEBUG("RPC GetTransmitTarget | request_id={} | 阶段=序列化消息 | size={}", rid, data.size());
        
        bool ret = _mq_client->publish(_exchange_name, data, _routing_key);
        if (ret == false) {
            LOG_ERROR("RPC GetTransmitTarget | request_id={} | 阶段=MQ发布 | 结果=失败 | exchange={} | routing_key={}", 
                      rid, _exchange_name, _routing_key);
            return err_response(rid, "持久化消息发布失败");
        }
        
        auto target_list = _mysql_chat_session_member_table->members(chat_ssid);
        LOG_INFO("RPC GetTransmitTarget | request_id={} | 阶段=完成 | target_count={}", rid, target_list.size());
        
        for (auto &id : target_list) {
            response->add_target_id_list(id);
        }
        response->set_request_id(rid);
        response->set_success(true);
        response->mutable_message()->CopyFrom(message);
    }

private:
    ChatSessionMemberTable::ptr _mysql_chat_session_member_table; ///< MySQL会话成员表操作
    std::string _exchange_name;                                   ///< RabbitMQ交换机名称
    std::string _routing_key;                                     ///< RabbitMQ路由键
    MQClient::ptr _mq_client;                                     ///< RabbitMQ客户端
    std::string _user_service_name;                               ///< 用户服务名称
    ServiceManager::ptr _mm_channels;                             ///< 下游服务管理器
};

/**
 * @class TransmiteServer
 * @brief 消息转发服务器主类
 * @details 封装消息转发服务的所有依赖组件，提供启动接口
 */
class TransmiteServer {
public:
    using ptr = std::shared_ptr<TransmiteServer>;
    
    /**
     * @brief 构造函数
     * @param mysql_client MySQL数据库连接
     * @param service_discoverer 服务发现客户端
     * @param registry_client 服务注册客户端
     * @param rpc_server RPC服务器实例
     */
    TransmiteServer(const std::shared_ptr<odb::core::database> &mysql_client,
                    const std::shared_ptr<Discoverer> &service_discoverer,
                    const std::shared_ptr<Registrar> &registry_client,
                    const std::shared_ptr<brpc::Server> &rpc_server)
        : _mysql_client(mysql_client), _service_discoverer(service_discoverer),
          _registry_client(registry_client), _rpc_server(rpc_server) {}
    
    ~TransmiteServer() {}

    /**
     * @brief 启动RPC服务器
     * @details 阻塞运行直到收到退出信号
     */
    void start() { _rpc_server->RunUntilAskedToQuit(); }

private:
    std::shared_ptr<odb::core::database> _mysql_client; ///< MySQL数据库连接
    Discoverer::ptr _service_discoverer;                ///< 服务发现客户端
    Registrar::ptr _registry_client;                    ///< 服务注册客户端
    std::shared_ptr<brpc::Server> _rpc_server;          ///< RPC服务器
};

/**
 * @class TransmiteServerBuilder
 * @brief 消息转发服务器构建器
 * @details 使用Builder模式构建消息转发服务器，按步骤初始化各个组件
 */
class TransmiteServerBuilder {
public:
    /**
     * @brief 创建MySQL客户端
     * @param user 数据库用户名
     * @param passwd 数据库密码
     * @param host 数据库地址
     * @param db 数据库名
     * @param cset 字符集
     * @param port 数据库端口
     * @param conn_pool_count 连接池大小
     */
    void make_mysql_object(const std::string &user, const std::string &passwd,
                           const std::string &host, const std::string &db,
                           const std::string &cset, int port,
                           int &conn_pool_count) {
        _mysql_client = im_server::ODBFactory::create(
            user, passwd, host, db, cset, port, conn_pool_count);
    }

    /**
     * @brief 创建服务发现客户端
     * @param reg_host etcd服务器地址
     * @param base_service_name 服务发现基础路径
     * @param user_service_name 用户服务名称
     * @details 监听用户服务的上下线事件
     */
    void make_discovery_object(const std::string &reg_host,
                               const std::string &base_service_name,
                               const std::string &user_service_name) {
        _user_service_name = user_service_name;
        _mm_channels = std::make_shared<ServiceManager>();
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

    /**
     * @brief 创建服务注册客户端
     * @param reg_host etcd服务器地址
     * @param service_name 服务名称
     * @param access_host 服务访问地址
     * @details 将本服务注册到etcd，失败则终止程序
     */
    void make_registry_object(const std::string &reg_host,
                              const std::string &service_name,
                              const std::string &access_host) {
        _registry_client = std::make_shared<Registrar>(reg_host);
        bool ret = _registry_client->registry(service_name, access_host);
        if (ret == false)
            abort();
    }

    /**
     * @brief 创建RabbitMQ客户端
     * @param user RabbitMQ用户名
     * @param passwd RabbitMQ密码
     * @param host RabbitMQ服务器地址
     * @param exchange_name 交换机名称
     * @param queue_name 队列名称
     * @param routing_key 路由键（默认为"routing_key"）
     * @details 声明交换机、队列并建立绑定关系
     */
 
    void make_mq_object(const std::string &user, const std::string &passwd,
                        const std::string &host,
                        const std::string &exchange_name,
                        const std::string &queue_name,
                        const std::string &routing_key = "routing_key") {
        _exchange_name = exchange_name;
        _routing_key = routing_key;
        _mq_client = std::make_shared<MQClient>(user, passwd, host);
        _mq_client->declareComponents(_exchange_name, queue_name, _routing_key);
    }

    void make_rpc_object(const uint16_t &port, const uint32_t &timeout,
                         const uint8_t &num_threads) {
        if (!_mysql_client) {
            LOG_ERROR("转发服务启动检查失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("转发服务启动检查失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_mq_client) {
            LOG_ERROR("转发服务启动检查失败 | 组件=RabbitMQ | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("转发服务启动检查失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        _rpc_server = std::make_shared<brpc::Server>();
        TransmiteServiceImpl *transmite_service = new TransmiteServiceImpl(
            _mysql_client, _exchange_name, _routing_key, _mq_client,
            _mm_channels, _user_service_name);
        int ret = _rpc_server->AddService(
            transmite_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
        if (ret == -1) {
            LOG_ERROR("转发服务启动失败 | 阶段=添加RPC服务");
            abort();
        }
        brpc::ServerOptions options;
        options.idle_timeout_sec = timeout;
        options.num_threads = num_threads;
        ret = _rpc_server->Start(port, &options);
        if (ret == -1) {
            LOG_ERROR("转发服务启动失败 | 阶段=启动RPC服务器 | port={}", port);
            abort();
        }
        LOG_INFO("转发服务启动成功 | port={} | timeout={}s | threads={}", port, timeout, num_threads);
    }

    TransmiteServer::ptr build() {
        if (!_mq_client) {
            LOG_ERROR("转发服务构建失败 | 组件=RabbitMQ | 原因=未初始化");
            abort();
        }
        if (!_mysql_client) {
            LOG_ERROR("转发服务构建失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("转发服务构建失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("转发服务构建失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        if (!_registry_client) {
            LOG_ERROR("转发服务构建失败 | 组件=etcd服务注册 | 原因=未初始化");
            abort();
        }
        if (!_rpc_server) {
            LOG_ERROR("转发服务构建失败 | 组件=RPC服务器 | 原因=未初始化");
            abort();
        }
        return std::make_shared<TransmiteServer>(
            _mysql_client, _service_discoverer, _registry_client, _rpc_server);
    }

private:
    MQClient::ptr _mq_client;
    std::shared_ptr<odb::core::database> _mysql_client;
    std::string _user_service_name;
    std::string _exchange_name;
    std::string _routing_key;
    ServiceManager::ptr _mm_channels;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
};
} // namespace im_server
