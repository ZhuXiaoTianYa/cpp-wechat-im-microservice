#pragma once
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {
#pragma db object table("chat_session")
class ChatSession {
public:
    ChatSession() {}
    // 用户名--新增用户 -- 用户ID, 昵称，密码
    ChatSession(const std::string &ssid, const std::string &ssname,
                unsigned char sstype)
        : _chat_session_id(ssid), _chat_session_name(ssname),
          _chat_session_type(sstype) {}

    void chat_session_id(const std::string &val) { _chat_session_id = val; }
    std::string chat_session_id() { return _chat_session_id; }

    void chat_session_name(const std::string &val) { _chat_session_name = val; }
    std::string chat_session_name() { return _chat_session_name; }

    void chat_session_type(const unsigned char &val) {
        _chat_session_type = val;
    }
    unsigned char chat_session_type() { return _chat_session_type; }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db type("varchar(64)") index unique
    std::string _chat_session_id;
#pragma db type("varchar(64)")
    std::string _chat_session_name;
#pragma db type("tinyint")
    unsigned char _chat_session_type;
};
} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx