#include "base.pb.h"
#include "channel.hpp"
#include "etcd.hpp"
#include "user.pb.h"
#include "utils.hpp"
#include <gflags/gflags.h>
#include <gtest/gtest.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(user_service, "/service/user_service", "服务关心目录");

im_server::ServiceManager::ptr user_channels;
im_server::UserInfo user_info;

std::string session_id;
std::string new_nickname = "亲爱的猪妈妈";
std::string user_id = "d96a-620dc7e7-0000";

std::string code_id;

// TEST(用户子服务测试, 用户注册测试)
// {
//     auto channel = user_channels->choose(FLAGS_user_service);
//     ASSERT_TRUE(channel);
//     im_server::UserService_Stub stub(channel.get());
//     im_server::UserRegisterReq req;
//     im_server::UserRegisterRsp resp;
//     brpc::Controller cntl;
//     req.set_request_id(im_server::uuid());
//     req.set_nickname("猪妈妈");
//     req.set_password("123456");
//     user_info.set_nickname("猪妈妈");
//     stub.UserRegister(&cntl, &req, &resp, nullptr);
//     ASSERT_FALSE(cntl.Failed());
//     ASSERT_TRUE(resp.success());
// }

// TEST(用户子服务测试, 用户登录测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::UserLoginReq req;
//   im_server::UserLoginRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_nickname(new_nickname);
//   req.set_password("123456");
//   stub.UserLogin(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
//   session_id = resp.login_session_id();
// }

// TEST(用户子服务测试, 用户头像设置测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::SetUserAvatarReq req;
//   im_server::SetUserAvatarRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_user_id(user_id);
//   req.set_session_id(session_id);
//   req.set_avatar(user_info.avatar());
//   stub.SetUserAvatar(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
// }

// TEST(用户子服务测试, 用户签名设置测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::SetUserDescriptionReq req;
//   im_server::SetUserDescriptionRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_user_id(user_id);
//   req.set_session_id(session_id);
//   req.set_description(user_info.description());
//   stub.SetUserDescription(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
// }

// TEST(用户子服务测试, 用户信息获取测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::GetUserInfoReq req;
//   im_server::GetUserInfoRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_user_id(user_id);
//   req.set_session_id(session_id);
//   stub.GetUserInfo(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
//   ASSERT_EQ(resp.user_info().user_id(), user_id);
//   ASSERT_EQ(resp.user_info().nickname(), new_nickname);
//   ASSERT_EQ(resp.user_info().description(), user_info.description());
//   ASSERT_EQ(resp.user_info().phone(), "");
//   ASSERT_EQ(resp.user_info().avatar(), user_info.avatar());
// }

// TEST(用户子服务测试, 用户昵称设置测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::SetUserNicknameReq req;
//   im_server::SetUserNicknameRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_user_id(user_id);
//   req.set_session_id(session_id);
//   req.set_nickname(new_nickname);
//   stub.SetUserNickname(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
// }

// void set_user_avatar(std::string uid, std::string avatar) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::SetUserAvatarReq req;
//   im_server::SetUserAvatarRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.set_user_id(uid);
//   req.set_session_id(session_id);
//   req.set_avatar(avatar);
//   stub.SetUserAvatar(&cntl, &req, &resp, nullptr);
// }

// TEST(用户子服务测试, 批量用户信息获取测试) {
//   set_user_avatar("用户ID1", "小猪佩奇的头像数据");
//   set_user_avatar("用户ID2", "小猪乔治的头像数据");
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::GetMultiUserInfoReq req;
//   im_server::GetMultiUserInfoRsp resp;
//   brpc::Controller cntl;
//   req.set_request_id(im_server::uuid());
//   req.add_users_id("用户ID1");
//   req.add_users_id("用户ID2");
//   req.add_users_id("d96a-620dc7e7-0000");
//   stub.GetMultiUserInfo(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
//   auto user_map = resp.mutable_users_info();
//   im_server::UserInfo puser = (*user_map)["用户ID1"];
//   ASSERT_EQ(puser.user_id(), "用户ID1");
//   ASSERT_EQ(puser.nickname(), "小猪佩奇");
//   ASSERT_EQ(puser.description(), "用户描述1");
//   ASSERT_EQ(puser.phone(), "手机号1");
//   ASSERT_EQ(puser.avatar(), "小猪佩奇的头像数据");
//   im_server::UserInfo quser = (*user_map)["用户ID2"];
//   ASSERT_EQ(quser.user_id(), "用户ID2");
//   ASSERT_EQ(quser.nickname(), "小猪乔治");
//   ASSERT_EQ(quser.description(), "用户描述2");
//   ASSERT_EQ(quser.phone(), "手机号2");
//   ASSERT_EQ(quser.avatar(), "小猪乔治的头像数据");
//   im_server::UserInfo muser = (*user_map)["d96a-620dc7e7-0000"];
//   ASSERT_EQ(muser.user_id(), "d96a-620dc7e7-0000");
//   ASSERT_EQ(muser.nickname(), "亲爱的猪妈妈");
//   ASSERT_EQ(muser.description(), "这是一个美丽的妈妈");
//   ASSERT_EQ(muser.phone(), "");
//   ASSERT_EQ(muser.avatar(), "猪妈妈的头像数据");
// }

