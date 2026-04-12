#include "../common/icsearch.hpp"
#include <gflags/gflags.h>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    std::shared_ptr<elasticlient::Client> client(new elasticlient::Client({"http://127.0.0.1:9200/"}));
    EsIndex index(client, "test_user", "_doc");
    bool ret = index.append("nickname").append("phone", "keyword", "standard", true).create();
    if (ret == true)
        LOG_INFO("索引创建成功");

    ret = EsInsert(client, "test_user").append("nickname", "zhutian").append("phone", "15616151561").insert("00001");
    if (ret == false)
    {
        LOG_INFO("插入数据失败");
        return -1;
    }
    else
    {
        LOG_INFO("插入数据成功");
    }

    ret = EsInsert(client, "test_user").append("nickname", "zhutian").append("phone", "3131151561").insert("00001");
    if (ret == false)
    {
        LOG_INFO("更新数据失败");
        return -1;
    }
    else
    {
        LOG_INFO("更新数据成功");
    }

    Json::Value user;
    user = EsSearch(client, "test_user").append_should_match("nickname.keyword", "zhutian").append_must_not_term("phone.keyword", {"3131151561"}).search();
    if (user.empty() || user.isArray() == false)
    {
        LOG_INFO("查询结果为空或不是数组类型");
        return -1;
    }
    else
    {
        LOG_INFO("查询数据成功");
    }
    int sz = user.size();
    for (int i = 0; i < sz; i++)
    {
        LOG_INFO("nickname: {}  phone: {}", user[i]["_source"]["nickname"].asString(), user[i]["_source"]["phone"].asString());
    }

    // ret = EsRemove(client, "test_user").remove("00001");
    // if (ret == false)
    // {
    //     LOG_INFO("删除数据失败");
    //     return -1;
    // }
    // else
    // {
    //     LOG_INFO("删除数据成功");
    // }

    return 0;
}