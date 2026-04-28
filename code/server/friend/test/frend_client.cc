#include "channel.hpp"
#include "etcd.hpp"
#include "friend.pb.h"
#include "utils.hpp"
#include <boost/date_time/posix_time/conversion.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/date_time/posix_time/ptime.hpp>
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <boost/date_time/posix_time/time_parsers.hpp>
#include <gflags/gflags.h>
#include <gtest/gtest.h>
#include <thread>
#include <vector>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(friend_name, "/service/friend_service", "服务关心目录");

im_server::ServiceManager::ptr sm;

void test_apply(std::string uid, std::string pid) {
    // std::cout << "---------------------------------------------------------"
    //   << std::endl;
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::FriendAddReq req;
    im_server::FriendAddRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_respondent_id(pid);
    stub.FriendAdd(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
}

void test_apply_list(std::string uid) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::GetPendingFriendEventListReq req;
    im_server::GetPendingFriendEventListRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    stub.GetPendingFriendEventList(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.event_size(); i++) {
        std::cout << "---------------------------------------------------------"
                  << std::endl;
        std::cout << resp.event(i).sender().user_id() << std::endl;
        std::cout << resp.event(i).sender().nickname() << std::endl;
        std::cout << resp.event(i).sender().avatar() << std::endl;
    }
}

void process_apply_test(std::string uid, bool agree, std::string pid) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::FriendAddProcessReq req;
    im_server::FriendAddProcessRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_agree(agree);
    req.set_apply_user_id(pid);
    stub.FriendAddProcess(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    std::cout << resp.new_session_id() << std::endl;
}

void search_test(std::string uid, std::string key) {
    std::cout << "+++++++++++++++" << std::endl;
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::FriendSearchReq req;
    im_server::FriendSearchRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_search_key(key);
    stub.FriendSearch(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.user_info_size(); i++) {
        std::cout << "-------------------" << std::endl;
        std::cout << resp.user_info(i).user_id() << std::endl;
        std::cout << resp.user_info(i).nickname() << std::endl;
        std::cout << resp.user_info(i).avatar() << std::endl;
    }
}

void friend_list_test(std::string uid) {
    std::cout << "+++++++++++++++" << std::endl;
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::GetFriendListReq req;
    im_server::GetFriendListRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    stub.GetFriendList(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.friend_list_size(); i++) {
        std::cout << "-------------------" << std::endl;
        std::cout << resp.friend_list(i).user_id() << std::endl;
        std::cout << resp.friend_list(i).nickname() << std::endl;
        std::cout << resp.friend_list(i).avatar() << std::endl;
    }
}

void friend_remove_test(std::string uid, std::string pid) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::FriendRemoveReq req;
    im_server::FriendRemoveRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_peer_id(pid);
    stub.FriendRemove(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
}

void create_css_test(std::string uid, std::string name,
                     const std::vector<std::string> &uid_list) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::ChatSessionCreateReq req;
    im_server::ChatSessionCreateRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_chat_session_name(name);
    for (auto &user : uid_list) {
        req.add_member_id_list(user);
    }
    stub.ChatSessionCreate(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    std::cout << resp.chat_session_info().chat_session_id() << std::endl;
    std::cout << resp.chat_session_info().chat_session_name() << std::endl;
}

void cssmember_test(std::string uid, std::string ssid) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::GetChatSessionMemberReq req;
    im_server::GetChatSessionMemberRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    req.set_chat_session_id(ssid);
    stub.GetChatSessionMember(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.member_info_list_size(); i++) {
        std::cout << "-------------------" << std::endl;
        std::cout << resp.member_info_list(i).user_id() << std::endl;
        std::cout << resp.member_info_list(i).nickname() << std::endl;
        std::cout << resp.member_info_list(i).avatar() << std::endl;
    }
}

void csslist_test(std::string uid) {
    auto channel = sm->choose(FLAGS_friend_name);
    ASSERT_TRUE(channel);

    im_server::FriendService_Stub stub(channel.get());
    im_server::GetChatSessionListReq req;
    im_server::GetChatSessionListRsp resp;
    brpc::Controller cntl;
    req.set_request_id(im_server::uuid());
    req.set_user_id(uid);
    stub.GetChatSessionList(&cntl, &req, &resp, nullptr);
    ASSERT_FALSE(cntl.Failed());
    ASSERT_TRUE(resp.success());
    for (int i = 0; i < resp.chat_session_info_list_size(); i++) {
        std::cout << "-------------------" << std::endl;
        std::cout << resp.chat_session_info_list(i).single_chat_friend_id()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i).chat_session_id()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i).chat_session_name()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i).avatar() << std::endl;
        std::cout << resp.chat_session_info_list(i).prev_message().message_id()
                  << std::endl;
        std::cout
            << resp.chat_session_info_list(i).prev_message().chat_session_id()
            << std::endl;
        std::cout << resp.chat_session_info_list(i).prev_message().timestamp()
                  << std::endl;
        std::cout
            << resp.chat_session_info_list(i).prev_message().sender().user_id()
            << std::endl;
        std::cout
            << resp.chat_session_info_list(i).prev_message().sender().nickname()
            << std::endl;
        std::cout
            << resp.chat_session_info_list(i).prev_message().sender().avatar()
            << std::endl;
        std::cout << "-----------文件----------\n";
        std::cout << resp.chat_session_info_list(i)
                         .prev_message()
                         .message()
                         .message_type()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i)
                         .prev_message()
                         .message()
                         .file_message()
                         .file_id()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i)
                         .prev_message()
                         .message()
                         .file_message()
                         .file_name()
                  << std::endl;
        std::cout << resp.chat_session_info_list(i)
                         .prev_message()
                         .message()
                         .file_message()
                         .file_contents()
                  << std::endl;
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
    sm->declared(FLAGS_friend_name);

    im_server::Discoverer::ptr dclient =
        std::make_shared<im_server::Discoverer>(
            FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);
    // test_apply("用户ID1", "d96a-620dc7e7-0000");
    // test_apply("用户ID2", "d96a-620dc7e7-0000");
    // test_apply("292b-27cfaa08-0000", "d96a-620dc7e7-0000");
    // test_apply_list("d96a-620dc7e7-0000");
    // process_apply_test("d96a-620dc7e7-0000", false, "用户ID1");
    // process_apply_test("d96a-620dc7e7-0000", true, "用户ID2");
    // process_apply_test("d96a-620dc7e7-0000", true, "292b-27cfaa08-0000");
    // search_test("d96a-620dc7e7-0000", "小猪");
    // search_test("292b-27cfaa08-0000", "小猪");
    // search_test("用户ID1", "猪");
    // friend_list_test("d96a-620dc7e7-0000");
    // friend_list_test("292b-27cfaa08-0000");
    // friend_list_test("用户ID1");
    // friend_remove_test("d96a-620dc7e7-0000", "用户ID2");
    // std::vector<std::string> uid_list = {"d96a-620dc7e7-0000", "用户ID2",
    //                                      "292b-27cfaa08-0000", "用户ID1"};
    // create_css_test("d96a-620dc7e7-0000", "相亲相爱一家人", uid_list);
    // cssmember_test("d96a-620dc7e7-0000", "2be9-647124b0-0000");
    csslist_test("d96a-620dc7e7-0000");
    return 0;
}