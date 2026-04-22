#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "data_es.hpp"
#include "data_redis.hpp"
#include "dms.hpp"
#include "etcd.hpp"
#include "file.pb.h"
#include "logger.hpp"
#include "mysql_user.hpp"
#include "user.pb.h"
#include "utils.hpp"
#include <functional>
namespace im_server {

// ESUser::ptr _es_user;
// UserTable::ptr _mysql_user;
// Session::ptr _redis_session;
// Status::ptr _redis_status;
// Code::ptr _redis_code;

// // rpc调用客户端
// std::string _file_service_name;
// ServiceManager::ptr ;

class UserServiceImpl : public UserService {
public:
    UserServiceImpl(const std::shared_ptr<DMSClient> &dms_client,
                    const std::shared_ptr<sw::redis::Redis> &redis_client,
                    const std::shared_ptr<odb::core::database> &mysql_client,
                    const std::shared_ptr<elasticlient::Client> &es_client,
                    const std::shared_ptr<ServiceManager> &mm_channels,
                    const std::string &file_service_name)
        : _es_user(std::make_shared<ESUser>(es_client)),
          _mysql_user(std::make_shared<UserTable>(mysql_client)),
          _redis_session(std::make_shared<Session>(redis_client)),
          _redis_status(std::make_shared<Status>(redis_client)),
          _redis_code(std::make_shared<Code>(redis_client)),
          _mm_channels(mm_channels), _file_service_name(file_service_name),
          _dms_client(dms_client) {}
    ~UserServiceImpl() {}

    bool nickname_check(const std::string &nickname) {
        return nickname.size() < 22;
    }
    bool password_check(const std::string &password) {
        if (password.size() < 6 || password.size() > 15) {
            LOG_ERROR("密码长度不合法: {}-{}", password, password.size());
            return false;
        }
        for (int i = 0; i < password.size(); i++) {
            if (!((password[i] >= 'a' && password[i] <= 'z') ||
                  (password[i] >= 'A' && password[i] <= 'Z') ||
                  (password[i] >= '0' && password[i] <= '9') ||
                  (password[i] == '-') || (password[i] == '_'))) {
                LOG_ERROR("密码字符不合法: {}", password);
                return false;
            }
        }
        return true;
    }

    bool phone_check(const std::string &phone) {
        if (phone.size() != 11) {
            LOG_ERROR("手机号长度不合法: {}", phone);
            return false;
        }
        if (phone[0] != '1' || phone[1] < '3' || phone[1] > '9') {
            LOG_ERROR("手机号不合法: {}", phone);
            return false;
        }
        for (int i = 0; i < 11; i++) {
            if (!(phone[i] >= '0' && phone[i] <= '9')) {
                LOG_ERROR("手机号字符不合法: {}", phone);
                return false;
            }
        }
        return true;
    }

