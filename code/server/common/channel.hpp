/**
 * @file channel.hpp
 * @brief RPC信道管理模块
 * @details 提供服务信道管理和负载均衡功能，支持服务上下线动态更新
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include <vector>
#include <unordered_map>
#include <string>
#include <memory>
#include <mutex>
#include <set>
#include <brpc/channel.h>
#include "logger.hpp"

namespace im_server
{
    /**
     * @class ServiceChannel
     * @brief 单个服务的信道管理类
     * @details 管理同一服务的多个实例信道，提供轮询负载均衡
     */
    class ServiceChannel
    {
    public:
        using ptr = std::shared_ptr<ServiceChannel>;
        using ChannelPtr = std::shared_ptr<brpc::Channel>;
        
        /**
         * @brief 构造函数
         * @param name 服务名称
         */
        ServiceChannel(const std::string &name) : _service_name(name), _index(0) {}

        /**
         * @brief 添加服务实例信道
         * @param host 服务地址（格式：ip:port）
         * @details 创建brpc信道并添加到信道池
         */
        void append(const std::string &host)
        {
            ChannelPtr channel = std::make_shared<brpc::Channel>();
            brpc::ChannelOptions options;
            options.connect_timeout_ms = -1;
            options.timeout_ms = -1;
            options.max_retry = 3;
            options.protocol = "baidu_std";
            int ret = channel->Init(host.c_str(), &options);
            if (ret == -1)
            {
                LOG_ERROR("初始化{}-{}信道失败!", _service_name, host);
                return;
            }
            std::unique_lock<std::mutex> lock(_mutex);
            _hosts.insert(std::make_pair(host, channel));
            _channels.push_back(channel);
        }

        /**
         * @brief 删除服务实例信道
         * @param host 服务地址
         * @details 服务下线时删除对应信道
         */
        void remove(const std::string &host)
        {
            std::unique_lock<std::mutex> lock(_mutex);
            auto it = _hosts.find(host);
            if (it == _hosts.end())
            {
                LOG_WARN("{}-{}节点删除信道时，没有找到信道信息!", _service_name, host);
                return;
            }
            for (auto vit = _channels.begin(); vit != _channels.end(); vit++)
            {
                if (*vit == it->second)
                {
                    vit = _channels.erase(vit);
                    break;
                }
            }
            _hosts.erase(it);
        }

        /**
         * @brief 选择一个信道（轮询负载均衡）
         * @return brpc信道智能指针，若无可用信道则返回空指针
         * @details 使用轮询算法在多个实例间分配请求
         */
        ChannelPtr choose()
        {
            std::unique_lock<std::mutex> lock(_mutex);
            if (_channels.empty())
            {
                return ChannelPtr();
            }
            _index = (_index + 1) % _channels.size();
            return _channels[_index];
        }

    private:
        std::mutex _mutex;                                    ///< 保护信道列表的互斥锁
        int _index;                                           ///< 轮询索引
        std::string _service_name;                            ///< 服务名称
        std::vector<ChannelPtr> _channels;                    ///< 信道列表（用于轮询）
        std::unordered_map<std::string, ChannelPtr> _hosts;  ///< 地址到信道的映射
    };

    /**
     * @class ServiceManager
     * @brief 服务管理器
     * @details 管理多个服务的信道，处理服务上下线事件，配合etcd服务发现使用
     */
    class ServiceManager
    {
    public:
        using ptr = std::shared_ptr<ServiceManager>;
        
        ServiceManager() {}
        
        /**
         * @brief 选择服务信道
         * @param service_name 服务名称
         * @return brpc信道智能指针，若服务不存在则返回空指针
         * @details 从指定服务的多个实例中选择一个信道
         */
        ServiceChannel::ChannelPtr choose(const std::string &service_name)
        {
            std::unique_lock<std::mutex> lock(_mutex);
            auto sit = _services.find(service_name);
            if (sit == _services.end())
            {
                LOG_ERROR("当前没有能提供{}服务的节点!", service_name);
                return ServiceChannel::ChannelPtr();
            }
            return sit->second->choose();
        }

        /**
         * @brief 声明关注的服务
         * @param service_name 服务名称
         * @details 只有声明关注的服务才会处理其上下线事件
         */
        void declared(const std::string &service_name)
        {
            std::unique_lock<std::mutex> lock(_mutex);
            _follow_services.insert(service_name);
        }

        /**
         * @brief 服务上线回调
         * @param service_instance 服务实例名（格式：服务名/实例ID）
         * @param host 服务地址
         * @details 由etcd服务发现触发，添加新的服务实例信道
         */
        void onServiceOnline(const std::string &service_instance, const std::string &host)
        {
            std::string service_name = getServiceName(service_instance);
            ServiceChannel::ptr service;
            {
                std::unique_lock<std::mutex> lock(_mutex);
                auto fit = _follow_services.find(service_name);
                if (fit == _follow_services.end())
                {
                    LOG_DEBUG("{}-{}服务上线了, 但是当前不关心", service_name, host);
                    return;
                }
                auto sit = _services.find(service_name);

                if (sit == _services.end())
                {
                    service = std::make_shared<ServiceChannel>(service_name);
                    _services.insert(std::make_pair(service_name, service));
                }
                else
                    service = sit->second;
            }
            if (!service)
            {
                LOG_ERROR("新增{}服务管理节点失败!", service_name);
                return;
            }
            service->append(host);
            LOG_DEBUG("{}-{}服务上线节点，进行添加管理", service_name, host);
        }

        void onServiceOffline(const std::string &service_instance, const std::string &host)
        {
            std::string service_name = getServiceName(service_instance);
            ServiceChannel::ptr service;
            {
                std::unique_lock<std::mutex> lock(_mutex);
                auto fit = _follow_services.find(service_name);
                if (fit == _follow_services.end())
                {
                    LOG_DEBUG("{}-{}服务下线了, 但是当前不关心", service_name, host);
                    return;
                }
                auto sit = _services.find(service_name);
                if (sit == _services.end())
                {
                    LOG_DEBUG("删除{}服务节点时，没有找到管理对象", service_name);
                    return;
                }
                service = sit->second;
            }
            service->remove(host);
            LOG_DEBUG("{}-{}服务下线节点，进行删除管理", service_name, host);
        }

    private:
        std::string getServiceName(const std::string &service_instance)
        {
            size_t pos = service_instance.find_last_of('/');
            if (pos == std::string::npos)
                return service_instance;
            return service_instance.substr(0, pos);
        }

    private:
        std::mutex _mutex;
        std::unordered_map<std::string, ServiceChannel::ptr> _services;
        std::unordered_set<std::string> _follow_services;
    };
}