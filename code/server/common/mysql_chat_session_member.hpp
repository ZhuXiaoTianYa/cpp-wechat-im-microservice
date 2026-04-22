#pragma once
#include "chat_session_member-odb.hxx"
#include "chat_session_member.hxx"
#include "mysql.hpp"
namespace im_server {
class ChatSessionMemberTable {
public:
    using ptr = std::shared_ptr<ChatSessionMemberTable>;
    ChatSessionMemberTable(const std::shared_ptr<odb::core::database> &db)
        : _db(db) {}

    bool append(ChatSessionMember &csm) {
        try {
            odb::transaction trans(_db->begin());
            _db->persist(csm);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("新增单会话成员失败 {}-{}:{}", csm.session_id(),
                      csm.user_id(), e.what());
            return false;
        }
        return true;
    }
    bool append(std::vector<ChatSessionMember> &csm_lists) {
        try {
            odb::transaction trans(_db->begin());
            for (auto &csm : csm_lists) {
                _db->persist(csm);
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("新增多会话成员失败 {}-{}:{}", csm_lists[0].session_id(),
                      csm_lists.size(), e.what());
            return false;
        }
        return true;
    }

    bool remove(ChatSessionMember &csm) {
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<ChatSessionMember> query;
            typedef odb::result<ChatSessionMember> result;
            _db->erase_query<ChatSessionMember>(
                query::session_id == csm.session_id() &&
                query::user_id == csm.user_id());
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("删除单会话成员失败 {}-{}:{}", csm.session_id(),
                      csm.user_id(), e.what());
            return false;
        }
        return true;
    }

    bool remove(const std::string &ssid) {
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<ChatSessionMember> query;
            typedef odb::result<ChatSessionMember> result;
            _db->erase_query<ChatSessionMember>(query::session_id == ssid);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("删除会话所有成员失败 {}:{}", ssid, e.what());
            return false;
        }
        return true;
    }

    std::vector<std::string> members(const std::string &ssid) {
        std::vector<std::string> res;
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<ChatSessionMember> query;
            typedef odb::result<ChatSessionMember> result;
            result r(_db->query<ChatSessionMember>(query::session_id == ssid));
            for (result::iterator it(r.begin()); it != r.end(); it++) {
                res.push_back(it->user_id());
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("获取会话成员失败 {}:{}", ssid, e.what());
            return res;
        }
        return res;
    }

private:
    std::shared_ptr<odb::core::database> _db;
};
} // namespace im_server