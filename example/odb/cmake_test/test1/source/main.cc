#include <string>
#include <memory>
#include <cstdlib>
#include <iostream>
#include <odb/database.hxx>
#include <odb/mysql/database.hxx>
#include <gflags/gflags.h>
#include "student.hxx"
#include "student-odb.hxx"

DEFINE_string(host, "127.0.0.1", "设置mysql的IP地址,格式:127.0.0.1");
DEFINE_string(user, "zhutian", "设置mysql的用户名,格式:root");
DEFINE_string(passwd, "zhutian2004", "设置mysql的密码,格式:123456");
DEFINE_string(db, "TestDB", "设置mysql的数据库,格式:TestDB");
DEFINE_string(charset, "utf8", "设置mysql的字符集,格式:utf8");
DEFINE_int32(port, 0, "设置mysql的端口,格式:9090");
DEFINE_int32(max_pool, 3, "设置mysql连接池的最大数量,如:3");

void insert_classes(odb::mysql::database &db)
{
    try
    {
        odb::transaction trans(db.begin());
        Classes c1("一年级1班");
        Classes c2("一年级2班");
        db.persist(c1);
        db.persist(c2);
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "插入数据出错：" << e.what() << std::endl;
    }
}

void insert_students(odb::mysql::database &db)
{
    try
    {
        odb::transaction trans(db.begin());
        Student s1(1, "张三", 16, 1);
        Student s2(2, "李四", 15, 1);
        Student s3(3, "王五", 14, 1);
        Student s4(4, "赵六", 13, 2);
        Student s5(5, "刘七", 18, 2);
        db.persist(s1);
        db.persist(s2);
        db.persist(s3);
        db.persist(s4);
        db.persist(s5);
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "插入数据出错：" << e.what() << std::endl;
    }
}

void update_students(odb::mysql::database &db, Student &stu)
{
    try
    {
        odb::transaction trans(db.begin());
        db.update(stu);
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "更新数据出错：" << e.what() << std::endl;
    }
}

Student select_students(odb::mysql::database &db)
{
    Student stu;
    try
    {
        odb::transaction trans(db.begin());
        typedef odb::query<Student> squery;
        typedef odb::result<Student> sresult;
        sresult result(db.query<Student>(squery::name == "张三"));
        if (result.size() != 1)
        {
            std::cout << "数据量不对！\n";
            return Student();
        }
        stu = *result.begin();
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "更新数据出错：" << e.what() << std::endl;
    }
    return stu;
}

void remove_students(odb::mysql::database &db)
{
    try
    {
        odb::transaction trans(db.begin());
        typedef odb::query<Student> squery;
        db.erase_query<Student>(squery::classes_id == 2);
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "删除数据出错：" << e.what() << std::endl;
    }
}
void classes_students(odb::mysql::database &db)
{
    try
    {
        odb::transaction trans(db.begin());
        typedef odb::query<classes_student> cquery;
        typedef odb::result<classes_student> csresult;
        csresult result(db.query<classes_student>(cquery::classes::id == 2));
        for (auto it = result.begin(); it != result.end(); it++)
        {
            std::cout << it->_id << std::endl;
            std::cout << it->_sn << std::endl;
            std::cout << it->_name << std::endl;
            std::cout << it->_age << std::endl;
            std::cout << it->_classes_name << std::endl;
        }
        trans.commit();
    }
    catch (std::exception &e)
    {
        std::cout << "视图数据出错：" << e.what() << std::endl;
    }
}

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    std::unique_ptr<odb::mysql::connection_pool_factory> cpf(new odb::mysql::connection_pool_factory(FLAGS_max_pool, 0));
    odb::mysql::database db(FLAGS_user, FLAGS_passwd, FLAGS_db, FLAGS_host, FLAGS_port, "", FLAGS_charset, 0, std::move(cpf));

    // insert_classes(db);
    // insert_students(db);
    // Student stu = select_students(db);
    // std::cout << stu.sn() << std::endl;
    // std::cout << stu.name() << std::endl;
    // if (stu.age())
    //     std::cout << *stu.age() << std::endl;
    // std::cout << stu.classes_id() << std::endl;
    // stu.age(18);
    // update_students(db, stu);
    // std::cout << "-------更新-------" << std::endl;
    // stu = select_students(db);
    // std::cout << stu.sn() << std::endl;
    // std::cout << stu.name() << std::endl;
    // if (stu.age())
    //     std::cout << *stu.age() << std::endl;
    // std::cout << stu.classes_id() << std::endl;

    // remove_students(db);

    classes_students(db);
}

// 如果用到了 boost 库中的接口，需要链接库： -lodb-boost
// c++ -o mysql_test mysql_test.cpp person-odb.cxx -lodb-mysql -lodb -lodb-boost
// odb -d mysql --std c++11  --generate-query --generate-schema --profile boost/date-time student.hxx