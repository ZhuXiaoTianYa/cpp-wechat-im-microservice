#include "mysql.hpp"
#include "relation-odb.hxx"
#include "relation.hxx"
#include <odb/query.hxx>
#include <vector>

namespace im_server {
class RelationTable {
public:
    using ptr = std::shared_ptr<RelationTable>;
    RelationTable(const std::shared_ptr<odb::core::database> &db) : _db(db) {}
    bool insert(const std::string &uid, const std::string &pid) {
        try {
            odb::transaction trans(_db->begin());
            Relation r1(uid, pid);
            Relation r2(pid, uid);
            _db->persist(r1);
            _db->persist(r2);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("新增好友关系信息失败 {}-{}:{}", uid, pid, e.what());
            return false;
        }
        return true;
    }

    bool remove(const std::string &uid, const std::string &pid) {
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<Relation> query;
            typedef odb::result<Relation> result;
            _db->erase_query<Relation>(query::user_id == uid &&
                                       query::peer_id == pid);
            _db->erase_query<Relation>(query::user_id == pid &&
                                       query::peer_id == uid);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("删除好友关系信息失败 {}-{}:{}", uid, pid, e.what());
            return false;
        }
        return true;
    }

    bool exists(const std::string &uid, const std::string &pid) {
        typedef odb::query<Relation> query;
        typedef odb::result<Relation> result;
        result r;
        bool flag = false;
        try {
            odb::transaction trans(_db->begin());

            r = _db->query<Relation>(query::user_id == uid &&
                                     query::peer_id == pid);
            flag = !r.empty();
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("获取用户好友关系失败 {}-{}:{}", uid, pid, e.what());
        }
        return flag;
    }
    std::vector<std::string> friends(const std::string &uid) {
        std::vector<std::string> res;
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<Relation> query;
            typedef odb::result<Relation> result;
            result r(_db->query<Relation>(query::user_id == uid));
            for (result::iterator it(r.begin()); it != r.end(); it++) {
                res.push_back(it->peer_id());
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("查询用户-{}所有好友ID失败：{}", uid, e.what());
        }
        return res;
    }

private:
    std::shared_ptr<odb::core::database> _db;
};
} // namespace im_server