#include <ev.h>
#include <amqpcpp.h>
#include <amqpcpp/libev.h>
#include <openssl/ssl.h>
#include <openssl/opensslv.h>

int main()
{
    auto *loop = EV_DEFAULT;
    AMQP::LibEvHandler handler(loop);
    AMQP::Address address("amqp://root:zhutian2004@127.0.0.1:5672/");
    AMQP::TcpConnection connection(&handler, address);
    AMQP::TcpChannel channel(&connection);
    channel.declareExchange("test-exchange", AMQP::ExchangeType::direct).onError([](const char *message)
                                                                                 { std::cout << "声明交换机失败：" << message << std::endl; })
        .onSuccess([]()
                   { std::cout << "声明交换机成功" << std::endl; });
    channel.declareQueue("test-queue").onError([](const char *message)
                                               { std::cout << "声明队列失败：" << message << std::endl; })
        .onSuccess([]()
                   { std::cout << "声明队列成功" << std::endl; });

    channel.bindQueue("test-exchange", "test-queue", "test-key").onError([](const char *message)
                                                                         { std::cout << "绑定队列与交换机失败：" << message << std::endl; })
        .onSuccess([]()
                   { std::cout << "绑定队列与交换机成功" << std::endl; });
    for (int i = 0; i < 10; i++)
    {
        std::string msg = "hello-" + std::to_string(i);
        bool ret = channel.publish("test-exchange", "test-key", msg.c_str());
        if (ret == false)
        {
            std::cout << "publish失败" << std::endl;
        }
    }
    ev_run(loop, 0);
    return 0;
}