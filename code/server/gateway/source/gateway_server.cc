#include "gateway_server.hpp"
#include <gflags/gflags.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(registry_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(access_host, "127.0.0.1:9003", "当前实例化外部访问地址");

DEFINE_string(redis_host, "127.0.0.1", "设置Redis的IP地址,格式:127.0.0.1");
DEFINE_int32(redis_port, 6379, "设置Redis的监听端口,格式:6379");
DEFINE_int32(redis_db, 0, "设置Redis的库编号,默认0");
DEFINE_bool(redis_keep_alive, true, "是否启用长连接保活");

DEFINE_string(file_service, "/service/file_service", "文件管理子服务名称");
DEFINE_string(user_service, "/service/user_service", "好友管理子服务名称");
DEFINE_string(message_service, "/service/message_service",
              "消息管理子服务名称");
DEFINE_string(speech_service, "/service/speech_service", "语音管理子服务名称");
DEFINE_string(transmite_service, "/service/transmite_service",
              "转发管理子服务名称");
DEFINE_string(friend_service, "/service/friend_service", "好友管理子服务名称");

DEFINE_int32(http_listen_port, 9000, "设置http服务器的监听端口,格式:9000");
DEFINE_int32(websocket_listen_port, 9001, "设置websocket的监听端口,格式:9001");

int main(int argc, char *argv[]) {
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    im_server::GatewayServerBuilder gsb;
    gsb.make_redis_object(FLAGS_redis_host, FLAGS_redis_port, FLAGS_redis_db,
                          FLAGS_redis_keep_alive);
    gsb.make_discovery_object(FLAGS_registry_host, FLAGS_base_service,
                              FLAGS_file_service, FLAGS_user_service,
                              FLAGS_message_service, FLAGS_speech_service,
                              FLAGS_transmite_service, FLAGS_friend_service);
    gsb.make_server_object(FLAGS_http_listen_port, FLAGS_websocket_listen_port);
    auto server = gsb.build();
    server->start();
    return 0;
}