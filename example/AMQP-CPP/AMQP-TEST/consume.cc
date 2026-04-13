#include <ev.h>
#include <amqpcpp.h>
#include <amqpcpp/libev.h>
#include <openssl/ssl.h>
#include <openssl/opensslv.h>

void callback(AMQP::TcpChannel *channel, const AMQP::Message &message, uint64_t deliveryTag, bool redelivered)
{
    std::string str;
    str.assign(message.body(), message.bodySize());
    std::cout << str << std::endl;
    channel->ack(deliveryTag);
}

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
    channel.consume("test-queue", "consume-tag").onReceived(std::bind(callback, &channel, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)).onError([](const char *message)
                                                                                                                                                                        { std::cout << "订阅test-queue队列消息失败：" << message << std::endl; });
    ev_run(loop, 0);
    return 0;
}