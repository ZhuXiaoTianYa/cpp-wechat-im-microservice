#include <iostream>
#include <spdlog/spdlog.h>
#include <spdlog/async.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/sinks/basic_file_sink.h>

int main(int argc, char *argv[])
{
    // 设置全局刷新策略
    spdlog::flush_every(std::chrono::seconds(1));
    // 设置全局日志输出等级
    spdlog::flush_on(spdlog::level::level_enum::debug);
    // 设置全局日志等级
    spdlog::set_level(spdlog::level::debug);
    spdlog::init_thread_pool(3072, 1);
    // 创建同步日志器
    auto logger = spdlog::stdout_color_mt<spdlog::async_factory>("async-logger");
    // auto logger = spdlog::basic_logger_mt("file-logger", "log.txt");
    // 设置日志器刷新策略及输出等级
    // logger->set_level(spdlog::level::debug);
    // logger->flush_on(spdlog::level::debug);

    // 设置日志的输出格式
    logger->set_pattern("[%Y-%m-%d %H:%M:%S][%n][%t][%-8l] %v");

    // 日志输出
    logger->trace("你好,{}", "烛天");
    logger->debug("你好,{}", "烛天");
    logger->info("你好,{}", "烛天");
    logger->warn("你好,{}", "烛天");
    logger->error("你好,{}", "烛天");
    logger->critical("你好,{}", "烛天");
    std::cout << "日志器输出结束" << std::endl;
    return 0;
}