#include "../../../common/data_mysql.hpp"
#include "../../../odb/chat_session_member.hxx"
#include "chat_session_member-odb.hxx"
#include <gflags/gflags.h>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>
#include <vector>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

void test_append(std::shared_ptr<im_server::ChatSessionMemberTable> csm_tb) {
  im_server::ChatSessionMember csm1("会话ID1", "用户ID1");
  im_server::ChatSessionMember csm2("会话ID1", "用户ID2");
  im_server::ChatSessionMember csm3("会话ID2", "用户ID3");
  csm_tb->append(csm1);
  csm_tb->append(csm2);
  csm_tb->append(csm3);
}

void test_append_list(
    std::shared_ptr<im_server::ChatSessionMemberTable> csm_tb) {
  im_server::ChatSessionMember csm1("会话ID3", "用户ID1");
  im_server::ChatSessionMember csm2("会话ID3", "用户ID2");
  im_server::ChatSessionMember csm3("会话ID3", "用户ID3");
  std::vector<im_server::ChatSessionMember> csm_list = {csm1, csm2, csm3};
  csm_tb->append(csm_list);
}

void test_remove(std::shared_ptr<im_server::ChatSessionMemberTable> csm_tb) {
  im_server::ChatSessionMember csm3("会话ID2", "用户ID3");
  csm_tb->remove(csm3);
}

void test_members(std::shared_ptr<im_server::ChatSessionMemberTable> csm_tb) {
  auto members = csm_tb->members("会话ID1");
  for (auto &id : members) {
    std::cout << id << std::endl;
  }
}

void test_remove_all(
    std::shared_ptr<im_server::ChatSessionMemberTable> csm_tb) {
  auto members = csm_tb->remove("会话ID3");
}

int main(int argc, char *argv[]) {
  gflags::ParseCommandLineFlags(&argc, &argv, true);
  im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

  auto db = im_server::ODBFactory::create("root", "zhutian2004", "127.0.0.1",
                                          "zhutian_im", "utf8", 0, 1);
  auto csm_tb = std::make_shared<im_server::ChatSessionMemberTable>(db);
  //   test_append(csm_tb);
  //   test_append_list(csm_tb);
  //   test_remove(csm_tb);
  //   test_members(csm_tb);
  test_remove_all(csm_tb);
  return 0;
}

// odb -d mysql  --generate-query --generate-schema  ../../../odb/user.hxx