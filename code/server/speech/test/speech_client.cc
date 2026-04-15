#include "etcd.hpp"
#include "channel.hpp"
#include <gflags/gflags.h>
#include <thread>
#include "aip-cpp-sdk/speech.h"
#include "speech.pb.h"

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(speech_name, "/service/speech_service", "服务关心目录");

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    im_server::ServiceManager::Ptr sm = std::make_shared<im_server::ServiceManager>();
    auto put_cb = std::bind(&im_server::ServiceManager::onServiceOnline, sm.get(), std::placeholders::_1, std::placeholders::_2);
    auto del_cb = std::bind(&im_server::ServiceManager::onServiceOffline, sm.get(), std::placeholders::_1, std::placeholders::_2);
    sm->declared(FLAGS_speech_name);

    im_server::Discoverer::ptr dclient = std::make_shared<im_server::Discoverer>(FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);

    auto channel = sm->choose(FLAGS_speech_name);
    if (!channel)
    {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return -1;
    }

    im_server::SpeechService_Stub stub(channel.get());
    im_server::SpeechRecognitionReq *req = new im_server::SpeechRecognitionReq();
    im_server::SpeechRecognitionRsp *resp = new im_server::SpeechRecognitionRsp();
    brpc::Controller *cntl = new brpc::Controller();
    std::string file_content;
    aip::get_file_content("16k.pcm", &file_content);
    req->set_request_id("11111");
    req->set_speech_content(file_content);
    stub.SpeechRecognition(cntl, req, resp, nullptr);
    if (cntl->Failed() == true)
    {
        std::cout << "Rpc调用失败: " << cntl->ErrorText() << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return -1;
    }
    if (resp->success() == false)
    {
        std::cout << resp->errmsg() << std::endl;
        return -1;
    }
    std::cout << "收到响应: " << resp->request_id() << std::endl;
    std::cout << "收到响应: " << resp->recognition_result() << std::endl;
    return 0;
}