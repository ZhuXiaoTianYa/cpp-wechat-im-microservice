#include "icsearch.hpp"
#include "../odb/user.hxx"

namespace im_server
{
    class ESClientFactory
    {
    public:
        static std::shared_ptr<elasticlient::Client> create(const std::vector<std::string> &host_list)
        {
            return std::make_shared<elasticlient::Client>(host_list);
        }
    };

    class ESUser
    {
    public:
        using ptr = std::shared_ptr<ESUser>;
        ESUser(const std::shared_ptr<elasticlient::Client> &es_client)
            : _es_client(es_client)
        {
        }
        bool createIndex()
        {
            EsIndex index(_es_client, "user");
            bool ret = index.append(_uid_key, "keyword", "standard", true).append(_name_key).append(_phone_key, "keyword", "standard", true).append(_desc_key, "text", "standard", false).append(_avatar_key, "keyword", "standard", false).create();
            if (ret == false)
            {
                LOG_ERROR("用户信息索引创建失败");
                return false;
            }
            LOG_ERROR("用户信息索引创建成功");
            return true;
        }

        bool appendData(const std::string &uid, const std::string &phone, const std::string &nickname, const std::string &description, const std::string &avatar_id)
        {
            bool ret = EsInsert(_es_client, "user").append(_uid_key, uid).append(_phone_key, phone).append(_name_key, nickname).append(_desc_key, description).append(_avatar_key, avatar_id).insert(uid);
            if (ret == false)
            {
                LOG_ERROR("用户数据插入/更新失败");
                return false;
            }
            else
            {
                LOG_INFO("用户数据插入/更新成功");
                return true;
            }
        }

        std::vector<User> search(const std::string &key, const std::vector<std::string> &uid_list)
        {
            std::vector<User> res;
            Json::Value json_user;
            json_user = EsSearch(_es_client, "user").append_should_match("user_id.keyword", key).append_should_match("nickname", key).append_should_match("phone.keyword", key).append_must_not_term("user_id.keyword", uid_list).search();
            if (json_user.isArray() == false)
            {
                LOG_INFO("查询结果为空或不是数组类型");
                return res;
            }
            int sz = json_user.size();
            LOG_DEBUG("检索结果条目数量：{}", sz);
            for (int i = 0; i < sz; i++)
            {
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
}