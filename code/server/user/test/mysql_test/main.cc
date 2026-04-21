#include <odb/database.hxx>
#include <odb/mysql/database.hxx>
#include <gflags/gflags.h>
#include "../../../odb/user.hxx"
#include "../../../common/data_mysql.hpp"
#include "user-odb.hxx"

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

void insert(std::shared_ptr<im_server::UserTable> user_tb)
{
    std::shared_ptr<im_server::User> user1 = std::make_shared<im_server::User>("uid1", "昵称1", "zhutian2004");
    std::shared_ptr<im_server::User> user2 = std::make_shared<im_server::User>("uid2", "13515613515");
    user_tb->insert(user1);
    user_tb->insert(user2);
}

void update_by_id(std::shared_ptr<im_server::UserTable> user_tb)
{
    std::shared_ptr<im_server::User> user = user_tb->select_by_id("uid1");
    user->description("qwq");
    user_tb->update(user);
}

void update_by_phone(std::shared_ptr<im_server::UserTable> user_tb)
{
    std::shared_ptr<im_server::User> user = user_tb->select_by_phone("13515613515");
    user->password("1234564879");
    user_tb->update(user);
}

void update_by_nickname(std::shared_ptr<im_server::UserTable> user_tb)
{
    std::shared_ptr<im_server::User> user = user_tb->select_by_nickname("uid2");
    user->nickname("name___");
    user_tb->update(user);
}

void select_users(std::shared_ptr<im_server::UserTable> user_tb)
{
    std::vector<std::string> users_id = {"uid1", "uid2"};
    std::vector<im_server::User> ret = user_tb->select_multi_users(users_id);
    for (auto &user : ret)
    {
        std::cout << user.nickname() << std::endl;
    }
}

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    im_server::init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);

    auto db = im_server::ODBFactory::create("root", "zhutian2004", "127.0.0.1", "zhutian_im", "utf8", 0, 1);
    auto user_tb = std::make_shared<im_server::UserTable>(db);

    // insert(user_tb);
    // update_by_id(user_tb);
    // update_by_phone(user_tb);
    // update_by_nickname(user_tb);
    select_users(user_tb);
    return 0;
}

// odb -d mysql  --generate-query --generate-schema  ../../../odb/user.hxx