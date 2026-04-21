#include <sw/redis++/redis.h>
#include <iostream>

namespace im_server
{
    class Session
    {
    public:
        using ptr = std::shared_ptr<Session>;
        Session(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        void append(const std::string &ssid, const std::string &uid)
        {
            _redis_client->set(ssid, uid);
        }
        void remove(const std::string &ssid)
        {
            _redis_client->del(ssid);
        }
        sw::redis::OptionalString uid(const std::string &ssid)
        {
            return _redis_client->get(ssid);
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client;
    };
    class Status
    {
    public:
        using ptr = std::shared_ptr<Status>;
        Status(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        void append(const std::string &uid)
        {
            _redis_client->set(uid, "");
        }
        void remove(const std::string &uid)
        {
            _redis_client->del(uid);
        }
        bool exists(const std::string &uid)
        {
            auto res = _redis_client->get(uid);
            if (res)
                return true;
            return false;
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client;
    };
    class Code
    {
    public:
        using ptr = std::shared_ptr<Code>;
        Code(const std::shared_ptr<sw::redis::Redis> &redis_client)
            : _redis_client(redis_client)
        {
        }
        void append(const std::string &cid, const std::string &code, const std::chrono::milliseconds &timeout = std::chrono::milliseconds(60000))
        {
            _redis_client->set(cid, code, std::chrono::milliseconds(timeout));
        }
        void remove(const std::string &cid)
        {
            _redis_client->del(cid);
        }
        sw::redis::OptionalString code(const std::string &cid)
        {
            return _redis_client->get(cid);
        }

    private:
        std::shared_ptr<sw::redis::Redis> _redis_client;
    };

    class RedisClientFactory
    {
    public:
        static std::shared_ptr<sw::redis::Redis> create(const std::string &host, const int &port, const int &db, const bool &keep_alive)
        {

            sw::redis::ConnectionOptions opts;
            opts.host = host;
            opts.keep_alive = keep_alive;
            opts.port = port;
            opts.db = db;
            return std::make_shared<sw::redis::Redis>(opts);
        }
    };
}