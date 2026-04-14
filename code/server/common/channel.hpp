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
    class ServiceChannel
    {
    public:
        using Ptr = std::shared_ptr<ServiceChannel>;
        using ChannelPtr = std::shared_ptr<brpc::Channel>;
        ServiceChannel(const std::string &name) : _service_name(name), _index(0) {}

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
        std::mutex _mutex;
        int _index;
        std::string _service_name;
        std::vector<ChannelPtr> _channels;
        std::unordered_map<std::string, ChannelPtr> _hosts;
    };

    class ServiceManager
    {
    public:
        using Ptr = std::shared_ptr<ServiceManager>;
        ServiceManager() {}
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

        void declared(const std::string &service_name)
        {
            std::unique_lock<std::mutex> lock(_mutex);
            _follow_services.insert(service_name);
        }

        void onServiceOnline(const std::string &service_instance, const std::string &host)
        {
            std::string service_name = getServiceName(service_instance);
            ServiceChannel::Ptr service;
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
            ServiceChannel::Ptr service;
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
        std::unordered_map<std::string, ServiceChannel::Ptr> _services;
        std::unordered_set<std::string> _follow_services;
    };
}