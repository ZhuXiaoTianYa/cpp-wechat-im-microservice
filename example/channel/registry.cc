#include "../common/etcd.hpp"
#include "../common/channel.hpp"
#include <gflags/gflags.h>
#include <thread>
#include <vector>
#include <unordered_map>
#include <string>
#include <memory>
#include <mutex>
#include <set>
#include <brpc/server.h>
#include <butil/logging.h>
#include <brpc/channel.h>
#include "../common/logger.hpp"
#include "main.pb.h"

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");
DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监考根目录");
DEFINE_string(instance_name, "/echo/instance", "当前实例化名称");
DEFINE_string(accert_host, "127.0.0.1:8080", "当前实例化外部访问地址");
DEFINE_uint32(listen_port,8080, "Rpc服务器监听端口");

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

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

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
    ret = server.Start(FLAGS_listen_port, &options);
    if (ret == -1)
    {
        std::cout << "启动服务器失败\n";
    }

    Registrar::ptr rclient = std::make_shared<Registrar>(FLAGS_etcd_host);
    rclient->registry(FLAGS_base_service + FLAGS_instance_name, FLAGS_accert_host);
    server.RunUntilAskedToQuit();
    return 0;
}