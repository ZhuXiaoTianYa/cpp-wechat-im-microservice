#include "transmite_server.hpp"
#include <gflags/gflags.h>
#include <thread>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(registry_host, "http://127.0.0.1:2379", "注册服务中心地址");
DEFINE_string(base_service, "/service", "服务器监控根目录");
DEFINE_string(instance_name, "/transmite_service/instance", "当前实例化名称");
DEFINE_string(access_host, "127.0.0.1:9005", "当前实例化外部访问地址");

DEFINE_int32(listen_port, 9005, "Rpc服务监听端口");
DEFINE_int32(rpc_timeout, -1, "Rpc调用超时时间");
DEFINE_int32(rpc_threads, 1, "Rpc的I/O线程数量");

DEFINE_string(mysql_host, "127.0.0.1", "Mysql服务器访问地址");
DEFINE_int32(mysql_port, 0, "Mysql服务器访问端口");
DEFINE_string(mysql_db, "zhutian_im", "Mysql默认库名称");
DEFINE_string(mysql_user, "zhutian", "Mysql服务器访问用户名");
DEFINE_string(mysql_passwd, "zhutian2004", "Mysql服务器访问用户名");
DEFINE_string(mysql_cset, "utf8", "Mysql客户端字符集");
DEFINE_int32(mysql_pool_count, 4, "Mysql连接池最大数量");

DEFINE_string(mq_user, "root", "消息队列服务器访问用户名");
DEFINE_string(mq_passwd, "zhutian2004", "消息队列服务器访问密码");
DEFINE_string(mq_host, "127.0.0.1:5672", "消息队列服务器访问地址");
DEFINE_string(mq_msg_exchange, "msg_exchange", "持久化消息的发布交换机名称");
DEFINE_string(mq_msg_queue, "msg_queue", "持久化消息的发布队列名称");
DEFINE_string(mq_msg_binding_key, "msg_queue", "持久化消息的发布key名称");

DEFINE_string(user_service, "/service/user_service", "文件管理子服务名称");

int main(int argc, char *argv[]) {
    // void make_mysql_object(const std::string &user, const std::string
    // &passwd, const std::string &host, const std::string &db, const
    // std::string &cset, int port, int &conn_pool_count)
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    im_server::TransmiteServerBuilder tsb;
    tsb.make_mq_object(FLAGS_mq_user, FLAGS_mq_passwd, FLAGS_mq_host,
                       FLAGS_mq_msg_exchange, FLAGS_mq_msg_queue,
                       FLAGS_mq_msg_binding_key);
    tsb.make_mysql_object(FLAGS_mysql_user, FLAGS_mysql_passwd,
                          FLAGS_mysql_host, FLAGS_mysql_db, FLAGS_mysql_cset,
                          FLAGS_mysql_port, FLAGS_mysql_pool_count);
    tsb.make_discovery_object(FLAGS_registry_host, FLAGS_base_service,
                              FLAGS_user_service);
    tsb.make_registry_object(FLAGS_registry_host,
                             FLAGS_base_service + FLAGS_instance_name,
                             FLAGS_access_host);
    tsb.make_rpc_object(FLAGS_listen_port, FLAGS_rpc_timeout,
                        FLAGS_rpc_threads);
    auto server = tsb.build();
    server->start();
    return 0;
}