#include "../common/logger.hpp"
#include "../common/rabbitmq.hpp"
#include <gflags/gflags.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(host, "127.0.0.1:5672", "rabbitmq服务器地址信息:host:port");
DEFINE_string(user, "root", "rabbitmq访问用户名");
DEFINE_string(passwd, "zhutian2004", "rabbitmq访问密码");

void OnMessage(const char *msg, size_t sz)
{
    std::string str;
    str.assign(msg, sz);
    std::cout << str << std::endl;
}

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    MQClient client(FLAGS_user, FLAGS_passwd, FLAGS_host);
    client.declareComponents("test-exchange", "test-queue");
    client.consume("test-queue", OnMessage);
    std::this_thread::sleep_for(std::chrono::seconds(60));
    return 0;
}