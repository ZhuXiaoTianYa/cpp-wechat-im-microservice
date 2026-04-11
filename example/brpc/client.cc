#include <brpc/channel.h>
#include <thread>
#include "main.pb.h"

void callback(brpc::Controller *cntl, example::EchoResponse *resp)
{
    std::unique_ptr<brpc::Controller> cntl_guard(cntl);
    std::unique_ptr<example::EchoResponse> resp_guard(resp);
    if (cntl->Failed() == true)
    {
        std::cout << "Rpc调用失败: " << cntl->ErrorText() << std::endl;
        return;
    }
    std::cout << "收到响应" << resp->message() << std::endl;
}

int main(int argc, char *argv[])
{
    brpc::ChannelOptions options;
    options.connect_timeout_ms = -1;
    options.timeout_ms = -1;
    options.max_retry = 3;
    options.protocol = "baidu_std";
    brpc::Channel channel;
    int ret = channel.Init("127.0.0.1:9091", &options);
    if (ret == -1)
    {
        std::cout << "初始化信道失败!\n";
    }
    example::EchoService_Stub stub(&channel);
    example::EchoRequest *req = new example::EchoRequest();
    example::EchoResponse *resp = new example::EchoResponse();
    brpc::Controller *cntl = new brpc::Controller();
    req->set_message("你好，烛天");
    // stub.Echo(cntl, req, resp, nullptr);
    // if (cntl->Failed() == true)
    // {
    //     std::cout << "Rpc调用失败: " << cntl->ErrorText() << std::endl;
    //     return -1;
    // }
    // std::cout << "收到响应: " << resp->message() << std::endl;
    // delete cntl;
    // delete resp;
    // delete req;
    auto clusure = google::protobuf::NewCallback(callback, cntl, resp);
    stub.Echo(cntl, req, resp, clusure);
    std::cout << "异步调用结束" << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    delete req;
    return 0;
}