/**
 * @file file_server.hpp
 * @brief 文件存储服务模块
 * @details 提供文件上传、下载功能，基于本地文件系统存储
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#define IM_LOG_SERVICE_TAG "文件服务"
#include <sys/stat.h>
#include <brpc/server.h>
#include <butil/logging.h>
#include "logger.hpp"
#include "file.pb.h"
#include "etcd.hpp"
#include "utils.hpp"

namespace im_server
{
    /**
     * @class FileServiceImpl
     * @brief 文件服务RPC接口实现类
     * @details 提供单文件/多文件上传下载功能，基于本地文件系统存储
     */
    class FileServiceImpl : public FileService
    {
    public:
        /**
         * @brief 构造函数
         * @param storage_path 文件存储根目录路径
         * @details 自动创建存储目录，设置权限为0775
         */
        FileServiceImpl(const std::string &storage_path)
            : _storage_path(storage_path)
        {
            umask(0);
            if (_storage_path.back() != '/')
                _storage_path.push_back('/');
            mkdir(_storage_path.c_str(), 0775);
        }
        
        ~FileServiceImpl() {}
        
        /**
         * @brief 下载单个文件
         * @param controller RPC控制器
         * @param request 请求（包含文件ID）
         * @param response 响应（包含文件内容）
         * @param done RPC回调
         * @details 根据文件ID从本地存储读取文件内容
         */
        void GetSingleFile(google::protobuf::RpcController *controller,
                           const ::im_server::GetSingleFileReq *request,
                           ::im_server::GetSingleFileRsp *response,
                           ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            std::string rid = request->request_id();
            std::string fid = request->file_id();
            
            LOG_INFO("RPC GetSingleFile | request_id={} | file_id={}", rid, fid);
            
            response->set_request_id(rid);
            std::string filename = _storage_path + fid;
            std::string body;
            bool ret = readFile(filename, body);
            if (ret == false)
            {
                LOG_ERROR("RPC GetSingleFile | request_id={} | 阶段=读取文件 | 结果=失败 | path={}", rid, filename);
                response->set_success(false);
                response->set_errmsg("读取文件数据失败");
                return;
            }
            
            LOG_INFO("RPC GetSingleFile | request_id={} | 阶段=完成 | size={}", rid, body.size());
            response->mutable_file_data()->set_file_id(fid);
            response->mutable_file_data()->set_file_content(body);
            response->set_success(true);
            return;
        }
        /**
         * @brief 上传单个文件
         * @param controller RPC控制器
         * @param request 请求（包含文件数据）
         * @param response 响应（包含文件ID和元信息）
         * @param done RPC回调
         * @details 上传文件到本地存储，生成唯一文件ID
         */
        void PutSingleFile(google::protobuf::RpcController *controller,
                           const ::im_server::PutSingleFileReq *request,
                           ::im_server::PutSingleFileRsp *response,
                           ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            std::string rid = request->request_id();
            size_t file_size = request->file_data().file_size();
            
            LOG_INFO("RPC PutSingleFile | request_id={} | size={}", rid, file_size);
            
            response->set_request_id(rid);
            std::string fid = uuid();
            std::string filename = _storage_path + fid;
            bool ret = writeFile(filename, request->file_data().file_content());
            if (ret == false)
            {
                LOG_ERROR("RPC PutSingleFile | request_id={} | 阶段=写入文件 | 结果=失败 | path={}", rid, filename);
                response->set_success(false);
                response->set_errmsg("写入文件数据失败");
                return;
            }
            
            LOG_INFO("RPC PutSingleFile | request_id={} | 阶段=完成 | file_id={}", rid, fid);
            response->mutable_file_info()->set_file_id(fid);
            response->mutable_file_info()->set_file_size(file_size);
            response->mutable_file_info()->set_file_name(request->file_data().file_name());
            response->set_success(true);
        }
        /**
         * @brief 批量下载文件
         * @param controller RPC控制器
         * @param request 请求（包含多个文件ID）
         * @param response 响应（包含多个文件内容）
         * @param done RPC回调
         * @details 根据文件ID列表批量读取文件内容
         */
        void GetMultiFile(google::protobuf::RpcController *controller,
                          const ::im_server::GetMultiFileReq *request,
                          ::im_server::GetMultiFileRsp *response,
                          ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            std::string rid = request->request_id();
            int file_count = request->file_id_list_size();
            
            LOG_INFO("RPC GetMultiFile | request_id={} | count={}", rid, file_count);
            
            response->set_request_id(rid);
            for (int i = 0; i < file_count; i++)
            {
                std::string fid = request->file_id_list(i);
                std::string filename = _storage_path + fid;
                std::string body;
                bool ret = readFile(filename, body);
                if (ret == false)
                {
                    LOG_ERROR("RPC GetMultiFile | request_id={} | 阶段=读取文件 | 结果=失败 | index={} | file_id={}", rid, i, fid);
                    response->set_success(false);
                    response->set_errmsg("读取文件数据失败");
                    return;
                }
                FileDownloadData data;
                data.set_file_id(fid);
                data.set_file_content(body);
                response->mutable_file_data()->insert({fid, data});
            }
            
            LOG_INFO("RPC GetMultiFile | request_id={} | 阶段=完成 | success_count={}", rid, file_count);
            response->set_success(true);
        }
        /**
         * @brief 批量上传文件
         * @param controller RPC控制器
         * @param request 请求（包含多个文件数据）
         * @param response 响应（包含多个文件信息）
         * @param done RPC回调
         * @details 批量上传文件到本地存储，为每个文件生成唯一ID
         */
        void PutMultiFile(google::protobuf::RpcController *controller,
                          const ::im_server::PutMultiFileReq *request,
                          ::im_server::PutMultiFileRsp *response,
                          ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            std::string rid = request->request_id();
            int file_count = request->file_data_size();
            
            LOG_INFO("RPC PutMultiFile | request_id={} | count={}", rid, file_count);
            
            response->set_request_id(rid);
            for (int i = 0; i < file_count; i++)
            {
                std::string fid = uuid();
                std::string filename = _storage_path + fid;
                LOG_DEBUG("RPC PutMultiFile | request_id={} | 阶段=写入文件 | index={} | file_id={}", rid, i, fid);
                bool ret = writeFile(filename, request->file_data(i).file_content());
                if (ret == false)
                {
                    LOG_ERROR("RPC PutMultiFile | request_id={} | 阶段=写入文件 | 结果=失败 | index={}", rid, i);
                    response->set_success(false);
                    response->set_errmsg("写入文件数据失败");
                    return;
                }
                FileMessageInfo *info = response->add_file_info();
                info->set_file_id(fid);
                info->set_file_size(request->file_data(i).file_size());
                info->set_file_name(request->file_data(i).file_name());
            }
            
            LOG_INFO("RPC PutMultiFile | request_id={} | 阶段=完成 | success_count={}", rid, file_count);
            response->set_success(true);
        }

    private:
        std::string _storage_path; ///< 文件存储根目录路径
    };

    /**
     * @class FileServer
     * @brief 文件服务器主类
     * @details 封装文件服务的所有依赖组件，提供启动接口
     */
    class FileServer
    {
    public:
        using ptr = std::shared_ptr<FileServer>;
        
        /**
         * @brief 构造函数
         * @param reg_client 服务注册客户端
         * @param rpc_server RPC服务器实例
         */
        FileServer(const Registrar::ptr &reg_client, const std::shared_ptr<brpc::Server> &rpc_server) 
            : _reg_client(reg_client), _rpc_server(rpc_server) {}
        
        ~FileServer() {}

        /**
         * @brief 启动RPC服务器
         * @details 阻塞运行直到收到退出信号
         */
        void start()
        {
            _rpc_server->RunUntilAskedToQuit();
        }

    private:
        Registrar::ptr _reg_client;            ///< 服务注册客户端
        std::shared_ptr<brpc::Server> _rpc_server; ///< RPC服务器
    };

    /**
     * @class FileServerBuilder
     * @brief 文件服务器构建器
     * @details 使用Builder模式构建文件服务器，按步骤初始化各个组件
     */
    class FileServerBuilder
    {
    public:
        /**
         * @brief 创建服务注册客户端
         * @param reg_host etcd服务器地址
         * @param service_name 服务名称
         * @param access_host 服务访问地址
         * @details 将本服务注册到etcd，失败则终止程序
         */
        void make_reg_object(const std::string &reg_host, const std::string &service_name, const std::string &access_host)
        {
            _reg_client = std::make_shared<Registrar>(reg_host);
            bool ret = _reg_client->registry(service_name, access_host);
            if (ret == false)
                abort();
        }

        /**
         * @brief 创建RPC服务器
         * @param port 监听端口
         * @param timeout 空闲超时时间（秒）
         * @param num_threads 工作线程数
         * @param path 文件存储根目录路径（默认为"./data/"）
         * @details 创建并启动RPC服务器，注册文件服务实现
         */
        void make_rpc_object(const uint16_t &port, const uint32_t &timeout, const uint8_t &num_threads, const std::string &path = "./data/")
        {
            _rpc_server = std::make_shared<brpc::Server>();
            FileServiceImpl *file_service = new FileServiceImpl(path);
            int ret = _rpc_server->AddService(file_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
            if (ret == -1)
            {
                LOG_ERROR("文件服务启动失败 | 阶段=添加RPC服务");
                abort();
            }
            brpc::ServerOptions options;
            options.idle_timeout_sec = timeout;
            options.num_threads = num_threads;
            ret = _rpc_server->Start(port, &options);
            if (ret == -1)
            {
                LOG_ERROR("文件服务启动失败 | 阶段=启动RPC服务器 | port={}", port);
                abort();
            }
            LOG_INFO("文件服务启动成功 | port={} | timeout={}s | threads={} | storage_path={}", port, timeout, num_threads, path);
        }

        FileServer::ptr build()
        {
            if (!_reg_client)
            {
                LOG_ERROR("文件服务构建失败 | 组件=etcd服务注册 | 原因=未初始化");
                abort();
            }
            if (!_rpc_server)
            {
                LOG_ERROR("文件服务构建失败 | 组件=RPC服务器 | 原因=未初始化");
                abort();
            }
            return std::make_shared<FileServer>(_reg_client, _rpc_server);
        }

    private:
        Registrar::ptr _reg_client;
        std::shared_ptr<brpc::Server> _rpc_server;
    };
}