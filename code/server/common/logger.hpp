/**
 * @file logger.hpp
 * @brief IM服务器日志模块封装
 * @details 基于spdlog实现的统一日志系统，支持控制台和文件输出，自动添加服务标识
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include <cstring>
#include <spdlog/async.h>
#include <spdlog/sinks/basic_file_sink.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/spdlog.h>
#include <string>

#ifndef IM_LOG_SERVICE_TAG
#define IM_LOG_SERVICE_TAG "未配置服务"
#endif

namespace im_server {

/**
 * @brief 提取文件路径中的短文件名
 * @param path 完整文件路径
 * @return 文件名部分（不含目录）
 */
inline const char *im_log_short_file(const char *path) {
    const char *s = std::strrchr(path, '/');
    if (s)
        return s + 1;
    s = std::strrchr(path, '\\');
    return s ? (s + 1) : path;
}

/// 全局默认日志器实例
inline std::shared_ptr<spdlog::logger> g_default_logger;

/**
 * @brief 初始化日志系统
 * @param mode 日志模式：false=控制台输出，true=文件输出
 * @param filename 日志文件路径（仅在mode=true时有效）
 * @param level 日志级别（0=trace, 1=debug, 2=info, 3=warn, 4=error, 5=critical）
 */
inline void init_logger(bool mode, std::string &filename, uint32_t level) {
    if (mode == false) {
        g_default_logger = spdlog::stdout_color_mt("default-logger");
        g_default_logger->set_level(spdlog::level::trace);
        g_default_logger->flush_on(spdlog::level::trace);
    } else {
        g_default_logger =
            spdlog::basic_logger_mt<spdlog::async_factory>("default-logger",
                                                          filename);
        g_default_logger->set_level((spdlog::level::level_enum)level);
        g_default_logger->flush_on((spdlog::level::level_enum)level);
    }
    g_default_logger->set_pattern(
        "[%Y-%m-%d %H:%M:%S.%e][%n][%t][%-8l]%v");
}

} // namespace im_server

/**
 * @defgroup LogMacros 日志宏定义
 * @brief 统一格式的日志输出宏，自动添加服务名、文件名和行号
 * @{
 */

/** @brief 跟踪级别日志，用于详细的调试信息 */
#define LOG_TRACE(fmt, ...)                                                  \
    im_server::g_default_logger->trace(                                      \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @brief 调试级别日志，用于开发阶段的调试信息 */
#define LOG_DEBUG(fmt, ...)                                                  \
    im_server::g_default_logger->debug(                                      \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @brief 信息级别日志，用于记录关键业务流程 */
#define LOG_INFO(fmt, ...)                                                   \
    im_server::g_default_logger->info(                                       \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @brief 警告级别日志，用于记录潜在问题或业务拒绝场景 */
#define LOG_WARN(fmt, ...)                                                   \
    im_server::g_default_logger->warn(                                       \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @brief 错误级别日志，用于记录错误和异常 */
#define LOG_ERROR(fmt, ...)                                                  \
    im_server::g_default_logger->error(                                      \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @brief 致命错误日志，用于记录导致服务无法继续运行的严重错误 */
#define LOG_FATAL(fmt, ...)                                                  \
    im_server::g_default_logger->critical(                                   \
        "[{}] [{}:{}] " fmt, IM_LOG_SERVICE_TAG,                             \
        im_server::im_log_short_file(__FILE__), __LINE__, ##__VA_ARGS__)

/** @} */
