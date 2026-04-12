#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <iostream>

typedef websocketpp::server<websocketpp::config::asio> server_t;

void onOpen(websocketpp::connection_hdl hdl)
{
    std::cout << "websocket长连接建立成功" << std::endl;
}
void onClose(websocketpp::connection_hdl hdl)
{
    std::cout << "websocket长连接断开" << std::endl;
}
void onMessage(server_t *server, websocketpp::connection_hdl hdl, server_t::message_ptr msg)
{
    std::string body = msg->get_payload();
    std::cout << "收到消息: " << body << std::endl;
    auto conn = server->get_con_from_hdl(hdl);
    conn->send(body + "--Hello!", websocketpp::frame::opcode::text);
}

int main()
{
    server_t server;
    server.set_access_channels(websocketpp::log::elevel::none);
    server.init_asio();
    server.set_open_handler(onOpen);
    server.set_close_handler(onClose);
    server.set_message_handler(std::bind(onMessage, &server, std::placeholders::_1, std::placeholders::_2));
    server.set_reuse_addr(true);
    server.listen(8089);
    server.start_accept();
    server.run();
    return 0;
}