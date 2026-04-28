#include "../odb/message.hxx"
#include "../odb/user.hxx"
#include "icsearch.hpp"
#include <boost/date_time/posix_time/conversion.hpp>

namespace im_server {
class ESClientFactory {
public:
    static std::shared_ptr<elasticlient::Client>
    create(const std::vector<std::string> &host_list) {
        return std::make_shared<elasticlient::Client>(host_list);
    }
};

class ESUser {
public:
    using ptr = std::shared_ptr<ESUser>;
    ESUser(const std::shared_ptr<elasticlient::Client> &es_client)
        : _es_client(es_client) {}
    bool createIndex() {
        EsIndex index(_es_client, "user");
        bool ret = index.append(_uid_key, "keyword", "standard", true)
                       .append(_name_key)
                       .append(_phone_key, "keyword", "standard", true)
                       .append(_desc_key, "text", "standard", false)
                       .append(_avatar_key, "keyword", "standard", false)
                       .create();
        if (ret == false) {
            LOG_ERROR("用户信息索引创建失败");
            return false;
        }
        LOG_ERROR("用户信息索引创建成功");
        return true;
    }

    bool appendData(const std::string &uid, const std::string &phone,
                    const std::string &nickname, const std::string &description,
                    const std::string &avatar_id) {
        bool ret = EsInsert(_es_client, "user")
                       .append(_uid_key, uid)
                       .append(_phone_key, phone)
                       .append(_name_key, nickname)
                       .append(_desc_key, description)
                       .append(_avatar_key, avatar_id)
                       .insert(uid);
        if (ret == false) {
            LOG_ERROR("用户数据插入/更新失败");
            return false;
        } else {
            LOG_INFO("用户数据插入/更新成功");
            return true;
        }
    }

    std::vector<User> search(const std::string &key,
                             const std::vector<std::string> &uid_list) {
        std::vector<User> res;
        Json::Value json_user;
        json_user = EsSearch(_es_client, "user")
                        .append_should_match("user_id", key)
                        .append_should_match("nickname", key)
                        .append_should_match("phone", key)
                        .append_must_not_term("user_id", uid_list)
                        .search();
        if (json_user.isArray() == false) {
            LOG_INFO("查询结果为空或不是数组类型");
            return res;
        }
        int sz = json_user.size();
        LOG_DEBUG("检索结果条目数量：{}", sz);
        for (int i = 0; i < sz; i++) {
            User user;
            user.user_id(json_user[i]["_source"][_uid_key].asString());
            user.phone(json_user[i]["_source"][_phone_key].asString());
            user.description(json_user[i]["_source"][_desc_key].asString());
            user.nickname(json_user[i]["_source"][_name_key].asString());
            user.avatar_id(json_user[i]["_source"][_avatar_key].asString());
            res.push_back(user);
        }
        return res;
    }

private:
    const std::string _uid_key = "user_id";
    const std::string _desc_key = "description";
    const std::string _phone_key = "phone";
    const std::string _name_key = "nickname";
    const std::string _avatar_key = "avatar_id";
    std::shared_ptr<elasticlient::Client> _es_client;
};

class ESMessage {
public:
    using ptr = std::shared_ptr<ESMessage>;
    ESMessage(const std::shared_ptr<elasticlient::Client> &es_client)
        : _es_client(es_client) {}

    bool createIndex() {
        EsIndex index(_es_client, "message");
        bool ret =
            index.append(_message_id_key, "keyword", "standard", false)
                .append(_uid_key, "keyword", "standard", false)
                .append(_create_time_key, "long", "standard", false)
                .append(_chat_session_id_key, "keyword", "standard", false)
                .append(_content_key)
                .create();
        if (ret == false) {
            LOG_ERROR("消息信息索引创建失败");
            return false;
        }
        LOG_ERROR("消息信息索引创建成功");
        return true;
    }
    bool appendData(const std::string &user_id, const std::string &message_id,
                    const long &create_time, const std::string &chat_session_id,
                    const std::string &content) {
        bool ret = EsInsert(_es_client, "message")
                       .append(_uid_key, user_id)
                       .append(_create_time_key, create_time)
                       .append(_chat_session_id_key, chat_session_id)
                       .append(_content_key, content)
                       .append(_message_id_key, message_id)
                       .insert(message_id);
        if (ret == false) {
            LOG_ERROR("消息数据插入/更新失败");
            return false;
        } else {
            LOG_INFO("消息数据插入/更新成功");
            return true;
        }
    }

    bool remove(const std::string &mid) {
        bool ret = EsRemove(_es_client, "message").remove(mid);
        if (ret == false) {
            LOG_ERROR("消息数据删除失败");
            return false;
        } else {
            LOG_INFO("消息数据删除成功");
            return true;
        }
    }
    std::vector<Message> search(const std::string &key,
                                const std::string &ssid) {
        std::vector<Message> res;
        Json::Value json_message;
        json_message = EsSearch(_es_client, "message")
                           .append_must_match(_content_key, key)
                           .append_must_term("chat_session_id.keyword", ssid)
                           .search();
        if (json_message.isArray() == false) {
            LOG_INFO("查询结果为空或不是数组类型");
            return res;
        }
        int sz = json_message.size();
        LOG_DEBUG("检索结果条目数量：{}", sz);
        for (int i = 0; i < sz; i++) {
            Message message;
            message.user_id(json_message[i]["_source"][_uid_key].asString());
            message.message_id(
                json_message[i]["_source"][_message_id_key].asString());
            message.create_time(boost::posix_time::from_time_t(
                json_message[i]["_source"][_create_time_key].asInt64()));
            message.session_id(
                json_message[i]["_source"][_chat_session_id_key].asString());
            message.content(
                json_message[i]["_source"][_content_key].asString());
            res.push_back(message);
        }
        return res;
    }

private:
    const std::string _uid_key = "user_id";
    const std::string _message_id_key = "message_id";
    const std::string _create_time_key = "create_time";
    const std::string _chat_session_id_key = "chat_session_id";
    const std::string _content_key = "content";
    std::shared_ptr<elasticlient::Client> _es_client;
};
} // namespace im_server