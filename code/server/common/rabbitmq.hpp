/**
 * @file rabbitmq.hpp
 * @brief RabbitMQ消息队列封装
 * @details 基于AMQP-CPP和libev实现的RabbitMQ客户端，支持消息发布和消费
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include "logger.hpp"
#include <amqpcpp.h>
#include <amqpcpp/libev.h>
#include <ev.h>
#include <memory>
#include <openssl/opensslv.h>
#include <openssl/ssl.h>

namespace im_server {

/**
 * @class MQClient
 * @brief RabbitMQ客户端类
 * @details 封装RabbitMQ连接、信道、交换机、队列的声明和消息收发功能
 */
class MQClient {
public:
    using ptr = std::shared_ptr<MQClient>;
    using MessageCallback = std::function<void(const char *, size_t)>;
    
    /**
     * @brief 构造函数
     * @param user RabbitMQ用户名
     * @param passwd RabbitMQ密码
     * @param host RabbitMQ服务器地址
     * @details 创建连接、信道，并启动libev事件循环线程
     */
    MQClient(const std::string &user, const std::string &passwd,
             const std::string &host) {
        _loop = EV_DEFAULT;
        _handler = std::make_unique<AMQP::LibEvHandler>(_loop);
        std::string addr = "amqp://" + user + ":" + passwd + "@" + host + "/";
        AMQP::Address address(addr);
        _connection =
            std::make_unique<AMQP::TcpConnection>(_handler.get(), address);
        _channel = std::make_unique<AMQP::TcpChannel>(_connection.get());
        _loop_thread = std::thread([this]() { ev_loop(_loop, 0); });
    }
    
    /**
     * @brief 析构函数
     * @details 停止事件循环，等待线程退出
     */
    ~MQClient() {
        ev_async_init(&_async_watcher, watcher_callback);
        ev_async_start(_loop, &_async_watcher);
        ev_async_send(_loop, &_async_watcher);
        _loop_thread.join();
    }
    
    /**
     * @brief 声明MQ组件（交换机、队列、绑定）
     * @param exchange 交换机名称
     * @param queue 队列名称
     * @param routing_key 路由键（默认为"routing_key"）
     * @param exchange_type 交换机类型（默认为direct）
     * @details 声明交换机、队列并建立绑定关系
     */
    void declareComponents(
        const std::string &exchange, const std::string &queue,
        const std::string &routing_key = "routing_key",
        AMQP::ExchangeType exchange_type = AMQP::ExchangeType::direct) {
        _channel->declareExchange(exchange, AMQP::ExchangeType::direct)
            .onError([](const char *message) {
                LOG_ERROR("声明交换机失败：{}", message);
                exit(0);
            })
            .onSuccess(
                [exchange]() { LOG_DEBUG("{} 交换机创建成功：", exchange); });
        _channel->declareQueue(queue)
            .onError([](const char *message) {
                LOG_ERROR("声明队列失败：{}", message);
                exit(0);
            })
            .onSuccess([queue]() { LOG_DEBUG("{} 队列创建成功：", queue); });

        _channel->bindQueue(exchange, queue, routing_key)
            .onError([exchange, queue](const char *message) {
                LOG_ERROR("{} - {} 绑定失败：{}", exchange, queue, message);
                exit(0);
            })
            .onSuccess([exchange, queue]() {
                LOG_DEBUG("{}-{} 绑定成功", exchange, queue);
            });
    }

    bool publish(const std::string &exchange, const std::string &msg,
                 const std::string &routing_key = "routing_key") {
        LOG_DEBUG("向交换机{}-{}发送消息", exchange, routing_key);
        bool ret = _channel->publish(exchange, routing_key, msg);
        if (ret == false) {
            LOG_ERROR("{}发送消息失败", exchange);
            return false;
        }
        return true;
    }

    void consume(const std::string &queue, const MessageCallback &cb) {
        LOG_DEBUG("开始订阅{}队列消息", queue);

        _channel->consume(queue, "consume-tag")
            .onReceived([this, cb](const AMQP::Message &message,
                                   uint64_t deliveryTag, bool redelivered) {
                cb(message.body(), message.bodySize());
                _channel->ack(deliveryTag);
            })
            .onError([queue](const char *message) {
                LOG_ERROR("订阅{}消息失败: {}", queue, message);
                exit(0);
            });
    }

private:
    static void watcher_callback(struct ev_loop *loop, ev_async *watcher,
                                 int32_t revents) {
        ev_break(loop, EVBREAK_ALL);
    }

private:
    struct ev_loop *_loop;
    struct ev_async _async_watcher;
    std::unique_ptr<AMQP::LibEvHandler> _handler;
    std::unique_ptr<AMQP::TcpConnection> _connection;
    std::unique_ptr<AMQP::TcpChannel> _channel;
    std::thread _loop_thread;
};
} // namespace im_server