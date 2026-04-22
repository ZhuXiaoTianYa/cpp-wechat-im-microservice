#pragma once
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/date_time/posix_time/ptime.hpp>
#include <odb/core.hxx>
#include <odb/forward.hxx>
#include <odb/nullable.hxx>
#include <string>

namespace im_server {
#pragma db object table("message")
class Message {
public:
    Message() {}

private:
    friend class odb::access;
#pragma db id auto
    unsigned long _id;
#pragma db type("varchar(64)") index unique
    std::string _message_id;
#pragma db type("varchar(64)") index
    std::string _session_id;
#pragma db type("varchar(64)")
    std::string _user_id;
    unsigned char _message_type;
#pragma db type("TIMESTAMP")
    boost::posix_time::ptime _create_time;
#pragma db type("varchar(64)")
    odb::nullable<std::string> _file_id;
#pragma db type("varchar(128)")
    odb::nullable<std::string> _file_name;
    odb::nullable<std::string> _content;
    odb::nullable<unsigned int> _file_size;
};
// odb -d mysql --std c++11 --generate-query --generate-schema --profile
// boost/date-time person.hxx
} // namespace im_server