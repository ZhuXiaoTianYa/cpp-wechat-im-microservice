#include "message-odb.hxx"
#include "message.hxx"
#include "mysql.hpp"
#include <boost/date_time/posix_time/ptime.hpp>
#include <boost/date_time/posix_time/time_formatters.hpp>
#include <odb/query.hxx>
#include <sstream>
#include <vector>

namespace im_server {
class MessageTable {
public:
    using ptr = std::shared_ptr<MessageTable>;
    MessageTable(const std::shared_ptr<odb::core::database> &db) : _db(db) {}
    bool insert(Message &msg) {
        try {
            odb::transaction trans(_db->begin());
            _db->persist(msg);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("新增消息失败 {}-{}", msg.message_id(), e.what());
            return false;
        }
        return true;
    }

    bool remove(const std::string &ssid) {
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<Message> query;
            typedef odb::result<Message> result;
            _db->erase_query<Message>(query::session_id == ssid);
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("删除会话所有消息失败 {}-{}", ssid, e.what());
            return false;
        }
        return true;
    }

    std::vector<Message> recent(const std::string &ssid, const int count) {
        std::vector<Message> res;
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<Message> query;
            typedef odb::result<Message> result;
            std::stringstream cond;
            cond << "session_id='" << ssid
                 << "' order by create_time desc limit " << count;
            result r(_db->query<Message>(cond.str()));
            for (result::iterator it(r.begin()); it != r.end(); it++) {
                res.push_back(*it);
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("获取最近消息失败 {}-{}-{}", ssid, count, e.what());
        }
        return res;
    }
    std::vector<Message> range(const std::string &ssid,
                               const boost::posix_time::ptime &stime,
                               const boost::posix_time::ptime &etime) {
        std::vector<Message> res;
        try {
            odb::transaction trans(_db->begin());
            typedef odb::query<Message> query;
            typedef odb::result<Message> result;
            result r(_db->query<Message>(query::session_id == ssid &&
                                         query::create_time >= stime &&
                                         query::create_time <= etime));
            for (result::iterator it(r.begin()); it != r.end(); it++) {
                res.push_back(*it);
            }
            trans.commit();
        } catch (std::exception &e) {
            LOG_ERROR("查询区间消息失败 {}-{}:{}-{}", ssid,
                      boost::posix_time::to_simple_string(stime),
                      boost::posix_time::to_simple_string(etime), e.what());
        }
        return res;
    }

private:
    std::shared_ptr<odb::core::database> _db;
};
} // namespace im_server