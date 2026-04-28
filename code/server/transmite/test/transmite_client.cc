#include "channel.hpp"
#include "etcd.hpp"
#include "transmite.pb.h"
#include "utils.hpp"
#include <gflags/gflags.h>
#include <gtest/gtest.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(transmite_name, "/service/transmite_service", "服务关心目录");

im_server::ServiceManager::ptr sm;

void string_message(const std::string &user_id, const std::string &sid,
                    const std::string &msg) {
    auto channel = sm->choose(FLAGS_transmite_name);
    if (!channel) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return;
    }

    im_server::MsgTransmitService_Stub stub(channel.get());
    im_server::NewMessageReq req;
    im_server::GetTransmitTargetRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(user_id);
    req.set_chat_session_id(sid);
    req.mutable_message()->set_message_type(im_server::MessageType::STRING);
    req.mutable_message()->mutable_string_message()->set_content(msg);
    stub.GetTransmitTarget(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
}

void image_message(const std::string &user_id, const std::string &sid,
                   const std::string &msg) {
    auto channel = sm->choose(FLAGS_transmite_name);
    if (!channel) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return;
    }

    im_server::MsgTransmitService_Stub stub(channel.get());
    im_server::NewMessageReq req;
    im_server::GetTransmitTargetRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(user_id);
    req.set_chat_session_id(sid);
    req.mutable_message()->set_message_type(im_server::MessageType::IMAGE);
    req.mutable_message()->mutable_image_message()->set_image_content(msg);
    LOG_DEBUG("图像消息1发送");
    stub.GetTransmitTarget(&cntl, &req, &resp, nullptr);
    LOG_DEBUG("图像消息1结束");
    ASSERT_FALSE(cntl.Failed());
    LOG_DEBUG("图像消息1正常");
    ASSERT_TRUE(resp.success());
}

void speech_message(const std::string &user_id, const std::string &sid,
                    const std::string &msg) {
    auto channel = sm->choose(FLAGS_transmite_name);
    if (!channel) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return;
    }

    im_server::MsgTransmitService_Stub stub(channel.get());
    im_server::NewMessageReq req;
    im_server::GetTransmitTargetRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(user_id);
    req.set_chat_session_id(sid);
    req.mutable_message()->set_message_type(im_server::MessageType::SPEECH);
    req.mutable_message()->mutable_speech_message()->set_file_contents(msg);
    stub.GetTransmitTarget(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
}

void file_message(const std::string &user_id, const std::string &sid,
                  const std::string &filename, const std::string &msg) {
    auto channel = sm->choose(FLAGS_transmite_name);
    if (!channel) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return;
    }

    im_server::MsgTransmitService_Stub stub(channel.get());
    im_server::NewMessageReq req;
    im_server::GetTransmitTargetRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(user_id);
    req.set_chat_session_id(sid);
    req.mutable_message()->set_message_type(im_server::MessageType::FILE);
    req.mutable_message()->mutable_file_message()->set_file_name(filename);
    req.mutable_message()->mutable_file_message()->set_file_size(msg.size());
    req.mutable_message()->mutable_file_message()->set_file_contents(msg);
    stub.GetTransmitTarget(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
}

int main(int argc, char *argv[]) {
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    sm = std::make_shared<im_server::ServiceManager>();
    auto put_cb =
        std::bind(&im_server::ServiceManager::onServiceOnline, sm.get(),
                  std::placeholders::_1, std::placeholders::_2);
    auto del_cb =
        std::bind(&im_server::ServiceManager::onServiceOffline, sm.get(),
                  std::placeholders::_1, std::placeholders::_2);
    sm->declared(FLAGS_transmite_name);

    im_server::Discoverer::ptr dclient =
        std::make_shared<im_server::Discoverer>(
            FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);

    // string_message("用户ID1", "会话ID1", "你吃饭了吗");
    // LOG_DEBUG("字符串消息1已发送");
    // string_message("用户ID2", "会话ID1", "吃了盖浇饭");
    // LOG_DEBUG("字符串消息2已发送");
    // image_message("用户ID2", "会话ID1", "一个可爱的表情包");
    // LOG_DEBUG("图片消息1已发送");
    // speech_message("用户ID1", "会话ID1", "一声可爱的猪叫");
    // LOG_DEBUG("语音消息1已发送");
    file_message("292b-27cfaa08-0000", "5f2e-d00db990-0001", "猪爸爸的文件名字",
                 "猪爸爸的文件数据");
    // LOG_DEBUG("文件消息1已发送");

    return 0;
}

// int main(int argc, char *argv[]) {
//     gflags::ParseCommandLineFlags(&argc, &argv, true);
//     im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
//     im_server::ServiceManager::ptr sm =
//         std::make_shared<im_server::ServiceManager>();
//     auto put_cb =
//         std::bind(&im_server::ServiceManager::onServiceOnline, sm.get(),
//                   std::placeholders::_1, std::placeholders::_2);
//     auto del_cb =
//         std::bind(&im_server::ServiceManager::onServiceOffline, sm.get(),
//                   std::placeholders::_1, std::placeholders::_2);
//     sm->declared(FLAGS_transmite_name);

//     im_server::Discoverer::ptr dclient =
//         std::make_shared<im_server::Discoverer>(
//             FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);

//     auto channel = sm->choose(FLAGS_transmite_name);
//     if (!channel) {
//         std::this_thread::sleep_for(std::chrono::seconds(1));
//         return -1;
//     }

//     im_server::MsgTransmitService_Stub stub(channel.get());
//     im_server::NewMessageReq req;
//     im_server::GetTransmitTargetRsp resp;
//     brpc::Controller cntl;
//     req.set_request_id("11111");
//     req.set_user_id("用户ID1");
//     req.set_session_id("22222");
//     req.set_chat_session_id("会话ID1");
//     req.mutable_message()->set_message_type(im_server::MessageType::STRING);
//     req.mutable_message()->mutable_string_message()->set_content(
//         "这是一条文字消息");
//     stub.GetTransmitTarget(&cntl, &req, &resp, nullptr);
//     if (cntl.Failed() == true) {
//         std::cout << "Rpc调用失败: " << cntl.ErrorText() << std::endl;
//         std::this_thread::sleep_for(std::chrono::seconds(1));
//         return -1;
//     }
//     if (resp.success() == false) {
//         std::cout << resp.errmsg() << std::endl;
//         return -1;
//     }
//     std::cout << "收到响应 request_id: " << resp.request_id() << std::endl;
//     std::cout << "收到响应 message_id: " << resp.message().message_id()
//               << std::endl;
//     std::cout << "收到响应 chat_session_id: "
//               << resp.message().chat_session_id() << std::endl;
//     std::cout << "收到响应 timestamp: " << resp.message().timestamp()
//               << std::endl;
//     std::cout << "收到响应 sender-user_id: "
//               << resp.message().sender().user_id() << std::endl;
//     std::cout << "收到响应 sender-nickname: "
//               << resp.message().sender().nickname() << std::endl;
//     std::cout << "收到响应 sender-description: "
//               << resp.message().sender().description() << std::endl;
//     std::cout << "收到响应 sender-phone: " << resp.message().sender().phone()
//               << std::endl;
//     std::cout << "收到响应 sender-avatar: " <<
//     resp.message().sender().avatar()
//               << std::endl;
//     for (int i = 0; i < resp.target_id_list_size(); i++) {
//         std::cout << "收到响应 target_id: " << resp.target_id_list(i)
//                   << std::endl;
//     }

//     return 0;
// }