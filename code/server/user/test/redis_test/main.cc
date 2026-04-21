#include <sw/redis++/redis.h>
#include <gflags/gflags.h>
#include <iostream>
#include <thread>
#include "../../../common/data_redis.hpp"

DEFINE_string(ip, "127.0.0.1", "设置Redis的IP地址,格式:127.0.0.1");
DEFINE_int32(port, 6379, "设置Redis的监听端口,格式:6379");
DEFINE_int32(db, 0, "设置Redis的库编号,默认0");
DEFINE_bool(keep_alive, true, "是否启用长连接保活");

void test_session(const std::shared_ptr<sw::redis::Redis> &client)
{
    auto session = im_server::Session(client);
    session.append("会话ID1", "用户ID1");
    session.append("会话ID2", "用户ID2");
    session.append("会话ID3", "用户ID3");
    session.append("会话ID4", "用户ID4");

    session.remove("会话ID2");
    session.remove("会话ID4");

    auto y1 = session.uid("会话ID1");
    if (y1)
        std::cout << *y1 << std::endl;
    auto y2 = session.uid("会话ID2");
    if (y2)
        std::cout << *y2 << std::endl;
    auto y3 = session.uid("会话ID3");
    if (y3)
        std::cout << *y3 << std::endl;
    auto y4 = session.uid("会话ID4");
    if (y4)
        std::cout << *y4 << std::endl;
}

void test_status(const std::shared_ptr<sw::redis::Redis> &client)
{
    auto status = im_server::Status(client);
    status.append("会话ID1");
    status.append("会话ID2");
    status.append("会话ID3");
    status.append("会话ID4");

    status.remove("会话ID2");
    status.remove("会话ID4");

    auto y1 = status.exists("会话ID1");
    if (y1)
        std::cout << "用户1在线" << std::endl;
    auto y2 = status.exists("会话ID2");
    if (y2)
        std::cout << "用户2在线" << std::endl;
    auto y3 = status.exists("会话ID3");
    if (y3)
        std::cout << "用户3在线" << std::endl;
    auto y4 = status.exists("会话ID4");
    if (y4)
        std::cout << "用户4在线" << std::endl;
}

void test_code(const std::shared_ptr<sw::redis::Redis> &client)
{
    auto code = im_server::Code(client);
    code.append("验证码ID1", "验证码1");
    code.append("验证码ID2", "验证码2");
    code.append("验证码ID3", "验证码3");
    code.append("验证码ID4", "验证码4");

    code.remove("验证码ID1");
    code.remove("验证码ID3");
    auto y1 = code.code("验证码ID1");
    if (y1)
        std::cout << *y1 << std::endl;
    auto y2 = code.code("验证码ID2");
    if (y2)
        std::cout << *y2 << std::endl;
    auto y3 = code.code("验证码ID3");
    if (y3)
        std::cout << *y3 << std::endl;
    auto y4 = code.code("验证码ID4");
    if (y4)
        std::cout << *y4 << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    auto y5 = code.code("验证码ID1");
    if (y5)
        std::cout << *y5 << std::endl;
    auto y6 = code.code("验证码ID2");
    if (y6)
        std::cout << *y6 << std::endl;
    auto y7 = code.code("验证码ID3");
    if (y7)
        std::cout << *y7 << std::endl;
    auto y8 = code.code("验证码ID4");
    if (y8)
        std::cout << *y8 << std::endl;
}
int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    auto client = im_server::RedisClientFactory::create(FLAGS_ip, FLAGS_port, FLAGS_db, FLAGS_keep_alive);
    // test_session(client);
    // test_status(client);
    test_code(client);
    return 0;
}