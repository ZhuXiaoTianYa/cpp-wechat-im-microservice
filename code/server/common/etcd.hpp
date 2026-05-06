/**
 * @file etcd.hpp
 * @brief etcd服务注册与发现封装
 * @details 提供服务注册（带租约保活）和服务发现（带监听）功能
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include <etcd/Client.hpp>
#include <etcd/KeepAlive.hpp>
#include <etcd/Response.hpp>
#include <etcd/Watcher.hpp>
#include <etcd/Value.hpp>
#include <string>
#include "logger.hpp"

namespace im_server
{
    /**
     * @class Registrar
     * @brief 服务注册类
     * @details 将服务信息注册到etcd，并通过租约保活机制维持注册状态
     */
    class Registrar
    {
    public:
        using ptr = std::shared_ptr<Registrar>;

    public:
        /**
         * @brief 构造函数
         * @param host etcd服务器地址
         * @details 创建etcd客户端，建立租约（TTL=3秒）并启动保活
         */
        Registrar(const std::string &host)
            : _client(std::make_shared<etcd::Client>(host)),
              _keep_alive(_client->leasekeepalive(3).get()),
              _lease_id(_keep_alive->Lease())
        {
        }
        
        /**
         * @brief 析构函数
         * @details 取消租约保活
         */
        ~Registrar() { _keep_alive->Cancel(); }
        
        /**
         * @brief 注册服务
         * @param key 服务键（通常为服务名+实例ID）
         * @param val 服务值（通常为服务地址）
         * @return true=注册成功，false=注册失败
         * @details 将服务信息写入etcd，绑定租约，服务进程退出时自动删除
         */
        bool registry(const std::string &key, const std::string &val)
        {
            auto resp = _client->put(key, val, _lease_id).get();
            if (resp.is_ok() == false)
            {
                LOG_ERROR("注册数据失败: {}", resp.error_message());
                return false;
            }
            return true;
        }

    private:
        std::shared_ptr<etcd::Client> _client;       ///< etcd客户端
        std::shared_ptr<etcd::KeepAlive> _keep_alive; ///< 租约保活对象
        uint64_t _lease_id;                          ///< 租约ID
    };

    /**
     * @class Discoverer
     * @brief 服务发现类
     * @details 从etcd发现服务，监听服务上下线事件并触发回调
     */
    class Discoverer
    {
    public:
        using ptr = std::shared_ptr<Discoverer>;
        using NotifyCallback = std::function<void(const std::string &, const std::string &)>;

    public:
        /**
         * @brief 构造函数
         * @param host etcd服务器地址
         * @param basedir 服务发现基础路径（如"/service"）
         * @param put_cb 服务上线回调（参数：key, value）
         * @param del_cb 服务下线回调（参数：key, value）
         * @details 先拉取全量服务列表，再启动监听器监听增量变化
         */
        Discoverer(const std::string &host, const std::string &basedir, const NotifyCallback &put_cb, const NotifyCallback &del_cb)
            : _client(std::make_shared<etcd::Client>(host)),
              _put_cb(put_cb),
              _del_cb(del_cb)
        {
            auto resp = _client->ls(basedir).get();
            if (resp.is_ok() == false)
            {
                LOG_ERROR("获取服务信息数据失败: {}", resp.error_message());
            }
            int sz = resp.keys().size();
            for (int i = 0; i < sz; i++)
            {
                if (_put_cb)
                    _put_cb(resp.key(i), resp.value(i).as_string());
            }
            _watcher = std::make_shared<etcd::Watcher>(*_client.get(), basedir, std::bind(&Discoverer::callback, this, std::placeholders::_1), true);
        }

    private:
        /**
         * @brief etcd事件回调
         * @param resp etcd响应对象
         * @details 处理PUT（服务上线）和DELETE（服务下线）事件
         */
        void callback(const etcd::Response &resp)
        {
            if (resp.is_ok() == false)
            {
                LOG_ERROR("收到一个错误的事件通知: {}", resp.error_message());
                return;
            }
            for (auto &ev : resp.events())
            {
                if (ev.event_type() == etcd::Event::EventType::PUT)
                {
                    if (_put_cb)
                        _put_cb(ev.kv().key(), ev.kv().as_string());
                    LOG_DEBUG("新增服务: {}-{}", ev.kv().key(), ev.kv().as_string());
                }
                else if (ev.event_type() == etcd::Event::EventType::DELETE_)
                {
                    if (_del_cb)
                        _del_cb(ev.prev_kv().key(), ev.prev_kv().as_string());
                    LOG_DEBUG("下线服务: {}-{}", ev.prev_kv().key(), ev.prev_kv().as_string());
                }
            }
        }

    private:
        std::shared_ptr<etcd::Client> _client;
        std::shared_ptr<etcd::Watcher> _watcher;
        NotifyCallback _put_cb;
        NotifyCallback _del_cb;
    };
}