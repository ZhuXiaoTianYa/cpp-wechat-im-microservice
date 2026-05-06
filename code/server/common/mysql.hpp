/**
 * @file mysql.hpp
 * @brief MySQL数据库连接池封装
 * @details 基于ODB提供MySQL连接池工厂类
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include "logger.hpp"
#include <gflags/gflags.h>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>
#include <sstream>
#include <string>
#include <vector>

namespace im_server {

/**
 * @class ODBFactory
 * @brief ODB数据库工厂类
 * @details 创建带连接池的MySQL数据库实例
 */
class ODBFactory {
public:
    /**
     * @brief 创建MySQL数据库连接池
     * @param user 数据库用户名
     * @param passwd 数据库密码
     * @param host 数据库地址
     * @param db 数据库名
     * @param cset 字符集
     * @param port 数据库端口
     * @param conn_pool_count 连接池大小
     * @return ODB数据库实例智能指针
     * @details 创建带连接池的MySQL数据库，支持并发访问
     */
    static std::shared_ptr<odb::core::database>
    create(const std::string &user, const std::string &passwd,
           const std::string &host, const std::string &db,
           const std::string &cset, const int &port,
           const int &conn_pool_count) {
        std::unique_ptr<odb::mysql::connection_pool_factory> cpf(
            new odb::mysql::connection_pool_factory(conn_pool_count, 0));
        auto res = std::make_shared<odb::mysql::database>(
            user, passwd, db, host, port, "", cset, 0, std::move(cpf));
        return res;
    }
};

} // namespace im_server