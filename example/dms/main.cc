#include <iostream>
#include <string>
#include <curl/curl.h>
#include <openssl/hmac.h>
#include <time.h>
#include <stdlib.h>
#include <algorithm>
#include <sstream>
#include <vector>
#include <random>
#include <cstdio>

using namespace std;

size_t writeCallback(void *contents, size_t size, size_t nmemb, string *s)
{
    size_t newLength = size * nmemb;
    s->append((char *)contents, newLength);
    return newLength;
}

string hmacSha1Base64(const string &key, const string &data)
{
    unsigned char hash[20];
    HMAC(EVP_sha1(), key.data(), key.size(),
         (const unsigned char *)data.data(), data.size(), hash, NULL);

    char base64[256];
    EVP_EncodeBlock((unsigned char *)base64, hash, 20);
    string res = base64;
    res.erase(remove(res.begin(), res.end(), '\n'), res.end());
    return res;
}

string genNonce()
{
    static random_device rd;
    static mt19937 gen(rd());
    uniform_int_distribution<> dis(100000000, 999999999);
    return to_string(dis(gen));
}

int main()
{
    // ===================== 你的配置 =====================
    string AK = "123456";
    string SK = "123456";
    string phone = "123456";
    string signName = "云渚科技验证平台";
    string templateCode = "100001";
    string schemeName = "测试方案";
    string templateParam = R"({"code":"123456","min":"5"})";
    // =====================================================

    curl_global_init(CURL_GLOBAL_ALL);
    CURL *curl = curl_easy_init();
    CURLcode curlCode;
    string response;

    char timestamp[64];
    time_t now = time(nullptr);
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
    string nonce = genNonce();

    // ===================== 1. 构造原始参数 =====================
    vector<pair<string, string>> params = {
        {"AccessKeyId", AK},
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

    // ===================== 2. 排序 =====================
    sort(params.begin(), params.end());

    // ===================== 3. 编码并拼接 =====================
    string query;
    for (auto &p : params)
    {
        if (!query.empty())
            query += "&";
        char *k = curl_easy_escape(curl, p.first.c_str(), p.first.size());
        char *v = curl_easy_escape(curl, p.second.c_str(), p.second.size());
        query += k;
        query += "=";
        query += v;
        curl_free(k);
        curl_free(v);
    }

    // ===================== 4. 构造签名字符串 =====================
    string stringToSign = "POST&%2F&";
    char *encodedQuery = curl_easy_escape(curl, query.c_str(), query.size());
    stringToSign += encodedQuery;
    curl_free(encodedQuery);

    // ===================== 5. 生成签名 =====================
    string signature = hmacSha1Base64(SK + "&", stringToSign);

    // ===================== 6. 最终请求 =====================
    string postData = query + "&Signature=";
    char *sigEncoded = curl_easy_escape(curl, signature.c_str(), signature.size());
    postData += sigEncoded;
    curl_free(sigEncoded);

    // ===================== 发送请求 =====================
    curl_easy_setopt(curl, CURLOPT_URL, "https://dypnsapi.aliyuncs.com");
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postData.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_perform(curl);

    cout << "返回结果：" << response << endl;

    curl_easy_cleanup(curl);
    return 0;
}