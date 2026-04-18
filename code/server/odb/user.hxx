#pragma once
#include <string>
#include <cstddef>
#include <odb/core.hxx>
#include <odb/nullable.hxx>

#pragma db object
class User
{
public:
    User(const std::string &uid, const std::string &nickname, const std::string &password)
        : _user_id(uid), _nickname(nickname), _password(password)
    {
    }
    User(const std::string &uid, const std::string &phone)
        : _user_id(uid), _phone(phone), _nickname(uid)
    {
    }

    std::string user_id()
    {
        return _user_id;
    }

    void nickname(const std::string &val)
    {
        _nickname = val;
    }
    odb::nullable<std::string> nickname()
    {
        return _nickname;
    }

    void description(const std::string &val)
    {
        _description = val;
    }
    odb::nullable<std::string> description()
    {
        return _description;
    }
    void password(const std::string &val)
    {
        _password = val;
    }
    odb::nullable<std::string> password()
    {
        return _password;
    }
    void phone(const std::string &val)
    {
        _phone = val;
    }
    odb::nullable<std::string> phone()
    {
        return _phone;
    }
    void avarta_id(const std::string &val)
    {
        _avarta_id = val;
    }
    odb::nullable<std::string> avarta_id()
    {
        return _avarta_id;
    }

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db index
    std::string _user_id;
#pragma db index
    odb::nullable<std::string> _nickname;
    odb::nullable<std::string> _description;
    odb::nullable<std::string> _password;
#pragma db index
    odb::nullable<std::string> _phone;
    odb::nullable<std::string> _avarta_id;
};