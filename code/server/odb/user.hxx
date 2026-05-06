/**
 * @file user.hxx
 * @brief 用户数据模型
 * @details ODB持久化类，对应MySQL的user表
 * @author ZhuTian
 * @date 2026
 */

#pragma once
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {

/**
 * @class User
 * @brief 用户实体类
 * @details 对应数据库user表，存储用户基本信息
 */
#pragma db object table("user")
class User {
public:
    User() {}
    
    /**
     * @brief 用户名注册构造函数
     * @param uid 用户ID
     * @param nickname 昵称
     * @param password 密码
     */
    User(const std::string &uid, const std::string &nickname,
         const std::string &password)
        : _user_id(uid), _nickname(nickname), _password(password) {}
    
    /**
     * @brief 手机号注册构造函数
     * @param uid 用户ID
     * @param phone 手机号
     * @details 昵称默认设置为用户ID
     */
    User(const std::string &uid, const std::string &phone)
        : _user_id(uid), _nickname(uid), _phone(phone) {}

    void user_id(const std::string &val) { _user_id = val; }
    std::string user_id() { return _user_id; }

    std::string nickname() {
        if (_nickname)
            return *_nickname;
        return std::string();
    }
    void nickname(const std::string &val) { _nickname = val; }

    std::string description() {
        if (!_description)
            return std::string();
        return *_description;
    }
    void description(const std::string &val) { _description = val; }

    std::string password() {
        if (!_password)
            return std::string();
        return *_password;
    }
    void password(const std::string &val) { _password = val; }

    std::string phone() {
        if (!_phone)
            return std::string();
        return *_phone;
    }
    void phone(const std::string &val) { _phone = val; }

    std::string avatar_id() {
        if (!_avatar_id)
            return std::string();
        return *_avatar_id;
    }
    void avatar_id(const std::string &val) { _avatar_id = val; }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;                       ///< 数据库自增主键
#pragma db type("varchar(64)") index unique
    std::string _user_id;                    ///< 用户ID（唯一索引）
#pragma db type("varchar(64)") index unique
    odb::nullable<std::string> _nickname;    ///< 用户昵称（唯一索引，可为空）
    odb::nullable<std::string> _description; ///< 用户签名/个人描述（可为空）
#pragma db type("varchar(64)")
    odb::nullable<std::string> _password;    ///< 用户密码（可为空，手机号注册时为空）
#pragma db type("varchar(64)") index unique
    odb::nullable<std::string> _phone;       ///< 用户手机号（唯一索引，可为空）
#pragma db type("varchar(64)")
    odb::nullable<std::string> _avatar_id;   ///< 用户头像文件ID（可为空）
};

} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx