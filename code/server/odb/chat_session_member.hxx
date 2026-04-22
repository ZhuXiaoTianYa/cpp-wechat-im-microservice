#pragma once
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {
#pragma db object table("chat_session_member")
class ChatSessionMember {
public:
  ChatSessionMember() {}
  ChatSessionMember(const std::string &session_id, const std::string &user_id)
      : _session_id(session_id), _user_id(user_id) {}

  void session_id(const std::string &ssid) { _session_id = ssid; }
  std::string session_id() { return _session_id; }

  void user_id(const std::string &uid) { _user_id = uid; }
  std::string user_id() { return _user_id; }

private:
  friend class odb::access;
#pragma db id auto
  unsigned long _id;
#pragma db type("varchar(64)") index
  std::string _session_id;
#pragma db type("varchar(64)")
  std::string _user_id;
};
} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// c
//