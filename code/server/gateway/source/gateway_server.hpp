#include <brpc/controller.h>
#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "connection.hpp"
#include "data_redis.hpp"
#include "etcd.hpp"
#include "file.pb.h"
#include "friend.pb.h"
#include "gateway.pb.h"
#include "httplib.h"
#include "logger.hpp"
#include "message.pb.h"
#include "notify.pb.h"
#include "speech.pb.h"
#include "transmite.pb.h"
#include "user.pb.h"
#include "utils.hpp"
#include <functional>
#include <memory>
#include <string>
#include <thread>
#include <websocketpp/close.hpp>
#include <websocketpp/frame.hpp>
namespace im_server {
#define GET_PHONE_VERIFY_CODE "/service/user/get_phone_verify_code"
#define USERNAME_REGISTER "/service/user/username_register"
#define USERNAME_LOGIN "/service/user/username_login"
#define PHONE_REGISTER "/service/user/phone_register"
#define PHONE_LOGIN "/service/user/phone_login"
#define GET_USERINFO "/service/user/get_user_info"
#define SET_USER_AVATAR "/service/user/set_avatar"
#define SET_USER_NICKNAME "/service/user/set_nickname"
#define SET_USER_DESC "/service/user/set_description"
#define SET_USER_PHONE "/service/user/set_phone"
#define FRIEND_GET_LIST "/service/friend/get_friend_list"
#define FRIEND_APPLY "/service/friend/add_friend_apply"
#define FRIEND_APPLY_PROCESS "/service/friend/add_friend_process"
#define FRIEND_REMOVE "/service/friend/remove_friend"
#define FRIEND_SEARCH "/service/friend/search_friend"
#define FRIEND_GET_PENDING_EV "/service/friend/get_pending_friend_events"
#define CSS_GET_LIST "/service/friend/get_chat_session_list"
#define CSS_CREATE "/service/friend/create_chat_session"
#define CSS_GET_MEMBER "/service/friend/get_chat_session_member"
#define MSG_GET_RANGE "/service/message_storage/get_history"
#define MSG_GET_RECENT "/service/message_storage/get_recent"
#define MSG_KEY_SEARCH "/service/message_storage/search_history"
#define NEW_MESSAGE "/service/message_transmit/new_message"
#define FILE_GET_SINGLE "/service/file/get_single_file"
#define FILE_GET_MULTI "/service/file/get_multi_file"
#define FILE_PUT_SINGLE "/service/file/put_single_file"
#define FILE_PUT_MULTI "/service/file/put_multi_file"
#define SPEECH_RECOGNITION "/service/speech/recognition"
class GatewayServer {
public:
    using ptr = std::shared_ptr<GatewayServer>;
    GatewayServer(const int &ws_port, const int &http_port,
                  const std::shared_ptr<sw::redis::Redis> &redis_client,
                  const ServiceManager::ptr &mm_channels,
                  const Discoverer::ptr &server_discover,
                  const std::string &file_service_name,
                  const std::string &user_service_name,
                  const std::string &message_service_name,
                  const std::string &speech_service_name,
                  const std::string &transmite_service_name,
                  const std::string &friend_service_name)
        : _redis_session(std::make_shared<Session>(redis_client)),
          _redis_status(std::make_shared<Status>(redis_client)),
          _mm_channels(mm_channels), _service_discoverer(server_discover),
          _file_service_name(file_service_name),
          _user_service_name(user_service_name),
          _message_service_name(message_service_name),
          _speech_service_name(speech_service_name),
          _transmite_service_name(transmite_service_name),
          _friend_service_name(friend_service_name),
          _connections(std::make_shared<Connection>()) {

        _ws_server.set_access_channels(websocketpp::log::elevel::none);
        _ws_server.init_asio();
        _ws_server.set_open_handler(
            std::bind(&GatewayServer::onOpen, this, std::placeholders::_1));
        _ws_server.set_close_handler(
            std::bind(&GatewayServer::onClose, this, std::placeholders::_1));
        _ws_server.set_message_handler(std::bind(&GatewayServer::onMessage,
                                                 this, std::placeholders::_1,
                                                 std::placeholders::_2));
        _ws_server.set_reuse_addr(true);
        _ws_server.listen(ws_port);
        _ws_server.start_accept();
        _http_server.Post(GET_PHONE_VERIFY_CODE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetPhoneVerifyCode, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(USERNAME_REGISTER,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::UserRegister, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(USERNAME_LOGIN,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::UserLogin, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(PHONE_REGISTER,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::PhoneRegister, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(PHONE_LOGIN,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::PhoneLogin, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(GET_USERINFO,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetUserInfo, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(SET_USER_AVATAR,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::SetUserAvatar, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(SET_USER_NICKNAME,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::SetUserNickname, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(SET_USER_DESC,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::SetUserDescription, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(SET_USER_PHONE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::SetUserPhoneNumber, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_GET_LIST,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetFriendList, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_APPLY,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::FriendAdd, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_APPLY_PROCESS,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::FriendAddProcess, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_REMOVE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::FriendRemove, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_SEARCH,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::FriendSearch, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FRIEND_GET_PENDING_EV,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetPendingFriendEventList, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(CSS_GET_LIST,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetChatSessionList, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(CSS_CREATE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::ChatSessionCreate, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(CSS_GET_MEMBER,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetChatSessionMember, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(MSG_GET_RANGE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetHistoryMsg, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(MSG_GET_RECENT,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetRecentMsg, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(MSG_KEY_SEARCH,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::MsgSearch, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(NEW_MESSAGE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::NewMessage, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FILE_GET_SINGLE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetSingleFile, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FILE_GET_MULTI,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::GetMultiFile, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FILE_PUT_SINGLE,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::PutSingleFile, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(FILE_PUT_MULTI,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::PutMultiFile, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_server.Post(SPEECH_RECOGNITION,
                          (httplib::Server::Handler)std::bind(
                              &GatewayServer::SpeechRecognition, this,
                              std::placeholders::_1, std::placeholders::_2));
        _http_thread = std::thread([this, http_port]() {
            _http_server.listen("0.0.0.0", http_port);
            _http_thread.detach();
        });
    }
    ~GatewayServer() {}
    void start() { _ws_server.run(); }

private:
    void onOpen(websocketpp::connection_hdl hdl) {
        std::cout << "websocket长连接建立成功" << std::endl;
        LOG_DEBUG("websocket长连接建立成功：{}",
                  (size_t)_ws_server.get_con_from_hdl(hdl).get());
    }
    void onClose(websocketpp::connection_hdl hdl) {
        auto conn = _ws_server.get_con_from_hdl(hdl);
        std::string ssid, uid;
        bool ret = _connections->client(conn, uid, ssid);
        if (ret == false) {
            LOG_WARN("长连接断开，未找到长连接对应的客户端信息");
            return;
        }
        _redis_session->remove(ssid);
        _redis_status->remove(uid);
        _connections->remove(conn);
        LOG_DEBUG("{}-{}-{} 长连接断开，清理缓存数据", ssid, uid,
                  (size_t)conn.get());
    }
    void onMessage(websocketpp::connection_hdl hdl, server_t::message_ptr msg) {
        auto conn = _ws_server.get_con_from_hdl(hdl);
        ClientAuthenticationReq req;
        bool ret = req.ParseFromString(msg->get_payload());
        if (ret == false) {
            LOG_ERROR("长连接身份识别失败,正文反序列化失败");
            _ws_server.close(hdl, websocketpp::close::status::unsupported_data,
                             "正文反序列化失败");
            return;
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("长连接身份识别失败,未找到会话信息 {}", ssid);
            _ws_server.close(hdl, websocketpp::close::status::unsupported_data,
                             "未找到会话信息");
            return;
        }
        _connections->insert(conn, *uid, ssid);
        LOG_DEBUG("新增长连接管理：{}-{}-{}", ssid, *uid, (size_t)conn.get());
    }

    void GetPhoneVerifyCode(const httplib::Request &request,
                            httplib::Response &response) {
        PhoneVerifyCodeReq req;
        PhoneVerifyCodeRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取短信验证码请求反序列化失败");
            return err_response("获取短信验证码请求反序列化失败");
        }

        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.GetPhoneVerifyCode(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void UserRegister(const httplib::Request &request,
                      httplib::Response &response) {
        UserRegisterReq req;
        UserRegisterRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("用户名注册请求反序列化失败");
            return err_response("用户名注册请求反序列化失败");
        }

        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.UserRegister(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void UserLogin(const httplib::Request &request,
                   httplib::Response &response) {
        UserLoginReq req;
        UserLoginRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("用户登录请求反序列化失败");
            return err_response("用户登录请求反序列化失败");
        }

        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.UserLogin(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void PhoneRegister(const httplib::Request &request,
                       httplib::Response &response) {
        PhoneRegisterReq req;
        PhoneRegisterRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("手机号注册请求反序列化失败");
            return err_response("手机号注册请求反序列化失败");
        }

        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.PhoneRegister(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void PhoneLogin(const httplib::Request &request,
                    httplib::Response &response) {
        PhoneLoginReq req;
        PhoneLoginRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("手机号登录请求反序列化失败");
            return err_response("手机号登录请求反序列化失败");
        }

        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.PhoneLogin(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetUserInfo(const httplib::Request &request,
                     httplib::Response &response) {
        GetUserInfoReq req;
        GetUserInfoRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取用户信息请求反序列化失败");
            return err_response("获取用户信息请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.GetUserInfo(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void SetUserAvatar(const httplib::Request &request,
                       httplib::Response &response) {
        SetUserAvatarReq req;
        SetUserAvatarRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("设置用户头像请求反序列化失败");
            return err_response("设置用户头像请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.SetUserAvatar(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void SetUserNickname(const httplib::Request &request,
                         httplib::Response &response) {
        SetUserNicknameReq req;
        SetUserNicknameRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("设置用户名称请求反序列化失败");
            return err_response("设置用户名称请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.SetUserNickname(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void SetUserDescription(const httplib::Request &request,
                            httplib::Response &response) {
        SetUserDescriptionReq req;
        SetUserDescriptionRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("设置用户签名请求反序列化失败");
            return err_response("设置用户签名请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.SetUserDescription(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void SetUserPhoneNumber(const httplib::Request &request,
                            httplib::Response &response) {
        SetUserPhoneNumberReq req;
        SetUserPhoneNumberRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("设置用户手机号请求反序列化失败");
            return err_response("设置用户手机号请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的用户子服务节点");
        }
        UserService_Stub stub(channel.get());
        stub.SetUserPhoneNumber(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return err_response("用户子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetFriendList(const httplib::Request &request,
                       httplib::Response &response) {
        GetFriendListReq req;
        GetFriendListRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取好友列表请求反序列化失败");
            return err_response("获取好友列表请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.GetFriendList(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }

    std::shared_ptr<GetUserInfoRsp> _GetUserInfo(const std::string &rid,
                                                 const std::string &uid) {
        GetUserInfoReq req;
        auto rsp = std::make_shared<GetUserInfoRsp>();
        brpc::Controller cntl;
        std::string ssid = req.session_id();
        req.set_user_id(uid);
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的用户子服务节点",
                      req.request_id());
            return rsp;
        }
        UserService_Stub stub(channel.get());
        stub.GetUserInfo(&cntl, &req, rsp.get(), nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 用户子服务调用失败", req.request_id());
            return rsp;
        }
        return rsp;
    }

    void FriendAdd(const httplib::Request &request,
                   httplib::Response &response) {
        FriendAddReq req;
        FriendAddRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("申请好友请求反序列化失败");
            return err_response("申请好友请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.FriendAdd(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        auto conn = _connections->connection(*uid);
        if (rsp.success() == true && conn) {
            auto user_rsp = _GetUserInfo(req.request_id(), *uid);
            if (!user_rsp) {
                LOG_ERROR("{} 获取用户信息失败", req.request_id());
                return err_response("获取用户信息失败");
            }
            NotifyMessage notify;
            notify.set_notify_type(NotifyType::FRIEND_ADD_APPLY_NOTIFY);
            notify.mutable_friend_add_apply()->mutable_user_info()->CopyFrom(
                user_rsp->user_info());
            conn->send(notify.SerializeAsString(),
                       websocketpp::frame::opcode::binary);
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void FriendAddProcess(const httplib::Request &request,
                          httplib::Response &response) {
        FriendAddProcessReq req;
        FriendAddProcessRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("申请好友请求反序列化失败");
            return err_response("申请好友请求反序列化失败");
        }
        std::string ssid = req.session_id();
        std::string apply_id = req.apply_user_id();
        bool argee = req.agree();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.FriendAddProcess(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        if (rsp.success() == true) {
            std::string new_session_id = rsp.new_session_id();
            auto process_user_rsp = _GetUserInfo(req.request_id(), *uid);
            if (!process_user_rsp) {
                LOG_ERROR("{} 获取用户信息失败", req.request_id());
                return err_response("获取用户信息失败");
            }
            auto apply_user_rsp = _GetUserInfo(req.request_id(), apply_id);
            if (!apply_user_rsp) {
                LOG_ERROR("{} 获取用户信息失败", req.request_id());
                return err_response("获取用户信息失败");
            }
            auto process_conn = _connections->connection(*uid);
            if (!process_conn) {
                LOG_ERROR("{} 获取用户信息失败", req.request_id());
            }
            auto apply_conn = _connections->connection(apply_id);
            if (!apply_conn) {
                LOG_ERROR("{} 获取用户信息失败", req.request_id());
            }
            if (argee && apply_conn) {
                NotifyMessage notify;
                notify.set_notify_type(NotifyType::FRIEND_ADD_PROCESS_NOTIFY);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_single_chat_friend_id(*uid);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_chat_session_id(new_session_id);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_avatar(process_user_rsp->user_info().avatar());
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_chat_session_name(
                        process_user_rsp->user_info().nickname());
                apply_conn->send(notify.SerializeAsString(),
                                 websocketpp::frame::opcode::binary);
            }
            if (argee && process_conn) {
                NotifyMessage notify;
                notify.set_notify_type(NotifyType::FRIEND_ADD_PROCESS_NOTIFY);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_single_chat_friend_id(apply_id);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_chat_session_id(new_session_id);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_avatar(apply_user_rsp->user_info().avatar());
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->set_chat_session_name(
                        apply_user_rsp->user_info().nickname());
                process_conn->send(notify.SerializeAsString(),
                                   websocketpp::frame::opcode::binary);
            }
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void FriendRemove(const httplib::Request &request,
                      httplib::Response &response) {
        FriendRemoveReq req;
        FriendRemoveRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("好友删除请求反序列化失败");
            return err_response("好友删除请求反序列化失败");
        }
        std::string ssid = req.session_id();
        std::string peer_id = req.peer_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.FriendRemove(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        auto conn = _connections->connection(peer_id);
        if (rsp.success() == true && conn) {
            NotifyMessage notify;
            notify.set_notify_type(NotifyType::FRIEND_REMOVE_NOTIFY);
            notify.mutable_friend_remove()->set_user_id(*uid);
            conn->send(notify.SerializeAsString(),
                       websocketpp::frame::opcode::binary);
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void FriendSearch(const httplib::Request &request,
                      httplib::Response &response) {
        FriendSearchReq req;
        FriendSearchRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("好友搜索请求反序列化失败");
            return err_response("好友搜索请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.FriendSearch(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetPendingFriendEventList(const httplib::Request &request,
                                   httplib::Response &response) {
        GetPendingFriendEventListReq req;
        GetPendingFriendEventListRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取待处理好友申请请求反序列化失败");
            return err_response("获取待处理好友申请请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.GetPendingFriendEventList(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetChatSessionList(const httplib::Request &request,
                            httplib::Response &response) {
        GetChatSessionListReq req;
        GetChatSessionListRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取聊天会话列表申请请求反序列化失败");
            return err_response("获取聊天会话列表申请请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.GetChatSessionList(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetChatSessionMember(const httplib::Request &request,
                              httplib::Response &response) {
        GetChatSessionMemberReq req;
        GetChatSessionMemberRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取聊天会话成员信息申请请求反序列化失败");
            return err_response("获取聊天会话成员信息申请请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.GetChatSessionMember(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void ChatSessionCreate(const httplib::Request &request,
                           httplib::Response &response) {
        ChatSessionCreateReq req;
        ChatSessionCreateRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("创建聊天会话请求反序列化失败");
            return err_response("创建聊天会话请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_friend_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的好友子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的好友子服务节点");
        }
        FriendService_Stub stub(channel.get());
        stub.ChatSessionCreate(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 好友子服务调用失败", req.request_id());
            return err_response("好友子服务调用失败");
        }
        if (rsp.success() == true) {
            for (int i = 0; i < req.member_id_list_size(); i++) {
                auto conn = _connections->connection(req.member_id_list(i));
                if (!conn) {
                    continue;
                }
                NotifyMessage notify;
                notify.set_notify_type(NotifyType::CHAT_SESSION_CREATE_NOTIFY);
                notify.mutable_new_chat_session_info()
                    ->mutable_chat_session_info()
                    ->CopyFrom(rsp.chat_session_info());
                conn->send(notify.SerializeAsString(),
                           websocketpp::frame::opcode::binary);
            }
        }
        rsp.clear_chat_session_info();
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetHistoryMsg(const httplib::Request &request,
                       httplib::Response &response) {
        GetHistoryMsgReq req;
        GetHistoryMsgRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取历史区间消息请求反序列化失败");
            return err_response("获取历史区间消息请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的消息存储子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的消息存储子服务节点");
        }
        MsgStorageService_Stub stub(channel.get());
        stub.GetHistoryMsg(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 消息存储子服务调用失败", req.request_id());
            return err_response("消息存储子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetRecentMsg(const httplib::Request &request,
                      httplib::Response &response) {
        GetRecentMsgReq req;
        GetRecentMsgRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("获取最近消息请求反序列化失败");
            return err_response("获取最近消息请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的消息存储子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的消息存储子服务节点");
        }
        MsgStorageService_Stub stub(channel.get());
        stub.GetRecentMsg(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 消息存储子服务调用失败", req.request_id());
            return err_response("消息存储子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void MsgSearch(const httplib::Request &request,
                   httplib::Response &response) {
        MsgSearchReq req;
        MsgSearchRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("消息搜索请求反序列化失败");
            return err_response("消息搜索请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的消息存储子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的消息存储子服务节点");
        }
        MsgStorageService_Stub stub(channel.get());
        stub.MsgSearch(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 消息存储子服务调用失败", req.request_id());
            return err_response("消息存储子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetSingleFile(const httplib::Request &request,
                       httplib::Response &response) {
        GetSingleFileReq req;
        GetSingleFileRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("单文件下载请求反序列化失败");
            return err_response("单文件下载请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的文件子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的文件子服务节点");
        }
        FileService_Stub stub(channel.get());
        stub.GetSingleFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 文件子服务调用失败", req.request_id());
            return err_response("文件子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void GetMultiFile(const httplib::Request &request,
                      httplib::Response &response) {
        GetMultiFileReq req;
        GetMultiFileRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("多文件下载请求反序列化失败");
            return err_response("多文件下载请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的文件子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的文件子服务节点");
        }
        FileService_Stub stub(channel.get());
        stub.GetMultiFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 文件子服务调用失败", req.request_id());
            return err_response("文件子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void PutSingleFile(const httplib::Request &request,
                       httplib::Response &response) {
        PutSingleFileReq req;
        PutSingleFileRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("单文件上传请求反序列化失败");
            return err_response("单文件上传请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的文件子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的文件子服务节点");
        }
        FileService_Stub stub(channel.get());
        stub.PutSingleFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 文件子服务调用失败", req.request_id());
            return err_response("文件子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void PutMultiFile(const httplib::Request &request,
                      httplib::Response &response) {
        PutMultiFileReq req;
        PutMultiFileRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("多文件上传请求反序列化失败");
            return err_response("多文件上传请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的文件子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的文件子服务节点");
        }
        FileService_Stub stub(channel.get());
        stub.PutMultiFile(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 文件子服务调用失败", req.request_id());
            return err_response("文件子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void SpeechRecognition(const httplib::Request &request,
                           httplib::Response &response) {
        SpeechRecognitionReq req;
        SpeechRecognitionRsp rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("语音识别请求反序列化失败");
            return err_response("语音识别请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的语音子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的语音子服务节点");
        }
        SpeechService_Stub stub(channel.get());
        stub.SpeechRecognition(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 语音子服务调用失败", req.request_id());
            return err_response("语音子服务调用失败");
        }
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }
    void NewMessage(const httplib::Request &request,
                    httplib::Response &response) {
        NewMessageReq req;
        NewMessageRsp rsp;
        GetTransmitTargetRsp target_rsp;
        brpc::Controller cntl;
        auto err_response = [&req, &rsp, &response](const std::string &errmsg) {
            rsp.set_success(false);
            rsp.set_errmsg(errmsg);
            response.set_content(rsp.SerializeAsString(),
                                 "application/x-protbuf");
        };
        bool ret = req.ParseFromString(request.body);
        if (ret == false) {
            LOG_ERROR("新消息请求反序列化失败");
            return err_response("新消息请求反序列化失败");
        }
        std::string ssid = req.session_id();
        auto uid = _redis_session->uid(ssid);
        if (!uid) {
            LOG_ERROR("{} 获取登录会话关联信息失败", ssid);
            return err_response("获取登录会话关联信息失败");
        }
        req.set_user_id(*uid);
        auto channel = _mm_channels->choose(_transmite_service_name);
        if (!channel) {
            LOG_ERROR("{} 未找到可供业务处理的消息转发子服务节点",
                      req.request_id());
            return err_response("未找到可供业务处理的消息转发子服务节点");
        }
        MsgTransmitService_Stub stub(channel.get());
        stub.GetTransmitTarget(&cntl, &req, &target_rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("{} 消息转发子服务调用失败", req.request_id());
            return err_response("消息转发子服务调用失败");
        }
        if (target_rsp.success() == true) {
            for (int i = 0; i < target_rsp.target_id_list_size(); i++) {
                std::string notify_id = target_rsp.target_id_list(i);
                if (notify_id == *uid) {
                    continue;
                }
                auto conn = _connections->connection(notify_id);
                if (!conn) {
                    continue;
                }
                NotifyMessage notify;
                notify.set_notify_type(NotifyType::CHAT_MESSAGE_NOTIFY);
                notify.mutable_new_message_info()
                    ->mutable_message_info()
                    ->CopyFrom(target_rsp.message());
                conn->send(notify.SerializeAsString(),
                           websocketpp::frame::opcode::binary);
            }
        }
        rsp.set_request_id(req.request_id());
        rsp.set_success(target_rsp.success());
        rsp.set_errmsg(target_rsp.errmsg());
        response.set_content(rsp.SerializeAsString(), "application/x-protbuf");
    }

private:
    Session::ptr _redis_session;
    Status::ptr _redis_status;

    // rpc调用客户端
    std::string _file_service_name;
    std::string _user_service_name;
    std::string _message_service_name;
    std::string _speech_service_name;
    std::string _transmite_service_name;
    std::string _friend_service_name;
    ServiceManager::ptr _mm_channels;

    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;

    Connection::ptr _connections;
    server_t _ws_server;
    httplib::Server _http_server;
    std::thread _http_thread;
};

class GatewayServerBuilder {
public:
    void make_redis_object(const std::string &host, int port, int db,
                           bool keep_alive) {
        _redis_client =
            im_server::RedisClientFactory::create(host, port, db, keep_alive);
    }

    void make_discovery_object(const std::string &reg_host,
                               const std::string &base_service_name,
                               const std::string &file_service_name,
                               const std::string &user_service_name,
                               const std::string &message_service_name,
                               const std::string &speech_service_name,
                               const std::string &transmite_service_name,
                               const std::string &friend_service_name) {
        _file_service_name = file_service_name;
        _user_service_name = user_service_name;
        _message_service_name = message_service_name;
        _speech_service_name = speech_service_name;
        _transmite_service_name = transmite_service_name;
        _friend_service_name = friend_service_name;
        _mm_channels = std::make_shared<ServiceManager>();
        _mm_channels->declared(_file_service_name);
        _mm_channels->declared(_user_service_name);
        _mm_channels->declared(_message_service_name);
        _mm_channels->declared(_speech_service_name);
        _mm_channels->declared(_transmite_service_name);
        _mm_channels->declared(_friend_service_name);
        auto put_cb =
            std::bind(&ServiceManager::onServiceOnline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        auto del_cb =
            std::bind(&ServiceManager::onServiceOffline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        _service_discoverer = std::make_shared<Discoverer>(
            reg_host, base_service_name, put_cb, del_cb);
    }
    void make_server_object(const int &ws_port, const int &http_port) {
        _ws_port = ws_port;
        _http_port = http_port;
    }
    GatewayServer::ptr build() {

        if (!_redis_client) {
            LOG_ERROR("Redis数据库模块未初始化");
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

        return std::make_shared<GatewayServer>(
            _ws_port, _http_port, _redis_client, _mm_channels,
            _service_discoverer, _file_service_name, _user_service_name,
            _message_service_name, _speech_service_name,
            _transmite_service_name, _friend_service_name);
    }

private:
    int _ws_port;
    int _http_port;
    std::shared_ptr<sw::redis::Redis> _redis_client;
    std::string _file_service_name;
    std::string _user_service_name;
    std::string _message_service_name;
    std::string _speech_service_name;
    std::string _transmite_service_name;
    std::string _friend_service_name;
    ServiceManager::ptr _mm_channels;
    Discoverer::ptr _service_discoverer;
};
}; // namespace im_server