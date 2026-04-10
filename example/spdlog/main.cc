#include "logger.hpp"
#include <gflags/gflags.h>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    LOG_TRACE("你好,{}", "烛天");
    LOG_DEBUG("你好,{}", "烛天");
    LOG_INFO("你好,{}", "烛天");
    LOG_WARN("你好,{}", "烛天");
    LOG_ERROR("你好,{}", "烛天");
    LOG_FATAL("你好,{}", "烛天");
    return 0;
}