    virtual void UserRegister(google::protobuf::RpcController *controller,
                              const ::im_server::UserRegisterReq *request,
                              ::im_server::UserRegisterRsp *response,
                              ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        std::string nickname = request->nickname();
        std::string password = request->password();
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        bool ret = nickname_check(nickname);
        if (ret == false) {
            LOG_ERROR("{} - 用户名长度不合法", request->request_id());
            return err_response(request->request_id(), "用户名长度不合法");
        }
        ret = password_check(password);
        if (ret == false) {
            LOG_ERROR("{} - 密码格式不合法", request->request_id());
            return err_response(request->request_id(), "密码格式不合法");
        }
        auto user = _mysql_user->select_by_nickname(nickname);
        if (user) {
            LOG_ERROR("{} - 用户名被占用 - {}", request->request_id(),
                      nickname);
            return err_response(request->request_id(), "用户名被占用");
        }
        std::string uid = uuid();
        user = std::make_shared<User>(uid, nickname, password);
        ret = _mysql_user->insert(user);
        if (ret == false) {
            LOG_ERROR("{} - Mysql数据库新增数据失败", request->request_id());
            return err_response(request->request_id(),
                                "Mysql数据库新增数据失败");
        }
        ret = _es_user->appendData(uid, "", nickname, "", "");
        if (ret == false) {
            LOG_ERROR("{} - ES搜索引擎新增数据失败", request->request_id());
            return err_response(request->request_id(),
                                "ES搜索引擎新增数据失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }
    virtual void UserLogin(google::protobuf::RpcController *controller,
                           const ::im_server::UserLoginReq *request,
                           ::im_server::UserLoginRsp *response,
                           ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        std::string nickname = request->nickname();
        std::string password = request->password();
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        auto user = _mysql_user->select_by_nickname(nickname);
        if (!user || user->password() != password) {
            LOG_ERROR("{} - 用户名或密码错误 - {} ", request->request_id(),
                      nickname);
            return err_response(request->request_id(), "用户名或密码错误");
        }
        bool ret = _redis_status->exists(nickname);
        if (ret == true) {
            LOG_ERROR("{} - 用户已在其他地方登录 - {}", request->request_id(),
                      nickname);
            return err_response(request->request_id(), "用户已在其他地方登录");
        }
        std::string ssid = uuid();
        _redis_session->append(ssid, user->user_id());
        _redis_status->append(ssid);
        response->set_request_id(request->request_id());
        response->set_success(true);
        response->set_login_session_id(ssid);
    }
    virtual void
    GetPhoneVerifyCode(google::protobuf::RpcController *controller,
                       const ::im_server::PhoneVerifyCodeReq *request,
                       ::im_server::PhoneVerifyCodeRsp *response,
                       ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        std::string phone = request->phone_number();
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        bool ret = phone_check(phone);
        if (ret == false) {
            LOG_ERROR("{} - 手机号码格式错误 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "用户名或密码错误");
        }
        std::string code = vcode();
        std::string code_id = uuid();
        ret = _dms_client->send(phone, code);
        if (ret == false) {
            LOG_ERROR("{} - 短信验证码发送失败 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "短信验证码发送失败");
        }
        _redis_code->append(code_id, code);
        response->set_success(true);
        response->set_request_id(request->request_id());
        response->set_verify_code_id(code_id);
    }
    virtual void PhoneRegister(google::protobuf::RpcController *controller,
                               const ::im_server::PhoneRegisterReq *request,
                               ::im_server::PhoneRegisterRsp *response,
                               ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        std::string phone = request->phone_number();
        std::string code = request->verify_code();
        std::string code_id = request->verify_code_id();
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        bool ret = phone_check(phone);
        if (ret == false) {
            LOG_ERROR("{} - 手机号码格式错误 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "用户名或密码错误");
        }
        auto vcode = _redis_code->code(code_id);
        if (vcode != code) {
            LOG_ERROR("{} - 手机验证码错误 - {} - {}", request->request_id(),
                      code_id, code);
            return err_response(request->request_id(), "手机验证码错误");
        }
        _redis_code->remove(code_id);
        auto user = _mysql_user->select_by_phone(phone);
        if (user) {
            LOG_ERROR("{} - 该手机号已注册过用户 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "该手机号已注册过用户");
        }
        std::string uid = uuid();
        user = std::make_shared<User>(uid, phone);
        ret = _mysql_user->insert(user);
        if (ret == false) {
            LOG_ERROR("{} - Mysql数据库新增数据失败", request->request_id());
            return err_response(request->request_id(),
                                "Mysql数据库新增数据失败");
        }
        ret = _es_user->appendData(uid, phone, uid, "", "");
        if (ret == false) {
            LOG_ERROR("{} - ES搜索引擎新增数据失败", request->request_id());
            return err_response(request->request_id(),
                                "ES搜索引擎新增数据失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }
    virtual void PhoneLogin(google::protobuf::RpcController *controller,
                            const ::im_server::PhoneLoginReq *request,
                            ::im_server::PhoneLoginRsp *response,
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
        std::string phone = request->phone_number();
        std::string code = request->verify_code();
        std::string code_id = request->verify_code_id();
        bool ret = phone_check(phone);
        if (ret == false) {
            LOG_ERROR("{} - 手机号码格式错误 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "用户名或密码错误");
        }
        auto vcode = _redis_code->code(code_id);
        if (vcode != code) {
            LOG_ERROR("{} - 手机验证码错误 - {} - {}", request->request_id(),
                      code_id, code);
            return err_response(request->request_id(), "手机验证码错误");
        }
        _redis_code->remove(code_id);
        auto user = _mysql_user->select_by_phone(phone);
        if (!user) {
            LOG_ERROR("{} - 该手机号未注册过用户 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "该手机号未注册过用户");
        }
        ret = _redis_status->exists(user->user_id());
        if (ret == true) {
            LOG_ERROR("{} - 用户已在其他地方登录 - {}", request->request_id(),
                      phone);
            return err_response(request->request_id(), "用户已在其他地方登录");
        }
        std::string ssid = uuid();
        _redis_session->append(ssid, user->user_id());
        _redis_status->append(ssid);
        response->set_request_id(request->request_id());
        response->set_success(true);
        response->set_login_session_id(ssid);
    }
    virtual void GetUserInfo(google::protobuf::RpcController *controller,
                             const ::im_server::GetUserInfoReq *request,
                             ::im_server::GetUserInfoRsp *response,
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
        std::string uid = request->user_id();
        auto user = _mysql_user->select_by_id(uid);
        if (!user) {
            LOG_ERROR("{} - 未找到用户信息 - {}", request->request_id(), uid);
            return err_response(request->request_id(), "未找到用户信息");
        }
        UserInfo *user_info = response->mutable_user_info();
        user_info->set_user_id(user->user_id());
        user_info->set_nickname(user->nickname());
        user_info->set_description(user->description());
        user_info->set_phone(user->phone());
        if (!user->avatar_id().empty()) {
            auto channel = _mm_channels->choose(_file_service_name);
            if (!channel) {
                LOG_ERROR("{} - 未找到文件管理子服务节点 - {} - {}",
                          request->request_id(), _file_service_name, uid);
                return err_response(request->request_id(),
                                    "未找到文件管理子服务节点");
            }
            FileService_Stub stub(channel.get());
            GetSingleFileReq req;
            GetSingleFileRsp resp;
            brpc::Controller cntl;
            req.set_request_id(request->request_id());
            req.set_file_id(user->avatar_id());
            std::string file_content;
            stub.GetSingleFile(&cntl, &req, &resp, nullptr);
            if (cntl.Failed() || resp.success() == false) {
                LOG_ERROR("{} - 文件子服务调用失败 - {}", request->request_id(),
                          cntl.ErrorText());
                return err_response(request->request_id(),
                                    "文件子服务调用失败");
            }
            user_info->set_avatar(resp.file_data().file_content());
        }
        response->set_request_id(request->request_id());
        response->set_success(true);
    }
    virtual void
    GetMultiUserInfo(google::protobuf::RpcController *controller,
                     const ::im_server::GetMultiUserInfoReq *request,
                     ::im_server::GetMultiUserInfoRsp *response,
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
        std::vector<std::string> uid_list;
        for (int i = 0; i < request->users_id_size(); i++) {
            uid_list.push_back(request->users_id(i));
        }
        auto users = _mysql_user->select_multi_users(uid_list);
        if (users.size() != uid_list.size()) {
            LOG_ERROR("{} - 从数据库查找的用户数量不一致 - {} - {}",
                      request->request_id(), uid_list.size(), users.size());
            return err_response(request->request_id(),
                                "从数据库查找的用户数量不一致");
        }
        auto channel = _mm_channels->choose(_file_service_name);
        if (!channel) {
            LOG_ERROR("{} - 未找到文件管理子服务节点 - {}",
                      request->request_id(), _file_service_name);
            return err_response(request->request_id(),
                                "未找到文件管理子服务节点");
        }
        FileService_Stub stub(channel.get());
        GetMultiFileReq req;
        GetMultiFileRsp resp;
        brpc::Controller cntl;
        req.set_request_id(request->request_id());
        for (auto &u : users) {
            if (u.avatar_id().empty())
                continue;
            req.add_file_id_list(u.avatar_id());
        }
        stub.GetMultiFile(&cntl, &req, &resp, nullptr);
        if (cntl.Failed() || resp.success() == false) {
            LOG_ERROR("{} - 文件子服务调用失败 - {}", request->request_id(),
                      cntl.ErrorText());
            return err_response(request->request_id(), "文件子服务调用失败");
        }
        for (auto &user : users) {
            auto users_map = response->mutable_users_info();
            auto file_map = resp.mutable_file_data();
            UserInfo user_info;
            user_info.set_user_id(user.user_id());
            user_info.set_nickname(user.nickname());
            user_info.set_description(user.description());
            user_info.set_phone(user.phone());
            user_info.set_avatar((*file_map)[user.avatar_id()].file_content());
            (*users_map)[user.user_id()] = user_info;
        }
        response->set_request_id(request->request_id());
        response->set_success(true);
    }
    virtual void SetUserAvatar(google::protobuf::RpcController *controller,
                               const ::im_server::SetUserAvatarReq *request,
                               ::im_server::SetUserAvatarRsp *response,
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
        std::string uid = request->user_id();
        auto user = _mysql_user->select_by_id(uid);
        if (!user) {
            LOG_ERROR("{} - 未找到用户信息 - {}", request->request_id(), uid);
            return err_response(request->request_id(), "未找到用户信息");
        }
        auto channel = _mm_channels->choose(_file_service_name);
        if (!channel) {
            LOG_ERROR("{} - 未找到文件管理子服务节点 - {} - {}",
                      request->request_id(), _file_service_name, uid);
            return err_response(request->request_id(),
                                "未找到文件管理子服务节点");
        }
        FileService_Stub stub(channel.get());
        PutSingleFileReq req;
        PutSingleFileRsp resp;
        brpc::Controller cntl;
        req.set_request_id(request->request_id());
        req.mutable_file_data()->set_file_content(request->avatar());
        req.mutable_file_data()->set_file_size(request->avatar().size());
        stub.PutSingleFile(&cntl, &req, &resp, nullptr);
        if (cntl.Failed() || resp.success() == false) {
            LOG_ERROR("{} - 文件子服务调用失败 - {}", request->request_id(),
                      cntl.ErrorText());
            return err_response(request->request_id(), "文件子服务调用失败");
        }
        std::string avatar_id = resp.file_info().file_id();
        user->avatar_id(avatar_id);
        bool ret = _mysql_user->update(user);
        if (ret == false) {
            LOG_ERROR("{} - 更新Mysql数据库用户头像ID失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "更新Mysql数据库用户头像ID失败");
        }
        ret = _es_user->appendData(user->user_id(), user->phone(),
                                   user->nickname(), user->description(),
                                   user->avatar_id());
        if (ret == false) {
            LOG_ERROR("{} - 更新ES搜索引擎用户头像ID失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "ES搜索引擎用户头像ID失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }
    virtual void SetUserNickname(google::protobuf::RpcController *controller,
                                 const ::im_server::SetUserNicknameReq *request,
                                 ::im_server::SetUserNicknameRsp *response,
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
        std::string uid = request->user_id();
        std::string new_nickname = request->nickname();
        bool ret = nickname_check(new_nickname);
        if (ret == false) {
            LOG_ERROR("{} - 用户名长度不合法 {} - {}", request->request_id(),
                      new_nickname, new_nickname.size());
            return err_response(request->request_id(), "用户名长度不合法");
        }
        auto user = _mysql_user->select_by_id(uid);
        if (!user) {
            LOG_ERROR("{} - 未找到用户信息 - {}", request->request_id(), uid);
            return err_response(request->request_id(), "未找到用户信息");
        }
        user->nickname(new_nickname);
        ret = _mysql_user->update(user);
        if (ret == false) {
            LOG_ERROR("{} - 更新Mysql数据库用户昵称失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "更新Mysql数据库用户昵称失败");
        }
        ret = _es_user->appendData(user->user_id(), user->phone(),
                                   user->nickname(), user->description(),
                                   user->avatar_id());
        if (ret == false) {
            LOG_ERROR("{} - 更新ES搜索引擎用户昵称失败", request->request_id());
            return err_response(request->request_id(),
                                "更新ES搜索引擎用户昵称失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }
    virtual void
    SetUserDescription(google::protobuf::RpcController *controller,
                       const ::im_server::SetUserDescriptionReq *request,
                       ::im_server::SetUserDescriptionRsp *response,
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
        std::string uid = request->user_id();
        std::string new_description = request->description();
        auto user = _mysql_user->select_by_id(uid);
        if (!user) {
            LOG_ERROR("{} - 未找到用户信息 - {}", request->request_id(), uid);
            return err_response(request->request_id(), "未找到用户信息");
        }
        user->description(new_description);
        bool ret = _mysql_user->update(user);
        if (ret == false) {
            LOG_ERROR("{} - 更新Mysql数据库用户签名失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "更新Mysql数据库用户签名失败");
        }
        ret = _es_user->appendData(user->user_id(), user->phone(),
                                   user->nickname(), user->description(),
                                   user->avatar_id());
        if (ret == false) {
            LOG_ERROR("{} - 更新ES搜索引擎用户签名失败", request->request_id());
            return err_response(request->request_id(),
                                "更新ES搜索引擎用户签名失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }
    virtual void
    SetUserPhoneNumber(google::protobuf::RpcController *controller,
                       const ::im_server::SetUserPhoneNumberReq *request,
                       ::im_server::SetUserPhoneNumberRsp *response,
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
        std::string uid = request->user_id();
        std::string new_phone = request->phone_number();
        std::string code_id = request->phone_verify_code_id();
        std::string code = request->phone_verify_code();
        bool ret = phone_check(new_phone);
        if (ret == false) {
            LOG_ERROR("{} - 手机号码格式错误 - {}", request->request_id(),
                      new_phone);
            return err_response(request->request_id(), "用户名或密码错误");
        }
        auto vcode = _redis_code->code(code_id);
        if (vcode != code) {
            LOG_ERROR("{} - 手机验证码错误 - {} - {}", request->request_id(),
                      code_id, code);
            return err_response(request->request_id(), "手机验证码错误");
        }
        _redis_code->remove(code_id);
        auto user = _mysql_user->select_by_id(uid);
        if (!user) {
            LOG_ERROR("{} - 未找到用户信息 - {}", request->request_id(), uid);
            return err_response(request->request_id(), "未找到用户信息");
        }
        user->phone(new_phone);
        ret = _mysql_user->update(user);
        if (ret == false) {
            LOG_ERROR("{} - 更新Mysql数据库用户手机号失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "更新Mysql数据库用户手机号失败");
        }
        ret = _es_user->appendData(user->user_id(), user->phone(),
                                   user->nickname(), user->description(),
                                   user->avatar_id());
        if (ret == false) {
            LOG_ERROR("{} - 更新ES搜索引擎用户手机号失败",
                      request->request_id());
            return err_response(request->request_id(),
                                "更新ES搜索引擎用户手机号失败");
        }
        response->set_success(true);
        response->set_request_id(request->request_id());
    }

private:
    ESUser::ptr _es_user;
    UserTable::ptr _mysql_user;
    Session::ptr _redis_session;
    Status::ptr _redis_status;
    Code::ptr _redis_code;

    // rpc调用客户端
    std::string _file_service_name;
    ServiceManager::ptr _mm_channels;
    DMSClient::ptr _dms_client;
};

class UserServer {
public:
    using ptr = std::shared_ptr<UserServer>;
    UserServer(const std::shared_ptr<sw::redis::Redis> &redis_client,
               const std::shared_ptr<odb::core::database> &mysql_client,
               const std::shared_ptr<elasticlient::Client> &es_client,
               const std::shared_ptr<Discoverer> &service_discoverer,
               const std::shared_ptr<Registrar> &registry_client,
               const std::shared_ptr<brpc::Server> &rpc_server)
        : _redis_client(redis_client), _mysql_client(mysql_client),
          _es_client(es_client), _service_discoverer(service_discoverer),
          _registry_client(registry_client), _rpc_server(rpc_server) {}
    ~UserServer() {}

    // 启动RPC服务器
    void start() { _rpc_server->RunUntilAskedToQuit(); }

private:
    std::shared_ptr<sw::redis::Redis> _redis_client;
    std::shared_ptr<odb::core::database> _mysql_client;
    std::shared_ptr<elasticlient::Client> _es_client;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
};

class UserServerBuilder {
public:
    void make_redis_object(const std::string &host, int port, int db,
                           bool keep_alive) {
        _redis_client =
            im_server::RedisClientFactory::create(host, port, db, keep_alive);
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

    void make_dms_object(const std::string &access_key_id,
                         const std::string &access_key_secret) {
        _dms_client =
            std::make_shared<DMSClient>(access_key_id, access_key_secret);
    }

    void make_discovery_object(const std::string &reg_host,
                               const std::string &base_service_name,
                               const std::string &file_service_name) {
        // Discoverer(const std::string &host, const std::string &basedir, const
        // NotifyCallback &put_cb, const NotifyCallback &del_cb)
        _file_service_name = file_service_name;
        _mm_channels = std::make_shared<ServiceManager>();
        _mm_channels->declared(_file_service_name);
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
        if (!_dms_client) {
            LOG_ERROR("短信验证码平台模块未初始化");
            abort();
        }
        if (!_redis_client) {
            LOG_ERROR("Redis数据库模块未初始化");
            abort();
        }
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
        UserServiceImpl *user_service =
            new UserServiceImpl(_dms_client, _redis_client, _mysql_client,
                                _es_client, _mm_channels, _file_service_name);
        int ret = _rpc_server->AddService(
            user_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
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

    UserServer::ptr build() {
        if (!_dms_client) {
            LOG_ERROR("短信验证码平台模块未初始化");
            abort();
        }
        if (!_redis_client) {
            LOG_ERROR("Redis数据库模块未初始化");
            abort();
        }
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
        return std::make_shared<UserServer>(_redis_client, _mysql_client,
                                            _es_client, _service_discoverer,
                                            _registry_client, _rpc_server);
    }

private:
    std::shared_ptr<sw::redis::Redis> _redis_client;
    std::shared_ptr<odb::core::database> _mysql_client;
    std::shared_ptr<elasticlient::Client> _es_client;
    std::string _file_service_name;
    ServiceManager::ptr _mm_channels;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
    DMSClient::ptr _dms_client;
};
} // namespace im_server