void get_code(std::string phone) {
  auto channel = user_channels->choose(FLAGS_user_service);
  ASSERT_TRUE(channel);
  im_server::UserService_Stub stub(channel.get());
  im_server::PhoneVerifyCodeReq req;
  im_server::PhoneVerifyCodeRsp resp;
  brpc::Controller cntl;
  req.set_request_id(im_server::uuid());
  req.set_phone_number(phone);
  stub.GetPhoneVerifyCode(&cntl, &req, &resp, nullptr);
  code_id = resp.verify_code_id();
  ASSERT_FALSE(cntl.Failed());
  ASSERT_TRUE(resp.success());
}

// TEST(用户子服务测试, 手机号注册测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::PhoneRegisterReq req;
//   im_server::PhoneRegisterRsp resp;
//   brpc::Controller cntl;
//   std::cout << "请输入手机号: ";
//   std::string phone;
//   std::cin >> phone;
//   std::string code;
//   get_code(phone);
//   std::cout << "请输入手机验证码: ";
//   std::cin >> code;
//   req.set_request_id(im_server::uuid());
//   req.set_phone_number(phone);
//   req.set_verify_code_id(code_id);
//   req.set_verify_code(code);
//   stub.PhoneRegister(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
// }

// TEST(用户子服务测试, 手机号登录测试) {
//   auto channel = user_channels->choose(FLAGS_user_service);
//   ASSERT_TRUE(channel);
//   im_server::UserService_Stub stub(channel.get());
//   im_server::PhoneLoginReq req;
//   im_server::PhoneLoginRsp resp;
//   brpc::Controller cntl;
//   std::string phone;
//   std::cout << "请输入手机号: ";
//   std::cin >> phone;
//   std::string code;
//   get_code(phone);
//   std::cout << "请输入手机验证码: ";
//   std::cin >> code;
//   req.set_request_id(im_server::uuid());
//   req.set_phone_number(phone);
//   req.set_verify_code_id(code_id);
//   req.set_verify_code(code);
//   stub.PhoneLogin(&cntl, &req, &resp, nullptr);
//   ASSERT_FALSE(cntl.Failed());
//   ASSERT_TRUE(resp.success());
//   std::cout << "登录会话ID：" << resp.login_session_id() << std::endl;
// }

TEST(用户子服务测试, 手机号修改测试) {
  auto channel = user_channels->choose(FLAGS_user_service);
  ASSERT_TRUE(channel);
  im_server::UserService_Stub stub(channel.get());
  im_server::SetUserPhoneNumberReq req;
  im_server::SetUserPhoneNumberRsp resp;
  brpc::Controller cntl;
  std::string phone;
  std::string user_id;
  std::cout << "请输入uid: ";
  std::cin >> user_id;
  std::cout << "请输入手机号: ";
  std::cin >> phone;
  std::string code;
  get_code(phone);
  std::cout << "请输入手机验证码: ";
  std::cin >> code;
  req.set_request_id(im_server::uuid());
  req.set_user_id(user_id);
  req.set_phone_number("18888888888");
  req.set_phone_verify_code_id(code_id);
  req.set_phone_verify_code(code);
  stub.SetUserPhoneNumber(&cntl, &req, &resp, nullptr);
  ASSERT_FALSE(cntl.Failed());
  ASSERT_TRUE(resp.success());
}

int main(int argc, char *argv[]) {
  testing::InitGoogleTest(&argc, argv);
  gflags::ParseCommandLineFlags(&argc, &argv, true);
  im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

  user_channels = std::make_shared<im_server::ServiceManager>();
  auto put_cb = std::bind(&im_server::ServiceManager::onServiceOnline,
                          user_channels.get(), std::placeholders::_1,
                          std::placeholders::_2);
  auto del_cb = std::bind(&im_server::ServiceManager::onServiceOffline,
                          user_channels.get(), std::placeholders::_1,
                          std::placeholders::_2);
  user_channels->declared(FLAGS_user_service);
  im_server::Discoverer::ptr dclient = std::make_shared<im_server::Discoverer>(
      FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);
  user_info.set_nickname("猪妈妈");
  user_info.set_user_id(user_id);
  user_info.set_avatar("猪妈妈的头像数据");
  user_info.set_description("这是一个美丽的妈妈");
  return RUN_ALL_TESTS();
}