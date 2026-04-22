
#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "data_mysql.hpp"
#include "etcd.hpp"
#include "logger.hpp"
#include "rabbitmq.hpp"
#include "transmite.pb.h"
#include "user-odb.hxx"
#include "user.hxx"
#include "user.pb.h"
#include "utils.hpp"
namespace im_server {

class TransmiteServiceImpl : public MsgTransmitService {
public:
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
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{}- {}未找到用户管理子服务节点", request->request_id(),
                      _user_service_name);
            return err_response(request->request_id(),
                                "未找到文件管理子服务节点");
        }
        UserService_Stub stub(channel.get());
        GetUserInfoReq req;
        GetUserInfoRsp resp;
        brpc::Controller cntl;
        req.set_request_id(rid);
        req.set_user_id(uid);
        stub.GetUserInfo(&cntl, &req, &resp, nullptr);
        if (cntl.Failed() || resp.success() == false) {
            LOG_ERROR("{} - 用户子服务调用失败 - {}", request->request_id(),
                      cntl.ErrorText());
            return err_response(request->request_id(), "用户子服务调用失败");
        }
        MessageInfo message;
        message.set_message_id(uuid());
        message.set_chat_session_id(chat_ssid);
        message.set_timestamp(time(nullptr));
        message.mutable_sender()->CopyFrom(resp.user_info());
        message.mutable_message()->CopyFrom(request->message());
        bool ret = _mq_client->publish(
            _exchange_name, message.SerializeAsString(), _routing_key);
        if (ret == false) {
            LOG_ERROR("{} - 持久化消息发布失败 - {}", request->request_id(),
                      _exchange_name);
            return err_response(request->request_id(), "持久化消息发布失败");
        }
        auto target_list = _mysql_chat_session_member_table->members(chat_ssid);
        for (auto &id : target_list) {
            response->add_target_id_list(id);
        }
        response->set_request_id(rid);
        response->set_success(true);
        response->mutable_message()->CopyFrom(message);
    }

private:
    ChatSessionMemberTable::ptr _mysql_chat_session_member_table;
    std::string _exchange_name;
    std::string _routing_key;
    MQClient::ptr _mq_client;
    // rpc调用客户端
    std::string _user_service_name;
    ServiceManager::ptr _mm_channels;
};

class TransmiteServer {
public:
    using ptr = std::shared_ptr<TransmiteServer>;
    TransmiteServer(const std::shared_ptr<odb::core::database> &mysql_client,
                    const std::shared_ptr<Discoverer> &service_discoverer,
                    const std::shared_ptr<Registrar> &registry_client,
                    const std::shared_ptr<brpc::Server> &rpc_server)
        : _mysql_client(mysql_client), _service_discoverer(service_discoverer),
          _registry_client(registry_client), _rpc_server(rpc_server) {}
    ~TransmiteServer() {}

    // 启动RPC服务器
    void start() { _rpc_server->RunUntilAskedToQuit(); }

private:
    std::shared_ptr<odb::core::database> _mysql_client;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
};

class TransmiteServerBuilder {
public:
    void make_mysql_object(const std::string &user, const std::string &passwd,
                           const std::string &host, const std::string &db,
                           const std::string &cset, int port,
                           int &conn_pool_count) {
        _mysql_client = im_server::ODBFactory::create(
            user, passwd, host, db, cset, port, conn_pool_count);
    }

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

    void make_registry_object(const std::string &reg_host,
                              const std::string &service_name,
                              const std::string &access_host) {
        _registry_client = std::make_shared<Registrar>(reg_host);
        bool ret = _registry_client->registry(service_name, access_host);
        if (ret == false)
            abort();
    }

    void make_mq_object(const std::string &user, const std::string &passwd,
                        const std::string &host,
                        const std::string &exchange_name,
                        const std::string &queue_name,
                        const std::string &routing_key = "routing_key") {
        _exchange_name = exchange_name;
        _routing_key = _routing_key;
        _mq_client = std::make_shared<MQClient>(user, passwd, host);
        _mq_client->declareComponents(_exchange_name, queue_name, _routing_key);
    }

    void make_rpc_object(const uint16_t &port, const uint32_t &timeout,
                         const uint8_t &num_threads) {
        if (!_mysql_client) {
            LOG_ERROR("Mysql数据库模块未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("信道管理模块未初始化");
            abort();
        }
        if (!_mq_client) {
            LOG_ERROR("消息队列模块未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("服务发现模块未初始化");
            abort();
        }
        _rpc_server = std::make_shared<brpc::Server>();
        TransmiteServiceImpl *transmite_service = new TransmiteServiceImpl(
            _mysql_client, _exchange_name, _routing_key, _mq_client,
            _mm_channels, _user_service_name);
        int ret = _rpc_server->AddService(
            transmite_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
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
    }

    TransmiteServer::ptr build() {

        if (!_mq_client) {
            LOG_ERROR("消息队列模块未初始化");
            abort();
        }
        if (!_mysql_client) {
            LOG_ERROR("Mysql数据库模块未初始化");
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
