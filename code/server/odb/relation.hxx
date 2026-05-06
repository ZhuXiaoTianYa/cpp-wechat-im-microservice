/**
 * @file relation.hxx
 * @brief 好友关系数据模型
 * @details ODB持久化类，对应MySQL的relation表，存储用户间的好友关系
 * @author ZhuTian
 * @date 2026
 */

#pragma once
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {

/**
 * @class Relation
 * @brief 好友关系实体类
 * @details 对应数据库relation表，存储双向好友关系
 */
#pragma db object table("relation")
class Relation {
public:
    Relation() {}
    
    /**
     * @brief 构造函数
     * @param uid 用户ID
     * @param pid 好友ID
     */
    Relation(const std::string &uid, const std::string &pid)
        : _user_id(uid), _peer_id(pid) {}

    void user_id(const std::string &val) { _user_id = val; }
    std::string user_id() { return _user_id; }
    
    void peer_id(const std::string &val) { _peer_id = val; }
    std::string peer_id() { return _peer_id; }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;           ///< 数据库自增主键
#pragma db type("varchar(64)") index
    std::string _user_id;        ///< 用户ID（索引）
#pragma db type("varchar(64)")
    std::string _peer_id;        ///< 好友ID
};

} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx