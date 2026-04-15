    #include <brpc/server.h>
    #include <butil/logging.h>
    #include "logger.hpp"
    #include "speech.pb.h"
    #include "asr.hpp"
    #include "etcd.hpp"

    namespace im_server
    {
        class SpeechServiceImpl : public SpeechService
        {
        public:
            SpeechServiceImpl(const ASRClient::ptr &asr_client) : _asr_client(asr_client) {}
            ~SpeechServiceImpl() {}
            void SpeechRecognition(google::protobuf::RpcController *controller,
                                const ::im_server::SpeechRecognitionReq *request,
                                ::im_server::SpeechRecognitionRsp *response,
                                ::google::protobuf::Closure *done)
            {
                brpc::ClosureGuard rpc_guard(done);
                std::string err;
                std::string ret = _asr_client->recognize(request->speech_content(), err);
                if (ret.empty())
                {
                    LOG_ERROR("{}语音识别失败", request->request_id());
                    response->set_request_id(request->request_id());
                    response->set_success(false);
                    response->set_errmsg(err);
                    return;
                }
                response->set_request_id(request->request_id());
                response->set_success(true);
                response->set_recognition_result(ret);
            }

        private:
            ASRClient::ptr _asr_client;
        };

        class SpeechServer
        {
        public:
            using ptr = std::shared_ptr<SpeechServer>;
            SpeechServer(const ASRClient::ptr &asr_client, const Registrar::ptr &reg_client, const std::shared_ptr<brpc::Server> &rpc_server) : _asr_client(asr_client), _reg_client(reg_client), _rpc_server(rpc_server) {}
            ~SpeechServer() {}

            // 启动RPC服务器
            void start()
            {
                _rpc_server->RunUntilAskedToQuit();
            }

        private:
            ASRClient::ptr _asr_client;
            Registrar::ptr _reg_client;
            std::shared_ptr<brpc::Server> _rpc_server;
        };

        class SpeechServerBuilder
        {
        public:
            void make_asr_object(const std::string &app_id, const std::string &api_key, const std::string &secret_key)
            {
                _asr_client = std::make_shared<ASRClient>(app_id, api_key, secret_key);
            }

            void make_reg_object(const std::string &reg_host, const std::string &service_name, const std::string &access_host)
            {
                _reg_client = std::make_shared<Registrar>(reg_host);
                bool ret = _reg_client->registry(service_name, access_host);
                if (ret == false)
                    abort();
            }

            void make_rpc_object(const uint16_t &port, const uint32_t &timeout, const uint8_t &num_threads)
            {
                if (!_asr_client)
                {
                    LOG_ERROR("语音识别模块未初始化");
                    abort();
                }
                _rpc_server = std::make_shared<brpc::Server>();
                SpeechServiceImpl *speech_service = new SpeechServiceImpl(_asr_client);
                int ret = _rpc_server->AddService(speech_service, brpc::ServiceOwnership::SERVER_DOESNT_OWN_SERVICE);
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

            SpeechServer::ptr build()
            {
                if (!_asr_client)
                {
                    LOG_ERROR("语音识别模块未初始化");
                    abort();
                }
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
                return std::make_shared<SpeechServer>(_asr_client, _reg_client, _rpc_server);
            }

        private:
            ASRClient::ptr _asr_client;
            Registrar::ptr _reg_client;
            std::shared_ptr<brpc::Server> _rpc_server;
        };
    }