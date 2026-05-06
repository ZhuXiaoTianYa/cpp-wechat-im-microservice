/**
 * @file connection.hpp
 * @brief WebSocket连接管理模块
 * @details 管理用户ID与WebSocket连接的双向映射关系，支持线程安全的增删查操作
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#ifndef IM_LOG_SERVICE_TAG
#define IM_LOG_SERVICE_TAG "网关"
#endif
#include "logger.hpp"
#include <cstddef>
#include <memory>
#include <mutex>
#include <unordered_map>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

namespace im_server {

/// WebSocket服务器类型定义
typedef websocketpp::server<websocketpp::config::asio> server_t;

/**
 * @class Connection
 * @brief WebSocket连接管理器
 * @details 维护用户ID与WebSocket连接的双向映射，支持：
 *          - 根据用户ID查找连接（用于消息推送）
 *          - 根据连接查找用户信息（用于消息接收）
 *          - 线程安全的增删改查操作
 */
class Connection {
public:
    /**
     * @struct ClientInfo
     * @brief 客户端信息结构
     * @details 存储与WebSocket连接关联的用户ID和会话ID
     */
    struct ClientInfo {
        /**
         * @brief 构造函数
         * @param u 用户ID
         * @param s 会话ID
         */
        ClientInfo(const std::string &u, const std::string &s)
            : uid(u), ssid(s) {}
        std::string uid;  ///< 用户ID
        std::string ssid; ///< 会话ID
    };

public:
    using ptr = std::shared_ptr<Connection>;
    
    Connection() {}
    ~Connection() {}

    /**
     * @brief 插入新的连接映射
     * @param conn WebSocket连接指针
     * @param uid 用户ID
     * @param ssid 会话ID
     * @details 建立用户ID到连接、连接到客户端信息的双向映射
     */
    void insert(const server_t::connection_ptr &conn, const std::string &uid,
                const std::string &ssid) {
        std::unique_lock<std::mutex> lock(_mutex);
        _uid_connections.insert(std::make_pair(uid, conn));
        _conn_clients.insert(std::make_pair(conn, ClientInfo(uid, ssid)));
        LOG_DEBUG("WebSocket 已绑定用户 | session_id={} | user_id={} | conn={}",
                  ssid, uid, (void *)conn.get());
    }

    /**
     * @brief 根据用户ID查找WebSocket连接
     * @param uid 用户ID
     * @return WebSocket连接指针，若不存在则返回空指针
     * @details 用于向指定用户推送消息
     */
    server_t::connection_ptr connection(const std::string &uid) {
        std::unique_lock<std::mutex> lock(_mutex);
        auto it = _uid_connections.find(uid);
        if (it == _uid_connections.end()) {
            LOG_WARN("按 user_id 查找 WebSocket 连接不存在 | user_id={}", uid);
            return server_t::connection_ptr();
        }
        return it->second;
    }

    /**
     * @brief 根据连接查找客户端信息
     * @param conn WebSocket连接指针
     * @param[out] uid 输出用户ID
     * @param[out] ssid 输出会话ID
     * @return true=查找成功，false=连接不存在
     * @details 用于处理客户端消息时识别发送者身份
     */
    bool client(const server_t::connection_ptr &conn, std::string &uid,
                std::string &ssid) {
        std::unique_lock<std::mutex> lock(_mutex);
        auto it = _conn_clients.find(conn);
        if (it == _conn_clients.end()) {
            LOG_WARN("按连接句柄解析客户端信息失败 | conn={}", (void *)conn.get());
            return false;
        }
        uid = it->second.uid;
        ssid = it->second.ssid;
        LOG_DEBUG("已解析 WebSocket 对应的用户与会话 | user_id={} | session_id={}",
                  uid, ssid);
        return true;
    }

    /**
     * @brief 移除连接映射
     * @param conn WebSocket连接指针
     * @details 同时删除双向映射关系，用于连接断开时清理资源
     */
    void remove(const server_t::connection_ptr &conn) {
        std::unique_lock<std::mutex> lock(_mutex);
        auto it = _conn_clients.find(conn);
        if (it == _conn_clients.end()) {
            LOG_WARN("按连接句柄解析客户端信息失败 | conn={}", (void *)conn.get());
            return;
        }
        const std::string removed_uid = it->second.uid;
        _uid_connections.erase(removed_uid);
        _conn_clients.erase(it);
        LOG_DEBUG("已移除 WebSocket 连接映射 | user_id={}", removed_uid);
        return;
    }

private:
    std::mutex _mutex; ///< 保护映射表的互斥锁
    std::unordered_map<std::string, server_t::connection_ptr> _uid_connections; ///< 用户ID到连接的映射
    std::unordered_map<server_t::connection_ptr, ClientInfo> _conn_clients; ///< 连接到客户端信息的映射
};

} // namespace im_server