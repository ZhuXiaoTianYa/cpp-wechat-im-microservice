#include <brpc/server.h>
#include <butil/logging.h>
#include "main.pb.h"

class EchoServiceImpl : public example::EchoService
{
public:
    EchoServiceImpl() {}
    ~EchoServiceImpl() {}
    void Echo(google::protobuf::RpcController *controller,
              const ::example::EchoRequest *request,
              ::example::EchoResponse *response,
              ::google::protobuf::Closure *done)
    {
        brpc::ClosureGuard rpc_guard(done);
        std::cout << "收到消息:" << request->message() << std::endl;
        std::string str = "响应: " + request->message();
        response->set_message(str);
        // done->Run();
    }
};

int main()
{
    brpc::Server server;
    EchoServiceImpl echo_service;
    int ret = server.AddService(&echo_service, brpc::ServiceOwnership::SERVER_DOESNT_OWN_SERVICE);
    if (ret == -1)
    {
        std::cout << "添加服务失败\n";
    }
    brpc::ServerOptions options;
    options.idle_timeout_sec = -1;
    options.num_threads = 1;
    ret = server.Start(9091, &options);
    if (ret == -1)
    {
        std::cout << "启动服务器失败\n";
    }
    server.RunUntilAskedToQuit();
    return 0;
}