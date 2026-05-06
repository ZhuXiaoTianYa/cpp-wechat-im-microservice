/**
 * @file message.hxx
 * @brief 消息数据模型
 * @details ODB持久化类，对应MySQL的message表，存储聊天消息
 * @author ZhuTian
 * @date 2026
 */

#pragma once
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/date_time/posix_time/ptime.hpp>
#include <odb/core.hxx>
#include <odb/forward.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {

/**
 * @class Message
 * @brief 消息实体类
 * @details 对应数据库message表，存储各类型消息（文本/图片/文件/语音）
 */
#pragma db object table("message")
class Message {
public:
    Message() {}
    
    /**
     * @brief 构造函数
     * @param message_id 消息ID
     * @param session_id 会话ID
     * @param user_id 发送者用户ID
     * @param message_type 消息类型（0=文本，1=图片，2=文件，3=语音）
     * @param create_time 创建时间
     */
    Message(const std::string &message_id, const std::string &session_id,
            const std::string &user_id, const unsigned char message_type,
            const boost::posix_time::ptime &create_time)
        : _message_id(message_id), _session_id(session_id), _user_id(user_id),
          _message_type(message_type), _create_time(create_time) {}

    void message_id(const std::string &val) { _message_id = val; }
    std::string message_id() { return _message_id; }

    void session_id(const std::string &val) { _session_id = val; }
    std::string session_id() { return _session_id; }
    
    void user_id(const std::string &val) { _user_id = val; }
    std::string user_id() { return _user_id; }
    
    void message_type(const unsigned char val) { _message_type = val; }
    unsigned char message_type() { return _message_type; }
    
    void create_time(const boost::posix_time::ptime &val) {
        _create_time = val;
    }
    boost::posix_time::ptime create_time() { return _create_time; }
    
    void file_id(const std::string &val) { _file_id = val; }
    std::string file_id() {
        if (!_file_id)
            return std::string();
        return *_file_id;
    }
    
    void file_name(const std::string &val) { _file_name = val; }
    std::string file_name() {
        if (!_file_name)
            return std::string();
        return *_file_name;
    }
    
    void content(const std::string &val) { _content = val; }
    std::string content() {
        if (!_content)
            return std::string();
        return *_content;
    }
    
    void file_size(const unsigned int &val) { _file_size = val; }
    unsigned int file_size() {
        if (!_file_size)
            return 0;
        return *_file_size;
    }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;                      ///< 数据库自增主键
#pragma db type("varchar(64)") index unique
    std::string _message_id;                ///< 消息ID（唯一索引）
#pragma db type("varchar(64)") index
    std::string _session_id;                ///< 会话ID（索引）
#pragma db type("varchar(64)")
    std::string _user_id;                   ///< 发送者用户ID
    unsigned char _message_type;            ///< 消息类型（0=文本，1=图片，2=文件，3=语音）
#pragma db type("TIMESTAMP")
    boost::posix_time::ptime _create_time;  ///< 创建时间
#pragma db type("varchar(64)")
    odb::nullable<std::string> _file_id;    ///< 文件ID（图片/文件/语音消息使用，可为空）
#pragma db type("varchar(128)")
    odb::nullable<std::string> _file_name;  ///< 文件名（文件消息使用，可为空）
    odb::nullable<std::string> _content;    ///< 文本内容（文本消息使用，可为空）
    odb::nullable<unsigned int> _file_size; ///< 文件大小（文件消息使用，可为空）
};

} // namespace im_server