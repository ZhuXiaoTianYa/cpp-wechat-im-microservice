#include "../../../common/data_es.hpp"
#include "../../../common/icsearch.hpp"
#include "../../../odb/message.hxx"
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <gflags/gflags.h>
#include <iostream>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(es_host, "http://127.0.0.1:9200/", "es服务器URL");

int main(int argc, char *argv[]) {
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    auto es_client = im_server::ESClientFactory::create({FLAGS_es_host});
    im_server::ESMessage es_msg(es_client);
    es_msg.createIndex();

    // bool appendData(const std::string &user_id, const std::string
    // &message_id,
    //                 const long &create_time, const std::string
    //                 &chat_session_id, const std::string &content) {

    // es_msg.appendData("用户ID1", "消息ID1", 1776911600, "会话ID1",
    //                   "你吃饭了吗");
    // es_msg.appendData("用户ID2", "消息ID2", 1776911600 - 1000, "会话ID1",
    //                   "吃了盖浇饭");

    auto res = es_msg.search("盖浇", "会话ID1");
    for (auto &u : res) {
        std::cout << u.user_id() << std::endl;
        std::cout << u.message_id() << std::endl;
        std::cout << u.session_id() << std::endl;
        std::cout << u.content() << std::endl;
        std::cout << boost::posix_time::to_simple_string(u.create_time())
                  << std::endl;
    }
    return 0;
}