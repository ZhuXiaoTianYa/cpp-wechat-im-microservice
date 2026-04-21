#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <curl/curl.h>
#include <openssl/hmac.h>
#include <time.h>
#include <random>
#include "logger.hpp"
namespace im_server
{
    class DMSClient
    {
    public:
        using ptr=std::shared_ptr<DMSClient>;
        // 初始化时创建 CURL 句柄
        DMSClient(const std::string &access_key_id, const std::string &access_key_secret)
            : _access_key_id(access_key_id),
              _access_key_secret(access_key_secret)
        {
            curl_global_init(CURL_GLOBAL_ALL);
            _curl = curl_easy_init();
        }

        // 析构时释放
        ~DMSClient()
        {
            if (_curl)
            {
                curl_easy_cleanup(_curl);
            }
        }

        // 禁用拷贝（CURL 句柄不能拷贝）
        DMSClient(const DMSClient &) = delete;
        DMSClient &operator=(const DMSClient &) = delete;

        // 发送接口（高效复用 CURL）
        bool send(const std::string &phone, const std::string &code)
        {
            if (!_curl)
                return false;

            curl_easy_reset(_curl);
            std::string resp;

            char timestamp[64];
            time_t now = time(nullptr);
            strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
            std::string nonce = genNonce();

            // ===================== 配置 =====================
            std::string signName = "云渚科技验证平台";
            std::string templateCode = "100001";
            std::string schemeName = "测试方案";
            std::string templateParam = R"({"code":")" + code + R"(","min":"5"})";

            std::vector<std::pair<std::string, std::string>> params = {
                {"AccessKeyId", _access_key_id},
                {"Action", "SendSmsVerifyCode"},
                {"CountryCode", "86"},
                {"Format", "JSON"},
                {"PhoneNumber", phone},
                {"RegionId", "cn-hangzhou"},
                {"SchemeName", schemeName},
                {"SignName", signName},
                {"SignatureMethod", "HMAC-SHA1"},
                {"SignatureNonce", nonce},
                {"SignatureVersion", "1.0"},
                {"TemplateCode", templateCode},
                {"TemplateParam", templateParam},
                {"Timestamp", timestamp},
                {"Version", "2017-05-25"},
            };

            sort(params.begin(), params.end());

            std::string query;
            for (auto &p : params)
            {
                if (!query.empty())
                    query += "&";
                char *k = curl_easy_escape(_curl, p.first.c_str(), p.first.size());
                char *v = curl_easy_escape(_curl, p.second.c_str(), p.second.size());
                query += k;
                query += "=";
                query += v;
                curl_free(k);
                curl_free(v);
            }

            std::string stringToSign = "POST&%2F&";
            char *encodedQuery = curl_easy_escape(_curl, query.c_str(), query.size());
            stringToSign += encodedQuery;
            curl_free(encodedQuery);

            std::string signature = hmacSha1Base64(_access_key_secret + "&", stringToSign);
            std::string postData = query + "&Signature=";
            char *sigEncoded = curl_easy_escape(_curl, signature.c_str(), signature.size());
            postData += sigEncoded;
            curl_free(sigEncoded);

            curl_easy_setopt(_curl, CURLOPT_URL, "https://dypnsapi.aliyuncs.com");
            curl_easy_setopt(_curl, CURLOPT_POST, 1L);
            curl_easy_setopt(_curl, CURLOPT_POSTFIELDS, postData.c_str());
            curl_easy_setopt(_curl, CURLOPT_WRITEFUNCTION, writeCallback);
            curl_easy_setopt(_curl, CURLOPT_WRITEDATA, &resp);
            curl_easy_perform(_curl);

            // ===================== 结果判断 + 错误信息提取 =====================
            bool success = (resp.find("\"Success\":true") != std::string::npos ||
                            resp.find("\"Code\":\"OK\"") != std::string::npos);

            if (!success)
            {
                LOG_ERROR("短信发送失败，返回结果: {}", resp);
            }

            return success;
        }

    private:
        static size_t writeCallback(void *contents, size_t size, size_t nmemb, std::string *s)
        {
            s->append((char *)contents, size * nmemb);
            return size * nmemb;
        }

        static std::string hmacSha1Base64(const std::string &key, const std::string &data)
        {
            unsigned char hash[20];
            HMAC(EVP_sha1(), key.data(), key.size(),
                 (const unsigned char *)data.data(), data.size(), hash, nullptr);

            char b64[256];
            EVP_EncodeBlock((unsigned char *)b64, hash, 20);
            std::string res = b64;
            res.erase(remove(res.begin(), res.end(), '\n'), res.end());
            return res;
        }

        static std::string genNonce()
        {
            static std::random_device rd;
            static std::mt19937 gen(rd());
            std::uniform_int_distribution<> dis(100000000, 999999999);
            return std::to_string(dis(gen));
        }

    private:
        std::string _access_key_id;
        std::string _access_key_secret;
        CURL *_curl = nullptr;
    };
}