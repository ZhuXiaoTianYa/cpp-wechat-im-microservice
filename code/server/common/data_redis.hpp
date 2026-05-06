/**
 * @file data_redis.hpp
 * @brief Redis数据访问封装
 * @details 提供会话管理、在线状态、验证码存储等Redis操作的封装类
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#include <sw/redis++/redis.h>
#include <iostream>

namespace im_server
{
    /**
     * @class Session
     * @brief 会话管理类
     * @details 封装Redis操作，管理session_id到user_id的映射关系
     */
    class Session
    {
    public:
        using ptr = std::shared_ptr<Session>;
        
        /**
         * @brief 构造函数
         * @param redis_client Redis客户端实例
         */
        Session(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        
        /**
         * @brief 添加会话映射
         * @param ssid 会话ID
         * @param uid 用户ID
         * @details 将session_id映射到user_id，用于身份验证
         */
        void append(const std::string &ssid, const std::string &uid)
        {
            _redis_client->set(ssid, uid);
        }
        
        /**
         * @brief 删除会话映射
         * @param ssid 会话ID
         * @details 用户登出时删除会话
         */
        void remove(const std::string &ssid)
        {
            _redis_client->del(ssid);
        }
        
        /**
         * @brief 根据会话ID获取用户ID
         * @param ssid 会话ID
         * @return 用户ID（可能为空）
         */
        sw::redis::OptionalString uid(const std::string &ssid)
        {
            return _redis_client->get(ssid);
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client; ///< Redis客户端
    };
    
    /**
     * @class Status
     * @brief 在线状态管理类
     * @details 封装Redis操作，管理用户在线状态
     */
    class Status
    {
    public:
        using ptr = std::shared_ptr<Status>;
        
        /**
         * @brief 构造函数
         * @param redis_client Redis客户端实例
         */
        Status(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        
        /**
         * @brief 设置用户在线状态
         * @param uid 用户ID
         * @details 在Redis中标记用户为在线
         */
        void append(const std::string &uid)
        {
            _redis_client->set(uid, "");
        }
        
        /**
         * @brief 删除用户在线状态
         * @param uid 用户ID
         * @details 用户下线时删除在线标记
         */
        void remove(const std::string &uid)
        {
            _redis_client->del(uid);
        }
        
        /**
         * @brief 检查用户是否在线
         * @param uid 用户ID
         * @return true=在线，false=离线
         */
        bool exists(const std::string &uid)
        {
            auto res = _redis_client->get(uid);
            if (res)
                return true;
            return false;
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client; ///< Redis客户端
    };
    
    /**
     * @class Code
     * @brief 验证码管理类
     * @details 封装Redis操作，管理短信验证码的存储和验证（带TTL）
     */
    class Code
    {
    public:
        using ptr = std::shared_ptr<Code>;
        
        /**
         * @brief 构造函数
         * @param redis_client Redis客户端实例
         */
        Code(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        
        /**
         * @brief 存储验证码
         * @param cid 验证码ID（通常为手机号）
         * @param code 验证码内容
         * @param timeout 过期时间（默认60秒）
         * @details 验证码带TTL，过期自动删除
         */
        void append(const std::string &cid, const std::string &code, const std::chrono::milliseconds &timeout = std::chrono::milliseconds(60000))
        {
            _redis_client->set(cid, code, std::chrono::milliseconds(timeout));
        }
        
        /**
         * @brief 删除验证码
         * @param cid 验证码ID
         * @details 验证成功后删除验证码
         */
        void remove(const std::string &cid)
        {
            _redis_client->del(cid);
        }
        
        /**
         * @brief 获取验证码
         * @param cid 验证码ID
         * @return 验证码内容（可能为空）
         */
        sw::redis::OptionalString code(const std::string &cid)
        {
            return _redis_client->get(cid);
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client; ///< Redis客户端
    };

    /**
     * @class RedisClientFactory
     * @brief Redis客户端工厂类
     * @details 创建和配置Redis客户端实例
     */
    class RedisClientFactory
    {
    public:
        /**
         * @brief 创建Redis客户端
         * @param host Redis服务器地址
         * @param port Redis端口
         * @param db 数据库编号
         * @param keep_alive 是否保持连接
         * @return Redis客户端智能指针
         */
        static std::shared_ptr<sw::redis::Redis> create(const std::string &host, const int &port, const int &db, const bool &keep_alive)
        {
            sw::redis::ConnectionOptions opts;
            opts.host = host;
            opts.keep_alive = keep_alive;
            opts.port = port;
            opts.db = db;
            return std::make_shared<sw::redis::Redis>(opts);
        }
    };
}