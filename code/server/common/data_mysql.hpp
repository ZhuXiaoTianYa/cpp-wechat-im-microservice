#include "chat_session_member-odb.hxx"
#include "chat_session_member.hxx"
#include "logger.hpp"
#include "user-odb.hxx"
#include "user.hxx"
#include <gflags/gflags.h>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>
#include <sstream>
#include <string>
#include <vector>
namespace im_server {
class UserTable {
public:
  using ptr = std::shared_ptr<UserTable>;
  UserTable(const std::shared_ptr<odb::core::database> &db) : _db(db) {}
  bool insert(const std::shared_ptr<User> &user) {
    try {
      odb::transaction trans(_db->begin());
      _db->persist(*user);
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("新增用户失败 {}-{}", user->nickname(), e.what());
      return false;
    }
    return true;
  }

  bool update(const std::shared_ptr<User> &user) {
    try {
      odb::transaction trans(_db->begin());
      _db->update(*user);
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("更新用户失败 {}-{}", user->nickname(), e.what());
      return false;
    }
    return true;
  }
  std::shared_ptr<User> select_by_nickname(const std::string &nickname) {
    std::shared_ptr<User> res;
    try {
      odb::transaction trans(_db->begin());
      typedef odb::query<User> query;
      typedef odb::result<User> result;
      res.reset(_db->query_one<User>(query::nickname == nickname));
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("通过昵称查询用户失败 {}-{}", nickname, e.what());
    }
    return res;
  }
  std::shared_ptr<User> select_by_phone(const std::string &phone) {
    std::shared_ptr<User> res;
    try {
      odb::transaction trans(_db->begin());
      typedef odb::query<User> query;
      typedef odb::result<User> result;
      res.reset(_db->query_one<User>(query::phone == phone));
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("通过手机号查询用户失败 {}-{}", phone, e.what());
    }
    return res;
  }
  std::shared_ptr<User> select_by_id(const std::string &user_id) {
    std::shared_ptr<User> res;
    try {
      odb::transaction trans(_db->begin());
      typedef odb::query<User> query;
      typedef odb::result<User> result;
      res.reset(_db->query_one<User>(query::user_id == user_id));
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("通过用户ID查询用户失败 {}-{}", user_id, e.what());
    }
    return res;
  }
  std::vector<User>
  select_multi_users(const std::vector<std::string> &id_list) {
    if (id_list.empty()) {
      return std::vector<User>();
    }
    std::vector<User> res;
    try {
      odb::transaction trans(_db->begin());
      typedef odb::query<User> query;
      typedef odb::result<User> result;
      std::stringstream ss;
      ss << "user_id in(";
      for (const auto &id : id_list) {
        ss << "'" << id << "',";
      }
      std::string condition = ss.str();
      condition.pop_back();
      condition += ")";
      result r(_db->query<User>(condition));
      for (result::iterator i(r.begin()); i != r.end(); i++) {
        res.push_back(*i);
      }
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("通过用户ID批量查询用户失败 {}", e.what());
    }
    return res;
  }

private:
  std::shared_ptr<odb::core::database> _db;
};
// FLAGS_user, FLAGS_passwd, FLAGS_db, FLAGS_host, FLAGS_port, "",
// FLAGS_charset, 0, std::move(cpf)
class ODBFactory {
public:
  static std::shared_ptr<odb::core::database>
  create(const std::string &user, const std::string &passwd,
         const std::string &host, const std::string &db,
         const std::string &cset, const int &port, const int &conn_pool_count) {
    std::unique_ptr<odb::mysql::connection_pool_factory> cpf(
        new odb::mysql::connection_pool_factory(conn_pool_count, 0));
    auto res = std::make_shared<odb::mysql::database>(
        user, passwd, db, host, port, "", cset, 0, std::move(cpf));
    return res;
  }
};

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
      LOG_ERROR("新增单会话成员失败 {}-{}:{}", csm.session_id(), csm.user_id(),
                e.what());
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
      _db->erase_query<ChatSessionMember>(query::session_id ==
                                              csm.session_id() &&
                                          query::user_id == csm.user_id());
      trans.commit();
    } catch (std::exception &e) {
      LOG_ERROR("删除单会话成员失败 {}-{}:{}", csm.session_id(), csm.user_id(),
                e.what());
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