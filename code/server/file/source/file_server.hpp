#include <sys/stat.h>
#include <brpc/server.h>
#include <butil/logging.h>
#include "logger.hpp"
#include "file.pb.h"
#include "etcd.hpp"
#include "utils.hpp"

namespace im_server
{
    class FileServiceImpl : public FileService
    {
    public:
        // message GetSingleFileReq
        // {
        //     string request_id = 1;
        //     string file_id = 2;
        //     optional string user_id = 3;
        //     optional string session_id = 4;
        // }
        //     message GetSingleFileRsp {
        //     string request_id = 1;
        //     bool success = 2;
        //     string errmsg = 3;
        //     FileDownloadData file_data = 4;
        // }

        FileServiceImpl(const std::string &storage_path)
            : _storage_path(storage_path)
        {
            umask(0);
            if (_storage_path.back() != '/')
                _storage_path.push_back('/');
            mkdir(_storage_path.c_str(), 0775);
        }
        ~FileServiceImpl() {}
        void GetSingleFile(google::protobuf::RpcController *controller,
                           const ::im_server::GetSingleFileReq *request,
                           ::im_server::GetSingleFileRsp *response,
                           ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            response->set_request_id(request->request_id());
            std::string fid = request->file_id();
            std::string filename = _storage_path + fid;
            std::string body;
            bool ret = readFile(filename, body);
            if (ret == false)
            {
                response->set_success(false);
                response->set_errmsg("读取文件数据失败");
                LOG_ERROR("{} 读取文件数据失败", request->request_id());
                return;
            }
            response->mutable_file_data()->set_file_id(fid);
            response->mutable_file_data()->set_file_content(body);
            response->set_success(true);
            return;
        }
        void PutSingleFile(google::protobuf::RpcController *controller,
                           const ::im_server::PutSingleFileReq *request,
                           ::im_server::PutSingleFileRsp *response,
                           ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            response->set_request_id(request->request_id());
            std::string fid = uuid();
            std::string filename = _storage_path + fid;
            bool ret = writeFile(filename, request->file_data().file_content());
            if (ret == false)
            {
                response->set_success(false);
                response->set_errmsg("写入文件数据失败");
                LOG_ERROR("{} 写入文件数据失败", request->request_id());
                return;
            }
            response->mutable_file_info()->set_file_id(fid);
            response->mutable_file_info()->set_file_size(request->file_data().file_size());
            response->mutable_file_info()->set_file_name(request->file_data().file_name());
            response->set_success(true);
        }
        void GetMultiFile(google::protobuf::RpcController *controller,
                          const ::im_server::GetMultiFileReq *request,
                          ::im_server::GetMultiFileRsp *response,
                          ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            response->set_request_id(request->request_id());
            for (int i = 0; i < request->file_id_list_size(); i++)
            {
                std::string fid = request->file_id_list(i);
                std::string filename = _storage_path + fid;
                std::string body;
                bool ret = readFile(filename, body);
                if (ret == false)
                {
                    response->set_success(false);
                    response->set_errmsg("读取文件数据失败");
                    LOG_ERROR("{} 读取文件数据失败", request->request_id());
                    return;
                }
                FileDownloadData data;
                data.set_file_id(fid);
                data.set_file_content(body);
                response->mutable_file_data()->insert({fid, data});
            }
            response->set_success(true);
        }
        void PutMultiFile(google::protobuf::RpcController *controller,
                          const ::im_server::PutMultiFileReq *request,
                          ::im_server::PutMultiFileRsp *response,
                          ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            response->set_request_id(request->request_id());
            for (int i = 0; i < request->file_data_size(); i++)
            {
                std::string fid = uuid();
                std::string filename = _storage_path + fid;
                LOG_DEBUG("正在上传第{}个文件", i);
                bool ret = writeFile(filename, request->file_data(i).file_content());
                if (ret == false)
                {
                    response->set_success(false);
                    response->set_errmsg("写入文件数据失败");
                    LOG_ERROR("{} 写入文件数据失败", request->request_id());
                    return;
                }
                FileMessageInfo *info = response->add_file_info();
                info->set_file_id(fid);
                info->set_file_size(request->file_data(i).file_size());
                info->set_file_name(request->file_data(i).file_name());
            }
            response->set_success(true);
        }

    private:
        std::string _storage_path;
    };

    class FileServer
    {
    public:
        using ptr = std::shared_ptr<FileServer>;
        FileServer(const Registrar::ptr &reg_client, const std::shared_ptr<brpc::Server> &rpc_server) : _reg_client(reg_client), _rpc_server(rpc_server) {}
        ~FileServer() {}

        // 启动RPC服务器
        void start()
        {
            _rpc_server->RunUntilAskedToQuit();
        }

    private:
        Registrar::ptr _reg_client;
        std::shared_ptr<brpc::Server> _rpc_server;
    };

    class FileServerBuilder
    {
    public:
        void make_reg_object(const std::string &reg_host, const std::string &service_name, const std::string &access_host)
        {
            _reg_client = std::make_shared<Registrar>(reg_host);
            bool ret = _reg_client->registry(service_name, access_host);
            if (ret == false)
                abort();
        }

        void make_rpc_object(const uint16_t &port, const uint32_t &timeout, const uint8_t &num_threads, const std::string &path = "./data/")
        {
            _rpc_server = std::make_shared<brpc::Server>();
            FileServiceImpl *file_service = new FileServiceImpl(path);
            int ret = _rpc_server->AddService(file_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
            if (ret == -1)
            {
                LOG_ERROR("添加Rpc服务失败");
                abort();
            }
            brpc::ServerOptions options;
            options.idle_timeout_sec = timeout;
            options.num_threads = num_threads;
            ret = _rpc_server->Start(port, &options);
            if (ret == -1)
            {
                LOG_ERROR("启动Rpc服务失败");
                abort();
            }
        }

        FileServer::ptr build()
        {
            if (!_reg_client)
            {
                LOG_ERROR("服务注册模块未初始化");
                abort();
            }
            if (!_rpc_server)
            {
                LOG_ERROR("Rpc服务器模块未初始化");
                abort();
            }
            return std::make_shared<FileServer>(_reg_client, _rpc_server);
        }

    private:
        Registrar::ptr _reg_client;
        std::shared_ptr<brpc::Server> _rpc_server;
    };
}