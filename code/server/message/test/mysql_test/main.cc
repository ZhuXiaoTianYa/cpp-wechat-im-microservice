#include "../../../common/mysql_message.hpp"
#include "../../../odb/message.hxx"
#include "message-odb.hxx"
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <boost/date_time/posix_time/time_parsers.hpp>
#include <gflags/gflags.h>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

void insert(std::shared_ptr<im_server::MessageTable> msg_tb) {
    im_server::Message m1(
        "消息ID1", "会话ID1", "用户ID1", 0,
        boost::posix_time::time_from_string("2002-01-20 23:59:59.000"));
    msg_tb->insert(m1);
    im_server::Message m2(
        "消息ID2", "会话ID1", "用户ID2", 0,
        boost::posix_time::time_from_string("2002-01-21 23:59:59.000"));
    msg_tb->insert(m2);
    im_server::Message m3(
        "消息ID3", "会话ID1", "用户ID3", 0,
        boost::posix_time::time_from_string("2002-01-22 23:59:59.000"));
    msg_tb->insert(m3);
    im_server::Message m4(
        "消息ID4", "会话ID2", "用户ID4", 0,
        boost::posix_time::time_from_string("2002-01-21 23:59:59.000"));
    msg_tb->insert(m4);
    im_server::Message m5(
        "消息ID5", "会话ID2", "用户ID5", 0,
        boost::posix_time::time_from_string("2002-01-22 23:59:59.000"));
    msg_tb->insert(m5);
}

void remove(std::shared_ptr<im_server::MessageTable> msg_tb) {
    msg_tb->remove("会话ID2");
}

void recent(std::shared_ptr<im_server::MessageTable> msg_tb) {
    auto list = msg_tb->recent("会话ID1", 2);
    for (int i = 0; i < list.size(); i++) {
        std::cout << list[i].message_id() << std::endl;
        std::cout << list[i].session_id() << std::endl;
        std::cout << list[i].user_id() << std::endl;
        std::cout << list[i].message_type() << std::endl;
        std::cout << boost::posix_time::to_simple_string(list[i].create_time())
                  << std::endl;
    }
}

void range(std::shared_ptr<im_server::MessageTable> msg_tb) {
    auto list = msg_tb->range(
        "会话ID1",
        boost::posix_time::time_from_string("2002-01-20 23:59:59.000"),
        boost::posix_time::time_from_string("2002-01-21 23:59:59.000"));
    for (int i = 0; i < list.size(); i++) {
        std::cout << list[i].message_id() << std::endl;
        std::cout << list[i].session_id() << std::endl;
        std::cout << list[i].user_id() << std::endl;
        std::cout << list[i].message_type() << std::endl;
        std::cout << boost::posix_time::to_simple_string(list[i].create_time())
                  << std::endl;
    }
}

int main(int argc, char *argv[]) {
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

    auto db = im_server::ODBFactory::create("root", "zhutian2004", "127.0.0.1",
                                            "zhutian_im", "utf8", 0, 1);
    auto msg_tb = std::make_shared<im_server::MessageTable>(db);
    // insert(msg_tb);
    // remove(msg_tb);
    // recent(msg_tb);
    range(msg_tb);
    return 0;
}

// odb -d mysql  --generate-query --generate-schema  ../../../odb/user.hxx