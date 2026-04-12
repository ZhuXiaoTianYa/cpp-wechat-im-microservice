#pragma once
#include <string>
#include <cstddef>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <odb/core.hxx>
#include <odb/nullable.hxx>

#pragma db object
class Student
{
public:
    Student() {}
    Student(unsigned long sn, const std::string &name, unsigned long age, unsigned long cid)
        : _sn(sn), _name(name), _age(age), _classes_id(cid)
    {
    }

    void sn(unsigned long num)
    {
        _sn = num;
    }
    unsigned long sn()
    {
        return _sn;
    }

    void name(const std::string &name)
    {
        _name = name;
    }
    std::string name()
    {
        return _name;
    }

    void age(unsigned long num)
    {
        _age = num;
    }
    odb::nullable<unsigned short> age()
    {
        return _age;
    }

    void classes_id(unsigned long num)
    {
        _classes_id = num;
    }
    unsigned long classes_id()
    {
        return _classes_id;
    }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db unique
    unsigned long _sn;
    std::string _name;
    odb::nullable<unsigned short> _age;
#pragma db index
    unsigned long _classes_id;
};

#pragma db object
class Classes
{
public:
    Classes() {}
    Classes(const std::string &name)
        : _name(name)
    {
    }

    void name(const std::string &name)
    {
        _name = name;
    }
    std::string name()
    {
        return _name;
    }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
    std::string _name;
};

#pragma db view object(Student) object(Classes = classes : Student::_classes_id == classes::_id) query((?))
struct classes_student
{
#pragma db column(Student::_id)
    unsigned long _id;
#pragma db column(Student::_sn)
    unsigned long _sn;
#pragma db column(Student::_name)
    std::string _name;
#pragma db column(Student::_age)
    odb::nullable<unsigned short> _age;
#pragma db column(classes::_name)
    std::string _classes_name;
};

#pragma db view query("select name from Student " + (?))
struct all_name
{
    std::string _name;
};