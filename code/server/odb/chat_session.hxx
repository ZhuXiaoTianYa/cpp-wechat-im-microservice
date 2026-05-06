/**
 * @file chat_session.hxx
 * @brief 聊天会话数据模型
 * @details ODB持久化类，对应MySQL的chat_session表，包含单聊和群聊会话
 * @author ZhuTian
 * @date 2026
 */

#pragma once
#include "chat_session_member.hxx"
#include <odb/core.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {

/**
 * @enum ChatSessionType
 * @brief 会话类型枚举
 */
enum class ChatSessionType { 
    SINGLE = 1, ///< 单聊会话
    GROUP = 2   ///< 群聊会话
};

/**
 * @class ChatSession
 * @brief 聊天会话实体类
 * @details 对应数据库chat_session表，存储会话基本信息
 */
#pragma db object table("chat_session")
class ChatSession {
public:
    ChatSession() {}
    
    /**
     * @brief 构造函数
     * @param ssid 会话ID
     * @param ssname 会话名称
     * @param sstype 会话类型（单聊/群聊）
     */
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
    unsigned long _id;                      ///< 数据库自增主键
#pragma db type("varchar(64)") index unique
    std::string _chat_session_id;           ///< 会话ID（唯一索引）
#pragma db type("varchar(64)")
    std::string _chat_session_name;         ///< 会话名称
#pragma db type("tinyint")
    ChatSessionType _chat_session_type;     ///< 会话类型（1=单聊，2=群聊）
};

/**
 * @struct SingleChatSession
 * @brief 单聊会话视图
 * @details ODB视图，用于查询单聊会话及对方用户ID
 */
#pragma db view object(ChatSession = css) object(                              \
    ChatSessionMember = csm1 : css::_chat_session_id == csm1::_session_id)     \
    object(ChatSessionMember =                                                 \
               csm2 : css::_chat_session_id == csm2::_session_id) query((?))
struct SingleChatSession {
#pragma db column(css::_chat_session_id)
    std::string chat_session_id; ///< 会话ID
#pragma db column(csm2::_user_id)
    std::string friend_id;        ///< 对方用户ID
};

/**
 * @struct GroupChatSession
 * @brief 群聊会话视图
 * @details ODB视图，用于查询群聊会话信息
 */
#pragma db view object(ChatSession = css)                                      \
    object(ChatSessionMember =                                                 \
               csm : css::_chat_session_id == csm::_session_id) query((?))
struct GroupChatSession {
#pragma db column(css::_chat_session_id)
    std::string chat_session_id;   ///< 会话ID
#pragma db column(css::_chat_session_name)
    std::string chat_session_name; ///< 会话名称
};

} // namespace im_server

// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time ../../../../odb/user.hxx