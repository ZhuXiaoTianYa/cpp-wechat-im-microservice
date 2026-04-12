#include <iostream>
#include <elasticlient/client.h>
#include <cpr/cpr.h>

int main()
{
    elasticlient::Client client({"http://127.0.0.1:9200/"});
    try
    {
        auto resp = client.search("user", "_doc", "{\"query\":{\"match_all\":{}}}");
        std::cout << resp.status_code << std::endl;
        std::cout << resp.text << std::endl;
    }
    catch (std::exception &e)
    {
        std::cout << "请求失败:" << e.what() << std::endl;
        return -1;
    }
    return 0;
}
