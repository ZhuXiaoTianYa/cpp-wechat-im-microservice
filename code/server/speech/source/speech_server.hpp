/**
 * @file speech_server.hpp
 * @brief 语音识别服务模块
 * @details 封装百度ASR接口，提供语音转文字功能
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#define IM_LOG_SERVICE_TAG "语音服务"
#include <brpc/server.h>
#include <butil/logging.h>
#include "logger.hpp"
#include "speech.pb.h"
#include "asr.hpp"
#include "etcd.hpp"

namespace im_server
{
    /**
     * @class SpeechServiceImpl
     * @brief 语音识别服务RPC接口实现类
     * @details 封装百度ASR接口，提供语音转文字功能
     */
    class SpeechServiceImpl : public SpeechService
    {
    public:
        /**
         * @brief 构造函数
         * @param asr_client 百度ASR客户端
         */
        SpeechServiceImpl(const ASRClient::ptr &asr_client) : _asr_client(asr_client) {}
        
        ~SpeechServiceImpl() {}
        
        /**
         * @brief 语音识别
         * @param controller RPC控制器
         * @param request 请求（包含语音二进制数据）
         * @param response 响应（包含识别结果文本）
         * @param done RPC回调
         * @details 调用百度ASR接口进行语音识别
         */
        void SpeechRecognition(google::protobuf::RpcController *controller,
                               const ::im_server::SpeechRecognitionReq *request,
                               ::im_server::SpeechRecognitionRsp *response,
                               ::google::protobuf::Closure *done)
        {
            brpc::ClosureGuard rpc_guard(done);
            std::string rid = request->request_id();
            size_t speech_size = request->speech_content().size();
            
            LOG_INFO("RPC SpeechRecognition | request_id={} | speech_size={}", rid, speech_size);
            
            std::string err;
            std::string ret = _asr_client->recognize(request->speech_content(), err);
            if (ret.empty())
            {
                LOG_ERROR("RPC SpeechRecognition | request_id={} | 阶段=调用百度ASR | 结果=失败 | error={}", rid, err);
                response->set_request_id(rid);
                response->set_success(false);
                response->set_errmsg(err);
                return;
            }
            
            LOG_INFO("RPC SpeechRecognition | request_id={} | 阶段=完成 | result_len={}", rid, ret.size());
            response->set_request_id(rid);
            response->set_success(true);
            response->set_recognition_result(ret);
        }

    private:
        ASRClient::ptr _asr_client; ///< 百度ASR客户端
    };

    /**
     * @class SpeechServer
     * @brief 语音服务器主类
     * @details 封装语音服务的所有依赖组件，提供启动接口
     */
    class SpeechServer
    {
    public:
        using ptr = std::shared_ptr<SpeechServer>;
        
        /**
         * @brief 构造函数
         * @param asr_client 百度ASR客户端
         * @param reg_client 服务注册客户端
         * @param rpc_server RPC服务器实例
         */
        SpeechServer(const ASRClient::ptr &asr_client, const Registrar::ptr &reg_client, const std::shared_ptr<brpc::Server> &rpc_server) 
            : _asr_client(asr_client), _reg_client(reg_client), _rpc_server(rpc_server) {}
        
        ~SpeechServer() {}

        /**
         * @brief 启动RPC服务器
         * @details 阻塞运行直到收到退出信号
         */
        void start()
        {
            _rpc_server->RunUntilAskedToQuit();
        }

    private:
        ASRClient::ptr _asr_client;                ///< 百度ASR客户端
        Registrar::ptr _reg_client;                ///< 服务注册客户端
        std::shared_ptr<brpc::Server> _rpc_server; ///< RPC服务器
    };

    /**
     * @class SpeechServerBuilder
     * @brief 语音服务器构建器
     * @details 使用Builder模式构建语音服务器，按步骤初始化各个组件
     */
    class SpeechServerBuilder
    {
    public:
        /**
         * @brief 创建百度ASR客户端
         * @param app_id 百度云应用ID
         * @param api_key 百度云API Key
         * @param secret_key 百度云Secret Key
         */
        void make_asr_object(const std::string &app_id, const std::string &api_key, const std::string &secret_key)
        {
            _asr_client = std::make_shared<ASRClient>(app_id, api_key, secret_key);
        }

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
         * @details 创建并启动RPC服务器，注册语音服务实现
         */
        void make_rpc_object(const uint16_t &port, const uint32_t &timeout, const uint8_t &num_threads)
        {
            if (!_asr_client)
            {
                LOG_ERROR("语音服务启动检查失败 | 组件=百度ASR | 原因=未初始化");
                abort();
            }
            _rpc_server = std::make_shared<brpc::Server>();
            SpeechServiceImpl *speech_service = new SpeechServiceImpl(_asr_client);
            int ret = _rpc_server->AddService(speech_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
            if (ret == -1)
            {
                LOG_ERROR("语音服务启动失败 | 阶段=添加RPC服务");
                abort();
            }
            brpc::ServerOptions options;
            options.idle_timeout_sec = timeout;
            options.num_threads = num_threads;
            ret = _rpc_server->Start(port, &options);
            if (ret == -1)
            {
                LOG_ERROR("语音服务启动失败 | 阶段=启动RPC服务器 | port={}", port);
                abort();
            }
            LOG_INFO("语音服务启动成功 | port={} | timeout={}s | threads={}", port, timeout, num_threads);
        }

        /**
         * @brief 构建语音服务器实例
         * @return 语音服务器智能指针
         * @details 检查所有组件是否已初始化，构建完整的服务器实例
         */
        SpeechServer::ptr build()
        {
            if (!_asr_client)
            {
                LOG_ERROR("语音服务构建失败 | 组件=百度ASR | 原因=未初始化");
                abort();
            }
            if (!_reg_client)
            {
                LOG_ERROR("语音服务构建失败 | 组件=etcd服务注册 | 原因=未初始化");
                abort();
            }
            if (!_rpc_server)
            {
                LOG_ERROR("语音服务构建失败 | 组件=RPC服务器 | 原因=未初始化");
                abort();
            }
            return std::make_shared<SpeechServer>(_asr_client, _reg_client, _rpc_server);
        }

    private:
        ASRClient::ptr _asr_client;
        Registrar::ptr _reg_client;
        std::shared_ptr<brpc::Server> _rpc_server;
    };
}