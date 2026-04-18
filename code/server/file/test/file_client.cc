#include <gflags/gflags.h>
#include <gtest/gtest.h>
#include <thread>
#include "logger.hpp"
#include "utils.hpp"
#include "base.pb.h"
#include "file.pb.h"
#include "etcd.hpp"
#include "channel.hpp"

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(etcd_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(file_name, "/service/file_service", "服务关心目录");

im_server::ServiceChannel::ChannelPtr channel;

std::string single_file_id;
std::vector<std::string> multi_file_id;

TEST(put_file, single_file)
{
    im_server::FileService_Stub stub(channel.get());
    im_server::PutSingleFileReq req;
    req.set_request_id("22222");
    std::string body;
    ASSERT_TRUE(im_server::readFile("Makefile", body));
    brpc::Controller *cntl = new brpc::Controller();
    req.mutable_file_data()->set_file_size(body.size());
    req.mutable_file_data()->set_file_name("Makefile");
    req.mutable_file_data()->set_file_content(body);
    im_server::PutSingleFileRsp resp;
    stub.PutSingleFile(cntl, &req, &resp, nullptr);

    ASSERT_FALSE(cntl->Failed());
    ASSERT_TRUE(resp.success());
    ASSERT_EQ(resp.request_id(), "22222");
    single_file_id = resp.file_info().file_id();
    ASSERT_EQ(resp.file_info().file_size(), body.size());
    ASSERT_EQ(resp.file_info().file_name(), "Makefile");
    LOG_DEBUG("文件ID：{}", resp.file_info().file_id());
}

TEST(get_file, single_file)
{
    im_server::FileService_Stub stub(channel.get());
    im_server::GetSingleFileReq req;
    req.set_request_id("11111");
    req.set_file_id(single_file_id);
    brpc::Controller *cntl = new brpc::Controller();
    std::string file_content;
    im_server::GetSingleFileRsp resp;
    stub.GetSingleFile(cntl, &req, &resp, nullptr);

    ASSERT_FALSE(cntl->Failed());
    ASSERT_TRUE(resp.success());
    ASSERT_EQ(resp.request_id(), "11111");
    ASSERT_EQ(resp.file_data().file_id(), single_file_id);
    ASSERT_TRUE(im_server::writeFile("make_file_download", resp.file_data().file_content()));
}

TEST(put_file, multi_file)
{
    im_server::FileService_Stub stub(channel.get());
    im_server::PutMultiFileReq req;
    req.set_request_id("33333");
    std::string body1;
    ASSERT_TRUE(im_server::readFile("base.pb.cc", body1));
    brpc::Controller *cntl = new brpc::Controller();
    auto file_data = req.add_file_data();
    file_data->set_file_size(body1.size());
    file_data->set_file_name("base.pb.cc");
    file_data->set_file_content(body1);

    std::string body2;
    ASSERT_TRUE(im_server::readFile("file.pb.cc", body2));
    file_data = req.add_file_data();
    file_data->set_file_size(body2.size());
    file_data->set_file_name("file.pb.cc");
    file_data->set_file_content(body2);

    im_server::PutMultiFileRsp resp;
    LOG_DEBUG("复合请求长度{}", req.file_data_size());
    stub.PutMultiFile(cntl, &req, &resp, nullptr);

    ASSERT_FALSE(cntl->Failed());
    ASSERT_TRUE(resp.success());
    ASSERT_EQ(resp.request_id(), "33333");

    for (int i = 0; i < resp.file_info_size(); i++)
    {
        multi_file_id.push_back(resp.file_info(i).file_id());
        LOG_DEBUG("文件ID：{}", resp.file_info(i).file_id());
    }
}

TEST(get_file, multi_file)
{
    im_server::FileService_Stub stub(channel.get());
    im_server::GetMultiFileReq req;
    req.set_request_id("44444");
    brpc::Controller *cntl = new brpc::Controller();
    req.add_file_id_list(multi_file_id[0]);
    req.add_file_id_list(multi_file_id[1]);

    im_server::GetMultiFileRsp resp;
    stub.GetMultiFile(cntl, &req, &resp, nullptr);

    ASSERT_FALSE(cntl->Failed());
    ASSERT_TRUE(resp.success());
    ASSERT_EQ(resp.request_id(), "44444");

    ASSERT_TRUE(resp.file_data().find(multi_file_id[0]) != resp.file_data().end());
    ASSERT_TRUE(resp.file_data().find(multi_file_id[1]) != resp.file_data().end());
    auto map = resp.file_data();
    auto file_data1 = map[multi_file_id[0]];
    im_server::writeFile("base_download_file1", file_data1.file_content());
    auto file_data2 = map[multi_file_id[1]];
    im_server::writeFile("file_download_file2", file_data2.file_content());
}

int main(int argc, char *argv[])
{
    testing::InitGoogleTest(&argc, argv);
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

    im_server::ServiceManager::Ptr sm = std::make_shared<im_server::ServiceManager>();
    auto put_cb = std::bind(&im_server::ServiceManager::onServiceOnline, sm.get(), std::placeholders::_1, std::placeholders::_2);
    auto del_cb = std::bind(&im_server::ServiceManager::onServiceOffline, sm.get(), std::placeholders::_1, std::placeholders::_2);
    sm->declared(FLAGS_file_name);

    im_server::Discoverer::ptr dclient = std::make_shared<im_server::Discoverer>(FLAGS_etcd_host, FLAGS_base_service, put_cb, del_cb);

    channel = sm->choose(FLAGS_file_name);
    if (!channel)
    {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return -1;
    }
    return RUN_ALL_TESTS();
}