#include "channel.hpp"
#include "etcd.hpp"
#include "message.pb.h"
#include "utils.hpp"
#include <boost/date_time/posix_time/conversion.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/date_time/posix_time/ptime.hpp>
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <boost/date_time/posix_time/time_parsers.hpp>
#include <gflags/gflags.h>
#include <gtest/gtest.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(message_name, "/service/message_service", "服务关心目录");

im_server::ServiceManager::ptr sm;

void range(std::string ssid, const boost::posix_time::ptime &stime,
           const boost::posix_time::ptime &etime) {
    std::cout
        << "-------------------------range--------------------------------"
        << std::endl;
    auto channel = sm->choose(FLAGS_message_name);
    ASSERT_TRUE(channel);

    im_server::MsgStorageService_Stub stub(channel.get());
    im_server::GetHistoryMsgReq req;
    im_server::GetHistoryMsgRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_chat_session_id(ssid);
    req.set_start_time(boost::posix_time::to_time_t(stime));
    req.set_over_time(boost::posix_time::to_time_t(etime));
    stub.GetHistoryMsg(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    LOG_DEBUG("结果数量 {}", resp.msg_list_size());
    for (int i = 0; i < resp.msg_list_size(); i++) {
        std::cout
            << "--------------------------------------------------------------"
            << std::endl;
        std::cout << resp.msg_list(i).message_id() << std::endl;
        std::cout << resp.msg_list(i).chat_session_id() << std::endl;
        std::cout << boost::posix_time::to_simple_string(
                         boost::posix_time::from_time_t(
                             resp.msg_list(i).timestamp()))
                  << std::endl;
        std::cout << resp.msg_list(i).sender().user_id() << std::endl;
        std::cout << resp.msg_list(i).sender().nickname() << std::endl;
        std::cout << resp.msg_list(i).sender().avatar() << std::endl;
        const auto &msg = resp.msg_list(i).message();
        if (msg.message_type() == im_server::MessageType::STRING) {
            std::cout << "字符串消息" << std::endl;
            std::cout << msg.string_message().content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::IMAGE) {
            std::cout << "图像消息" << std::endl;
            std::cout << msg.image_message().image_content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::FILE) {
            std::cout << "文件消息" << std::endl;
            std::cout << msg.file_message().file_name() << std::endl;
            std::cout << msg.file_message().file_contents() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::SPEECH) {
            std::cout << "语音消息" << std::endl;
            std::cout << msg.speech_message().file_contents() << std::endl;
        } else {
            std::cout << "消息类型错误" << std::endl;
        }
    }
}

void recent(std::string ssid, int count) {
    auto channel = sm->choose(FLAGS_message_name);
    ASSERT_TRUE(channel);
    std::cout
        << "-------------------------recent--------------------------------"
        << std::endl;
    im_server::MsgStorageService_Stub stub(channel.get());
    im_server::GetRecentMsgReq req;
    im_server::GetRecentMsgRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_chat_session_id(ssid);
    req.set_msg_count(count);
    stub.GetRecentMsg(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.msg_list_size(); i++) {
        std::cout
            << "--------------------------------------------------------------"
            << std::endl;
        std::cout << resp.msg_list(i).message_id() << std::endl;
        std::cout << resp.msg_list(i).chat_session_id() << std::endl;
        std::cout << boost::posix_time::to_simple_string(
                         boost::posix_time::from_time_t(
                             resp.msg_list(i).timestamp()))
                  << std::endl;
        std::cout << resp.msg_list(i).sender().user_id() << std::endl;
        std::cout << resp.msg_list(i).sender().nickname() << std::endl;
        std::cout << resp.msg_list(i).sender().avatar() << std::endl;
        const auto &msg = resp.msg_list(i).message();
        if (msg.message_type() == im_server::MessageType::STRING) {
            std::cout << "字符串消息" << std::endl;
            std::cout << msg.string_message().content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::IMAGE) {
            std::cout << "图像消息" << std::endl;
            std::cout << msg.image_message().image_content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::FILE) {
            std::cout << "文件消息" << std::endl;
            std::cout << msg.file_message().file_name() << std::endl;
            std::cout << msg.file_message().file_contents() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::SPEECH) {
            std::cout << "语音消息" << std::endl;
            std::cout << msg.speech_message().file_contents() << std::endl;
        } else {
            std::cout << "消息类型错误" << std::endl;
        }
    }
}

void search(std::string ssid, std::string key) {
    auto channel = sm->choose(FLAGS_message_name);
    ASSERT_TRUE(channel);
    std::cout
        << "-------------------------search--------------------------------"
        << std::endl;
    im_server::MsgStorageService_Stub stub(channel.get());
    im_server::MsgSearchReq req;
    im_server::MsgSearchRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_chat_session_id(ssid);
    req.set_search_key(key);
    stub.MsgSearch(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.msg_list_size(); i++) {
        std::cout
            << "--------------------------------------------------------------"
            << std::endl;
        std::cout << resp.msg_list(i).message_id() << std::endl;
        std::cout << resp.msg_list(i).chat_session_id() << std::endl;
        std::cout << boost::posix_time::to_simple_string(
                         boost::posix_time::from_time_t(
                             resp.msg_list(i).timestamp()))
                  << std::endl;
        std::cout << resp.msg_list(i).sender().user_id() << std::endl;
        std::cout << resp.msg_list(i).sender().nickname() << std::endl;
        std::cout << resp.msg_list(i).sender().avatar() << std::endl;
        const auto &msg = resp.msg_list(i).message();
        if (msg.message_type() == im_server::MessageType::STRING) {
            std::cout << "字符串消息" << std::endl;
            std::cout << msg.string_message().content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::IMAGE) {
            std::cout << "图像消息" << std::endl;
            std::cout << msg.image_message().image_content() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::FILE) {
            std::cout << "文件消息" << std::endl;
            std::cout << msg.file_message().file_name() << std::endl;
            std::cout << msg.file_message().file_contents() << std::endl;
        } else if (msg.message_type() == im_server::MessageType::SPEECH) {
            std::cout << "语音消息" << std::endl;
            std::cout << msg.speech_message().file_contents() << std::endl;
        } else {
            std::cout << "消息类型错误" << std::endl;
        }
    }
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
    sm->declared(FLAGS_message_name);

    im_server::Discoverer::ptr dclient =
        std::make_shared<im_server::Discoverer>(
            FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);
    boost::posix_time::ptime stime(
        boost::posix_time::time_from_string("2026-04-25 06:56:08"));
    boost::posix_time::ptime etime(
        boost::posix_time::time_from_string("2026-04-28 06:56:08"));
    range("会话ID1", stime, etime);
    recent("会话ID1", 2);
    search("会话ID1", "盖浇");
    return 0;
}