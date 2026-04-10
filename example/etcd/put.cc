#include <iostream>
#include <etcd/Client.hpp>
#include <etcd/KeepAlive.hpp>
#include <etcd/Response.hpp>
#include <thread>

int main(int argc, char *argv[])
{
    std::string etcd_host = "http://127.0.0.1:2380";
    etcd::Client client(etcd_host);
    auto keep_alive = client.leasekeepalive(3).get();
    auto lease_id = keep_alive->Lease();
    auto resp1 = client.put("/service/user", "127.0.0.1:8080", lease_id).get();
    if (resp1.is_ok() == false)
    {
        std::cout << "新增数据失败: " << resp1.error_message() << std::endl;
    }
    auto resp2 = client.put("/service/friend", "127.0.0.1:9000").get();
    if (resp2.is_ok() == false)
    {
        std::cout << "新增数据失败: " << resp2.error_message() << std::endl;
    }
    std::this_thread::sleep_for(std::chrono::seconds(10));
    return 0;
}