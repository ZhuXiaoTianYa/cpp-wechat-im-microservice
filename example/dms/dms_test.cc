#include "../common/dms.hpp"
#include "../common/logger.hpp"
#include <gflags/gflags.h>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(ak, "123456", "云服务的ID");
DEFINE_string(aks, "123456", "云服务的secret");

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    DMSClient client(FLAGS_ak, FLAGS_aks);
    client.send("123456", "520131");
    return 0;
}