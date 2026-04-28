#include "../../../common/data_es.hpp"
#include "../../../common/icsearch.hpp"
#include "../../../odb/user.hxx"
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
    im_server::ESUser es_user(es_client);
    es_user.createIndex();
    // es_user.appendData("用户ID1", "手机号1", "小猪佩奇", "用户描述1",
    // "用户头像1"); es_user.appendData("用户ID2", "手机号2", "小猪乔治",
    // "用户描述2", "用户头像2");

    // auto res = es_user.search("小猪", {"用户ID1"});
    auto res = es_user.search(
        "猪", {"用户ID2", "292b-27cfaa08-0000", "d96a-620dc7e7-0000"});
    for (auto &u : res) {
        std::cout << u.user_id() << std::endl;
        std::cout << u.phone() << std::endl;
        std::cout << u.nickname() << std::endl;
        std::cout << u.description() << std::endl;
        std::cout << u.avatar_id() << std::endl;
    }
    return 0;
}