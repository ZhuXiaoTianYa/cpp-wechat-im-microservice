#include "friend_apply-odb.hxx"
#include "friend_apply.hxx"
#include "mysql.hpp"
#include <odb/query.hxx>
#include <vector>

namespace im_server {
class FriendApplyTable {
public:
    using ptr = std::shared_ptr<FriendApplyTable>;
    FriendApplyTable(const std::shared_ptr<odb::core::database> &db)
        : _db(db) {}
    bool insert(FriendApply &ev) {
        try {
            odb::transaction trans(_db->begin());
            _db->persist(ev);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("新增好友申请事件失败 {}-{}:{}", ev.user_id(),
                      ev.peer_id(), e.what());
            return false;
        }
        return true;
    }

    bool remove(const std::string &uid, const std::string &pid) {
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<FriendApply> query;
            typedef odb::result<FriendApply> result;
            _db->erase_query<FriendApply>(query::user_id == uid &&
                                          query::peer_id == pid);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("删除好友申请事件失败 {}-{}:{}", uid, pid, e.what());
            return false;
        }
        return true;
    }
    bool exists(const std::string &uid, const std::string &pid) {
        typedef odb::query<FriendApply> query;
        typedef odb::result<FriendApply> result;
        result r;
        bool flag = false;
        try {
            odb::transaction trans(_db->begin());

            r = _db->query<FriendApply>(query::user_id == uid &&
                                        query::peer_id == pid);
            flag = !r.empty();
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("获取好友申请事件失败 {}-{}:{}", uid, pid, e.what());
        }
        return flag;
    }
    std::vector<std::string> applyUsers(const std::string &uid) {
        std::vector<std::string> res;
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<FriendApply> query;
            typedef odb::result<FriendApply> result;
            result r(_db->query<FriendApply>(query::peer_id == uid));
            for (result::iterator it(r.begin()); it != r.end(); it++) {
                res.push_back(it->user_id());
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("查询用户-{}好友申请失败：{}", uid, e.what());
        }
        return res;
    }

private:
    std::shared_ptr<odb::core::database> _db;
};
} // namespace im_server