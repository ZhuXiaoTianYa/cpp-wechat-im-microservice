#include <elasticlient/client.h>
#include <cpr/cpr.h>
#include <json/json.h>
#include <iostream>
#include <sstream>
#include <string>
#include <memory>
#include "logger.hpp"
namespace im_server
{
    bool Serialize(const Json::Value &value, std::string &dest)
    {
        Json::StreamWriterBuilder swb;
        std::unique_ptr<Json::StreamWriter> sw(swb.newStreamWriter());
        std::stringstream ss;
        int ret = sw->write(value, &ss);
        if (ret != 0)
        {
            return false;
        }
        dest = ss.str();
        return true;
    }

    bool UnSerialize(const std::string &src, Json::Value &value)
    {
        Json::CharReaderBuilder crb;
        std::unique_ptr<Json::CharReader> cr(crb.newCharReader());
        std::string err;
        bool ret = cr->parse(src.c_str(), src.c_str() + src.size(), &value, &err);
        if (ret == false)
        {
            std::cout << err << std::endl;
            return false;
        }
        return true;
    }

    class EsIndex
    {
    public:
        EsIndex(std::shared_ptr<elasticlient::Client> &client, const std::string &name, const std::string &type = "_doc")
            : _name(name), _type(type), _client(client)
        {
            Json::Value analysis;
            Json::Value analyzer;
            Json::Value ik;
            Json::Value tokenizer;
            tokenizer["tokenizer"] = "ik_max_word";
            ik["ik"] = tokenizer;
            analyzer["analyzer"] = ik;
            analysis["analysis"] = analyzer;
            _index["settings"] = analysis;
        }

        EsIndex &append(const std::string &key, const std::string &type = "text", const std::string &analyzer = "ik_max_word", const bool &enable = true)
        {
            Json::Value fields;
            fields["type"] = type;
            fields["analyzer"] = analyzer;
            if (enable == false)
                fields["enable"] = enable;
            _properties[key] = fields;
            return *this;
        }
        bool create(const std::string &index_id = "default_index_id")
        {
            _mappings["dynamic"] = true;
            _mappings["properties"] = _properties;
            _index["mappings"] = _mappings;
            std::string body;
            bool ret = Serialize(_index, body);
            if (ret == false)
            {
                LOG_ERROR("索引序列化失败!");
                return false;
            }
            LOG_INFO("请求正文[{}]", body);
            try
            {
                auto resp = _client->index(_name, _type, index_id, body);
                if (resp.status_code < 200 || resp.status_code >= 300)
                {
                    LOG_ERROR("创建ES索引{}失败，响应状态码异常:{}, 响应消息{}", _name, resp.status_code, resp.text);
                    return false;
                }
            }
            catch (std::exception &e)
            {
                LOG_ERROR("创建ES索引{}失败: {}", _name, e.what());
                return false;
            }
            return true;
        }

    private:
        std::string _name;
        std::string _type;
        Json::Value _properties;
        Json::Value _index;
        Json::Value _mappings;
        std::shared_ptr<elasticlient::Client> _client;
    };

    class EsInsert
    {
    public:
        EsInsert(std::shared_ptr<elasticlient::Client> &client, const std::string &name, const std::string &type = "_doc")
            : _name(name), _type(type), _client(client)
        {
        }

        EsInsert &append(const std::string &key, const std::string &val)
        {
            _item[key] = val;
            return *this;
        }

        bool insert(const std::string &id)
        {
            std::string body;
            bool ret = Serialize(_item, body);
            if (ret == false)
            {
                LOG_ERROR("索引序列化失败!");
                return false;
            }
            LOG_INFO("请求正文[{}]", body);
            try
            {
                auto resp = _client->index(_name, _type, id, body);
                if (resp.status_code < 200 || resp.status_code >= 300)
                {
                    LOG_ERROR("新增数据{}失败，响应状态码异常:{}, 响应消息{}", _name, resp.status_code, resp.text);
                    return false;
                }
            }
            catch (std::exception &e)
            {
                LOG_ERROR("新增数据{}失败: {}", _name, e.what());
                return false;
            }
            return true;
        }

    private:
        std::string _name;
        std::string _type;
        Json::Value _item;
        std::shared_ptr<elasticlient::Client> _client;
    };

    class EsRemove
    {
    public:
        EsRemove(std::shared_ptr<elasticlient::Client> &client, const std::string &name, const std::string &type = "_doc")
            : _name(name), _type(type), _client(client)
        {
        }

        bool remove(const std::string &id)
        {
            try
            {
                auto resp = _client->remove(_name, _type, id);
                if (resp.status_code < 200 || resp.status_code >= 300)
                {
                    LOG_ERROR("删除数据{}失败，响应状态码异常:{}, 响应消息{}", _name, resp.status_code, resp.text);
                    return false;
                }
            }
            catch (std::exception &e)
            {
                LOG_ERROR("删除数据{}失败: {}", _name, e.what());
                return false;
            }
            return true;
        }

    private:
        std::string _name;
        std::string _type;
        std::shared_ptr<elasticlient::Client> _client;
    };

    class EsSearch
    {
    public:
        EsSearch(std::shared_ptr<elasticlient::Client> &client, const std::string &name, const std::string &type = "_doc")
            : _name(name), _type(type), _client(client)
        {
        }

        EsSearch &append_must_not_term(const std::string &key, const std::vector<std::string> &val)
        {
            Json::Value fields;
            Json::Value terms;
            for (const auto &v : val)
            {
                fields[key].append(v);
            }
            terms["terms"] = fields;
            _must_not.append(terms);
            return *this;
        }

        EsSearch &append_should_match(const std::string &key, const std::string &val)
        {
            Json::Value field;
            Json::Value match;
            field[key] = val;
            match["match"] = field;
            _should.append(match);
            return *this;
        }

        Json::Value search()
        {
            Json::Value cond;
            Json::Value query;
            Json::Value search;
            if (_must_not.empty() == false)
                cond["must_not"] = _must_not;
            if (_should.empty() == false)
                cond["should"] = _should;
            query["bool"] = cond;
            search["query"] = query;
            std::string body;
            bool ret = Serialize(search, body);
            if (ret == false)
            {
                LOG_ERROR("索引序列化失败!");
                return false;
            }
            LOG_INFO("请求正文[{}]", body);
            cpr::Response resp;
            Json::Value jresp;
            try
            {
                resp = _client->search(_name, _type, body);
                if (resp.status_code < 200 || resp.status_code >= 300)
                {
                    LOG_ERROR("查询数据{}失败，响应状态码异常:{}, 响应消息{}", _name, resp.status_code, resp.text);
                    return Json::Value();
                }
                ret = UnSerialize(resp.text, jresp);
                if (ret == false)
                {
                    LOG_ERROR("查询结果序列化失败!");
                    return false;
                }
                return jresp["hits"]["hits"];
            }
            catch (std::exception &e)
            {
                LOG_ERROR("查询数据{}失败: {}", _name, e.what());
                return Json::Value();
            }
            return jresp["hits"]["hits"];
        }

    private:
        std::string _name;
        std::string _type;
        Json::Value _must_not;
        Json::Value _should;
        std::shared_ptr<elasticlient::Client> _client;
    };
}