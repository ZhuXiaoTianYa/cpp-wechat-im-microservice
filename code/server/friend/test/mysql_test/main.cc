#include "../../../common/mysql_chat_session.hpp"
#include "../../../common/mysql_friend_apply.hpp"
#include "../../../common/mysql_relation.hpp"
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <boost/date_time/posix_time/time_parsers.hpp>
#include <gflags/gflags.h>
#include <memory>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

void r_insert_test(std::shared_ptr<im_server::RelationTable> db) {
    db->insert("用户ID1", "用户ID2");
    db->insert("用户ID1", "用户ID3");
    db->insert("用户ID2", "用户ID3");
}

void r_exists_test(std::shared_ptr<im_server::RelationTable> db) {
    std::cout << db->exists("用户ID1", "用户ID2") << std::endl;
    std::cout << db->exists("用户ID2", "用户ID4") << std::endl;
}

void r_frients_test(std::shared_ptr<im_server::RelationTable> db) {
    auto res = db->friends("用户ID1");
    for (auto &uid : res) {
        std::cout << uid << std::endl;
    }
}
void r_remove_test(std::shared_ptr<im_server::RelationTable> db) {
    db->remove("用户ID2", "用户ID3");
}

void f_insert_test(std::shared_ptr<im_server::FriendApplyTable> db) {
    // im_server::FriendApply f1("uuid1", "用户ID1", "用户ID2");
    // db->insert(f1);
    // im_server::FriendApply f2("uuid2", "用户ID1", "用户ID3");
    // db->insert(f2);
    // im_server::FriendApply f3("uuid3", "用户ID2", "用户ID3");
    // db->insert(f3);
    im_server::FriendApply f1("uuid4", "用户ID2", "用户ID1");
    db->insert(f1);
    im_server::FriendApply f2("uuid5", "用户ID3", "用户ID1");
    db->insert(f2);
}

void f_Users_test(std::shared_ptr<im_server::FriendApplyTable> db) {
    auto res = db->applyUsers("用户ID1");
    for (auto &uid : res) {
        std::cout << uid << std::endl;
    }
}
void f_exists_test(std::shared_ptr<im_server::FriendApplyTable> db) {
    std::cout << db->exists("用户ID1", "用户ID2") << std::endl;
    std::cout << db->exists("用户ID1", "用户ID3") << std::endl;
    std::cout << db->exists("用户ID2", "用户ID1") << std::endl;
    std::cout << db->exists("用户ID1", "用户ID5") << std::endl;
}
void f_remove_test(std::shared_ptr<im_server::FriendApplyTable> db) {
    db->remove("用户ID2", "用户ID3");
}

void c_insert_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    im_server::ChatSession c1("会话ID1", "会话1",
                              im_server::ChatSessionType::SINGLE);
    db->insert(c1);
    im_server::ChatSession c2("会话ID2", "会话2",
                              im_server::ChatSessionType::SINGLE);
    db->insert(c2);
    im_server::ChatSession c3("会话ID3", "群聊3",
                              im_server::ChatSessionType::GROUP);
    db->insert(c3);
    im_server::ChatSession c4("会话ID4", "群聊4",
                              im_server::ChatSessionType::GROUP);
    db->insert(c4);
    im_server::ChatSession c5("会话ID5", "群聊5",
                              im_server::ChatSessionType::GROUP);
    db->insert(c5);
}

void c_select_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto cs = db->select("会话ID1");
    std::cout << cs->chat_session_id() << std::endl;
    std::cout << cs->chat_session_name() << std::endl;
    std::cout << (int)cs->chat_session_type() << std::endl;
    auto cs2 = db->select("会话ID4");
    std::cout << cs2->chat_session_id() << std::endl;
    std::cout << cs2->chat_session_name() << std::endl;
    std::cout << (int)cs2->chat_session_type() << std::endl;
}

void c_single_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto res = db->singleChatSession("U1002");
    for (auto &single : res) {
        std::cout << single.chat_session_id << std::endl;
        std::cout << single.friend_id << std::endl;
    }
}

void c_group_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto res = db->groupChatSession("U1001");
    for (auto &group : res) {
        std::cout << group.chat_session_id << std::endl;
        std::cout << group.chat_session_name << std::endl;
    }
}
void c_remove_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto res = db->remove("U1002", "U1003");
}
void c_single_remove_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto res = db->remove("SS1001");
}

void c_group_remove_test(std::shared_ptr<im_server::ChatSessionTable> db) {
    auto res = db->remove("SG2001");
}

int main(int argc, char *argv[]) {
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

    auto db = im_server::ODBFactory::create("root", "zhutian2004", "127.0.0.1",
                                            "zhutian_im", "utf8", 0, 1);
    auto rtb = std::make_shared<im_server::RelationTable>(db);
    auto cstb = std::make_shared<im_server::ChatSessionTable>(db);
    auto ftb = std::make_shared<im_server::FriendApplyTable>(db);
    // r_insert_test(rtb);
    // r_exists_test(rtb);
    // r_frients_test(rtb);
    // r_remove_test(rtb);
    // f_insert_test(ftb);
    // f_Users_test(ftb);
    // f_exists_test(ftb);
    // f_remove_test(ftb);
    // c_insert_test(cstb);
    // c_select_test(cstb);
    // c_single_test(cstb);
    // c_group_test(cstb);
    // c_single_remove_test(cstb);
    // c_group_remove_test(cstb);
    c_remove_test(cstb);
    return 0;
}

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../odb=/relation.hxx ../../../odb/friend_apply.hxx
// ../../../odb/chat_session.hxx