#include <etcd/Client.hpp>
#include <etcd/KeepAlive.hpp>
#include <etcd/Response.hpp>
#include <etcd/Watcher.hpp>
#include <etcd/Value.hpp>

void callback(const etcd::Response &resp)
{
    if (resp.is_ok() == false)
    {
        std::cout << "事件通知错误: " << resp.error_message() << std::endl;
        return;
    }
    for (auto const &event : resp.events())
    {
        if (event.event_type() == etcd::Event::EventType::PUT)
        {
            std::cout << "服务信息发生了改变:\n";
            std::cout << "当前的值: " << event.kv().key() << "-" << event.kv().as_string() << std::endl;
            std::cout << "原来的值: " << event.prev_kv().key() << "-" << event.prev_kv().as_string() << std::endl;
        }
        else if (event.event_type() == etcd::Event::EventType::DELETE_)
        {
            std::cout << "服务信息下线被删除\n";
            std::cout << "当前的值: " << event.kv().key() << "-" << event.kv().as_string() << std::endl;
            std::cout << "原来的值: " << event.prev_kv().key() << "-" << event.prev_kv().as_string() << std::endl;
        }
    }
}

int main(int argc, char *argv[])
{
    std::string etcd_host = "http://127.0.0.1:2379";
    etcd::Client client(etcd_host);
    auto resp = client.ls("/service").get();
    if (resp.is_ok() == false)
    {
        std::cout << "获取键值对数据失败: " << resp.error_message() << std::endl;
        return -1;
    }
    int sz = resp.keys().size();
    for (int i = 0; i < sz; i++)
    {
        std::cout << resp.value(i).as_string() << "可以提供" << resp.value(i).key() << "服务\n";
    }
    auto watcher = etcd::Watcher(client, "/service", callback, true);
    watcher.Wait();
    return 0;
}