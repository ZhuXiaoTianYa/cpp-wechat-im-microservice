#pragma once
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {
#pragma db object table("relation")
class Relation {
public:
    Relation() {}
    // 用户名--新增用户 -- 用户ID, 昵称，密码
    Relation(const std::string &uid, const std::string &pid)
        : _user_id(uid), _peer_id(pid) {}

    void user_id(const std::string &val) { _user_id = val; }
    std::string user_id() { return _user_id; }
    void peer_id(const std::string &val) { _peer_id = val; }
    std::string peer_id() { return _peer_id; }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db type("varchar(64)") index
    std::string _user_id;
#pragma db type("varchar(64)")
    std::string _peer_id;
};
} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx