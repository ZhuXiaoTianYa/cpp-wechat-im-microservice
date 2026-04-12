#include <sw/redis++/redis.h>
#include <gflags/gflags.h>
#include <iostream>
#include <thread>

DEFINE_string(ip, "127.0.0.1", "设置Redis的IP地址,格式:127.0.0.1");
DEFINE_int32(port, 6379, "设置Redis的监听端口,格式:6379");
DEFINE_int32(db, 0, "设置Redis的库编号,默认0");
DEFINE_bool(keep_alive, true, "是否启用长连接保活");

void print(sw::redis::Redis &client)
{
    auto user1 = client.get("会话ID1");
    if (user1)
        std::cout << *user1 << std::endl;
    auto user2 = client.get("会话ID2");
    if (user2)
        std::cout << *user2 << std::endl;
    auto user3 = client.get("会话ID3");
    if (user3)
        std::cout << *user3 << std::endl;
    auto user4 = client.get("会话ID4");
    if (user4)
        std::cout << *user4 << std::endl;
    auto user5 = client.get("会话ID5");
    if (user5)
        std::cout << *user5 << std::endl;
}

void add_string(sw::redis::Redis &client)
{
    client.set("会话ID1", "用户ID1");
    client.set("会话ID2", "会话ID2");
    client.set("会话ID3", "会话ID3");
    client.set("会话ID4", "会话ID4");
    client.set("会话ID5", "会话ID5");

    client.set("会话ID5", "会话ID5555");

    client.del("会话ID4");

    print(client);
}

void expired_test(sw::redis::Redis &client)
{
    client.set("会话ID1", "用户ID1111", std::chrono::milliseconds(1000));
    std::cout << "-------休眠1s---------" << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(1));
    print(client);
}

void list_test(sw::redis::Redis &client)
{
    client.rpush("群聊1", "成员1");
    client.rpush("群聊1", "成员2");
    client.rpush("群聊1", "成员3");
    client.rpush("群聊1", "成员4");
    client.rpush("群聊1", "成员5");

    std::vector<std::string> users;
    client.lrange("群聊1", 0, -1, std::back_inserter(users));

    for (auto &user : users)
    {
        std::cout << user << std::endl;
    }
}

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);

    sw::redis::ConnectionOptions opts;
    opts.host = FLAGS_ip;
    opts.keep_alive = FLAGS_keep_alive;
    opts.port = FLAGS_port;
    opts.db = FLAGS_db;

    sw::redis::Redis client(opts);
    add_string(client);
    expired_test(client);
    list_test(client);
    return 0;
}