#pragma once
#include "chat_session_member.hxx"
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {

enum class ChatSessionType { SINGLE = 1, GROUP = 2 };

#pragma db object table("chat_session")
class ChatSession {
public:
    ChatSession() {}
    // 用户名--新增用户 -- 用户ID, 昵称，密码
    ChatSession(const std::string &ssid, const std::string &ssname,
                const ChatSessionType &sstype)
        : _chat_session_id(ssid), _chat_session_name(ssname),
          _chat_session_type(sstype) {}

    void chat_session_id(const std::string &val) { _chat_session_id = val; }
    std::string chat_session_id() { return _chat_session_id; }

    void chat_session_name(const std::string &val) { _chat_session_name = val; }
    std::string chat_session_name() { return _chat_session_name; }

    void chat_session_type(ChatSessionType &val) { _chat_session_type = val; }
    ChatSessionType chat_session_type() { return _chat_session_type; }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db type("varchar(64)") index unique
    std::string _chat_session_id;
#pragma db type("varchar(64)")
    std::string _chat_session_name;
#pragma db type("tinyint")
    ChatSessionType _chat_session_type;
};

#pragma db view object(ChatSession = css) object(                              \
    ChatSessionMember = csm1 : css::_chat_session_id == csm1::_session_id)     \
    object(ChatSessionMember =                                                 \
               csm2 : css::_chat_session_id == csm2::_session_id) query((?))
struct SingleChatSession {
#pragma db column(css::_chat_session_id)
    std::string chat_session_id;
#pragma db column(csm2::_user_id)
    std::string friend_id;
};

#pragma db view object(ChatSession = css)                                      \
    object(ChatSessionMember =                                                 \
               csm : css::_chat_session_id == csm::_session_id) query((?))
struct GroupChatSession {
#pragma db column(css::_chat_session_id)
    std::string chat_session_id;
#pragma db column(css::_chat_session_name)
    std::string chat_session_name;
};

} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx