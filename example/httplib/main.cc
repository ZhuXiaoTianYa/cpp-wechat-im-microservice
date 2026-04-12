#include "../common/httplib.h"

int main()
{
    httplib::Server server;
    server.Get("/hi", [](const httplib::Request &req, httplib::Response &rsp)
               {
                 std::cout << req.method << std::endl;
                 std::cout << req.path << std::endl;
                 for(auto& it:req.headers)
                 {
                     std::cout << it.first<<": "<<it.second << std::endl;
                 }
                 std::string body = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>首页</title></head><body><h1>Hello World</h1></body></html>";
                 rsp.set_content(body,"text/html");
                rsp.status=200; });
    server.listen("0.0.0.0", 8089);
    return 0;
}