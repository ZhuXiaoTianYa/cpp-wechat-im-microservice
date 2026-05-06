/**
 * @file friend_server.hpp
 * @brief 好友与会话服务模块
 * @details 提供好友关系管理、好友申请处理、会话管理等功能
 * @author ZhuTian
 * @date 2026
 */

#pragma once

#define IM_LOG_SERVICE_TAG "好友服务"
#include <brpc/controller.h>
#include <brpc/server.h>
#include <butil/logging.h>

#include "base.pb.h"
#include "channel.hpp"
#include "data_es.hpp"
#include "etcd.hpp"
#include "friend.pb.h"
#include "logger.hpp"
#include "message.pb.h"
#include "mysql_chat_session.hpp"
#include "mysql_chat_session_member.hpp"
#include "mysql_friend_apply.hpp"
#include "mysql_relation.hpp"
#include "user.pb.h"
#include "utils.hpp"
#include <functional>
#include <string>
#include <unordered_set>
#include <utility>
#include <vector>
namespace im_server {

/**
 * @class FriendServiceImpl
 * @brief 好友服务RPC接口实现类
 * @details 实现好友关系管理、好友申请、会话创建等功能，集成MySQL、ES和下游服务
 */
class FriendServiceImpl : public FriendService {
public:
    /**
     * @brief 构造函数
     * @param mysql_client MySQL数据库连接
     * @param es_client Elasticsearch客户端（用于用户搜索）
     * @param mm_channels 下游服务管理器
     * @param message_service_name 消息服务名称
     * @param user_service_name 用户服务名称
     */
    FriendServiceImpl(const std::shared_ptr<odb::core::database> &mysql_client,
                      const std::shared_ptr<elasticlient::Client> &es_client,
                      const std::shared_ptr<ServiceManager> &mm_channels,
                      const std::string &message_service_name,
                      const std::string &user_service_name)
        : _es_user(std::make_shared<ESUser>(es_client)),
          _mysql_chat_session_member(
              std::make_shared<ChatSessionMemberTable>(mysql_client)),
          _mysql_chat_session(std::make_shared<ChatSessionTable>(mysql_client)),
          _mysql_apply(std::make_shared<FriendApplyTable>(mysql_client)),
          _mysql_relation(std::make_shared<RelationTable>(mysql_client)),
          _mm_channels(mm_channels),
          _message_service_name(message_service_name),
          _user_service_name(user_service_name) {}
    
    ~FriendServiceImpl() {}

    /**
     * @brief 获取好友列表
     * @param controller RPC控制器
     * @param request 请求（包含用户ID）
     * @param response 响应（包含好友信息列表）
     * @param done RPC回调
     * @details 从MySQL查询好友关系，批量拉取用户详细信息
     */
    virtual void GetFriendList(::google::protobuf::RpcController *controller,
                               const ::im_server::GetFriendListReq *request,
                               ::im_server::GetFriendListRsp *response,
                               ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string rid = request->request_id();
        auto friend_id_lists = _mysql_relation->friends(uid);
        std::unordered_set<std::string> user_id_lists;
        for (auto &user : friend_id_lists) {
            user_id_lists.insert(user);
        }
        std::unordered_map<std::string, UserInfo> user_lists;
        bool ret = GetUserInfo(rid, user_id_lists, user_lists);
        if (ret == false) {
            LOG_ERROR("RPC FriendService | request_id={} | 阶段=批量拉取用户资料 | "
                      "结果=失败",
                      request->request_id());
            return err_response(request->request_id(), "批量获取用户信息失败");
        }
        for (const auto &user : user_lists) {
            response->add_friend_list()->CopyFrom(user.second);
        }
        response->set_request_id(rid);
        response->set_success(true);
    }
    /**
     * @brief 删除好友
     * @param controller RPC控制器
     * @param request 请求（包含用户ID和对方ID）
     * @param response 响应（成功或失败）
     * @param done RPC回调
     * @details 删除双向好友关系和对应的单聊会话
     */
    virtual void FriendRemove(::google::protobuf::RpcController *controller,
                              const ::im_server::FriendRemoveReq *request,
                              ::im_server::FriendRemoveRsp *response,
                              ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string pid = request->peer_id();
        std::string rid = request->request_id();
        bool ret = _mysql_relation->remove(uid, pid);
        if (ret == false) {
            LOG_ERROR("RPC FriendRemove | request_id={} | 阶段=MySQL删除好友关系 | "
                      "结果=失败 | user_id={} | peer_id={}",
                      rid, uid, pid);
            return err_response(rid, "从数据库删除好友信息失败");
        }
        ret = _mysql_chat_session->remove(uid, pid);
        if (ret == false) {
            LOG_ERROR("RPC FriendRemove | request_id={} | 阶段=MySQL删除单聊会话 | "
                      "结果=失败 | user_id={} | peer_id={}",
                      rid, uid, pid);
            return err_response(rid, "从数据库删除好友会话信息失败");
        }
        response->set_request_id(rid);
        response->set_success(true);
    }
    virtual void FriendAdd(::google::protobuf::RpcController *controller,
                           const ::im_server::FriendAddReq *request,
                           ::im_server::FriendAddRsp *response,
                           ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string pid = request->respondent_id();
        std::string rid = request->request_id();
        bool ret = _mysql_relation->exists(uid, pid);
        if (ret == true) {
            LOG_WARN("RPC FriendAdd | request_id={} | 阶段=业务校验 | 结果=拒绝 | "
                     "原因=双方已是好友 | applicant={} | target={}",
                     rid, uid, pid);
            return err_response(rid, "两者已经是好友了");
        }
        ret = _mysql_apply->exists(uid, pid);
        if (ret == true) {
            LOG_WARN("RPC FriendAdd | request_id={} | 阶段=业务校验 | 结果=拒绝 | "
                     "原因=已存在待处理或重复申请 | applicant={} | target={}",
                     rid, uid, pid);
            return err_response(rid, "已经申请过对方好友");
        }
        std::string eid = uuid();
        FriendApply ev(eid, uid, pid);
        ret = _mysql_apply->insert(ev);
        if (ret == false) {
            LOG_ERROR("RPC FriendAdd | request_id={} | 阶段=MySQL写入好友申请 | 结果=失败",
                      rid);
            return err_response(rid, "向数据库中新增好友申请事件失败");
        }
        response->set_request_id(rid);
        response->set_success(true);
        response->set_notify_event_id(eid);
    }
    virtual void
    FriendAddProcess(::google::protobuf::RpcController *controller,
                     const ::im_server::FriendAddProcessReq *request,
                     ::im_server::FriendAddProcessRsp *response,
                     ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string pid = request->apply_user_id();
        std::string rid = request->request_id();
        bool agree = request->agree();
        bool ret = _mysql_apply->exists(pid, uid);
        if (ret == false) {
            LOG_WARN("RPC FriendAddProcess | request_id={} | 阶段=校验申请记录 | "
                     "结果=拒绝 | 原因=无匹配申请 | handler={} | applicant={}",
                     rid, uid, pid);
            return err_response(rid, "没有找到对应的好友申请事件");
        }
        ret = _mysql_apply->remove(pid, uid);
        if (ret == false) {
            LOG_ERROR("RPC FriendAddProcess | request_id={} | 阶段=MySQL删除申请记录 | "
                      "结果=失败 | handler={} | applicant={}",
                      rid, uid, pid);
            return err_response(rid, "从数据库中删除申请事件失败");
        }
        std::string cssid;
        if (agree == true) {
            ret = _mysql_relation->insert(uid, pid);
            if (ret == false) {
                LOG_ERROR("RPC FriendAddProcess | request_id={} | 阶段=MySQL写入好友关系 | "
                          "结果=失败 | user_id={} | peer_id={}",
                          rid, uid, pid);
                return err_response(rid, "新增好友关系信息失败");
            }
            cssid = uuid();
            ChatSession css(cssid, "", ChatSessionType::SINGLE);
            ret = _mysql_chat_session->insert(css);
            if (ret == false) {
                LOG_ERROR("RPC FriendAddProcess | request_id={} | 阶段=MySQL创建单聊会话 | "
                          "结果=失败 | session_id={}",
                          rid, cssid);
                return err_response(rid, "新增单聊会话信息失败");
            }
            ChatSessionMember csm1(cssid, uid);
            ChatSessionMember csm2(cssid, pid);
            std::vector<ChatSessionMember> csm_lists = {csm1, csm2};
            ret = _mysql_chat_session_member->append(csm_lists);
            if (ret == false) {
                LOG_ERROR("RPC FriendAddProcess | request_id={} | 阶段=MySQL写入会话成员 | "
                          "结果=失败 | session_id={}",
                          rid, cssid);
                return err_response(rid, "添加会话成员信息失败");
            }
        }
        response->set_request_id(rid);
        response->set_success(true);
        response->set_new_session_id(cssid);
    }
    virtual void FriendSearch(::google::protobuf::RpcController *controller,
                              const ::im_server::FriendSearchReq *request,
                              ::im_server::FriendSearchRsp *response,
                              ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string skey = request->search_key();
        std::string rid = request->request_id();
        std::vector<std::string> friend_id_lists =
            _mysql_relation->friends(uid);
        friend_id_lists.push_back(uid);
        for (auto &uidq : friend_id_lists) {
            std::cout << uidq << std::endl;
        }
        auto search_res = _es_user->search(skey, friend_id_lists);
        std::unordered_set<std::string> user_id_lists;
        for (auto &user : search_res) {
            user_id_lists.insert(user.user_id());
        }
        std::unordered_map<std::string, UserInfo> user_lists;
        bool ret = GetUserInfo(rid, user_id_lists, user_lists);
        if (ret == false) {
            LOG_ERROR("RPC FriendService | request_id={} | 阶段=批量拉取用户资料 | "
                      "结果=失败",
                      request->request_id());
            return err_response(request->request_id(), "批量获取用户信息失败");
        }
        for (auto &user : user_lists) {
            response->add_user_info()->CopyFrom(user.second);
        }
        response->set_request_id(rid);
        response->set_success(true);
    }
    virtual void
    GetChatSessionList(::google::protobuf::RpcController *controller,
                       const ::im_server::GetChatSessionListReq *request,
                       ::im_server::GetChatSessionListRsp *response,
                       ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string rid = request->request_id();
        auto sf_list = _mysql_chat_session->singleChatSession(uid);
        std::unordered_set<std::string> user_id_lists;
        for (auto &scs : sf_list) {
            user_id_lists.insert(scs.friend_id);
        }
        std::unordered_map<std::string, UserInfo> user_lists;
        bool ret = GetUserInfo(rid, user_id_lists, user_lists);
        if (ret == false) {
            LOG_ERROR("RPC FriendService | request_id={} | 阶段=批量拉取用户资料 | "
                      "结果=失败",
                      request->request_id());
            return err_response(request->request_id(), "批量获取用户信息失败");
        }
        auto gc_list = _mysql_chat_session->groupChatSession(uid);
        for (const auto &f : sf_list) {
            auto chat_session_info = response->add_chat_session_info_list();
            chat_session_info->set_single_chat_friend_id(f.friend_id);
            chat_session_info->set_chat_session_id(f.chat_session_id);
            chat_session_info->set_chat_session_name(
                user_lists[f.friend_id].nickname());
            chat_session_info->set_avatar(user_lists[f.friend_id].avatar());
            MessageInfo msg;
            ret = GetRecentMessage(rid, f.chat_session_id, msg);
            if (ret == false) {
                continue;
            }
            chat_session_info->mutable_prev_message()->CopyFrom(msg);
        }
        for (const auto &f : gc_list) {
            auto chat_session_info = response->add_chat_session_info_list();
            chat_session_info->set_chat_session_name(f.chat_session_name);
            chat_session_info->set_chat_session_id(f.chat_session_id);
            MessageInfo msg;
            ret = GetRecentMessage(rid, f.chat_session_id, msg);
            if (ret == false) {
                continue;
            }
            chat_session_info->mutable_prev_message()->CopyFrom(msg);
        }
        response->set_request_id(rid);
        response->set_success(true);
    }
    virtual void
    ChatSessionCreate(::google::protobuf::RpcController *controller,
                      const ::im_server::ChatSessionCreateReq *request,
                      ::im_server::ChatSessionCreateRsp *response,
                      ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string uid = request->user_id();
        std::string cssname = request->chat_session_name();
        std::string rid = request->request_id();
        std::string cssid = uuid();
        ChatSession cs(cssid, cssname, ChatSessionType::GROUP);
        bool ret = _mysql_chat_session->insert(cs);
        if (ret == false) {
            LOG_ERROR("RPC ChatSessionCreate | request_id={} | 阶段=MySQL创建群会话 | "
                      "结果=失败 | session_name={}",
                      request->request_id(), cssname);
            return err_response(request->request_id(),
                                "向数据库中添加会话信息失败");
        }
        std::vector<ChatSessionMember> chat_member_list;
        for (int i = 0; i < request->member_id_list_size(); i++) {
            ChatSessionMember csm(cssid, request->member_id_list(i));
            chat_member_list.push_back(csm);
        }
        ret = _mysql_chat_session_member->append(chat_member_list);
        if (ret == false) {
            LOG_ERROR("RPC ChatSessionCreate | request_id={} | 阶段=MySQL写入群成员 | "
                      "结果=失败 | session_name={}",
                      request->request_id(), cssname);
            return err_response(request->request_id(),
                                "向数据库中添加会话成员信息失败");
        }
        response->set_request_id(rid);
        response->set_success(true);
        response->mutable_chat_session_info()->set_chat_session_id(cssid);
        response->mutable_chat_session_info()->set_chat_session_name(cssname);
    }
    virtual void
    GetChatSessionMember(::google::protobuf::RpcController *controller,
                         const ::im_server::GetChatSessionMemberReq *request,
                         ::im_server::GetChatSessionMemberRsp *response,
                         ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string rid = request->request_id();
        std::string uid = request->user_id();
        std::string cssid = request->chat_session_id();
        auto member_id_list = _mysql_chat_session_member->members(cssid);

        std::unordered_set<std::string> user_id_lists;
        for (auto &uid : member_id_list) {
            user_id_lists.insert(uid);
        }
        std::unordered_map<std::string, UserInfo> user_lists;
        bool ret = GetUserInfo(rid, user_id_lists, user_lists);
        if (ret == false) {
            LOG_ERROR("RPC FriendService | request_id={} | 阶段=批量拉取用户资料 | "
                      "结果=失败",
                      request->request_id());
            return err_response(request->request_id(), "批量获取用户信息失败");
        }
        response->set_request_id(rid);
        response->set_success(true);
        for (auto &user : user_lists) {
            response->add_member_info_list()->CopyFrom(user.second);
        }
    }
    virtual void GetPendingFriendEventList(
        ::google::protobuf::RpcController *controller,
        const ::im_server::GetPendingFriendEventListReq *request,
        ::im_server::GetPendingFriendEventListRsp *response,
        ::google::protobuf::Closure *done) {
        brpc::ClosureGuard rpc_guard(done);
        auto err_response = [this,
                             response](const std::string &rid,
                                       const std::string &errmsg) -> void {
            response->set_request_id(rid);
            response->set_success(false);
            response->set_errmsg(errmsg);
            return;
        };
        std::string rid = request->request_id();
        std::string uid = request->user_id();
        auto user_id_list = _mysql_apply->applyUsers(uid);

        std::unordered_set<std::string> user_id_lists;
        for (auto &uid : user_id_list) {
            user_id_lists.insert(uid);
        }
        std::unordered_map<std::string, UserInfo> user_lists;
        bool ret = GetUserInfo(rid, user_id_lists, user_lists);
        if (ret == false) {
            LOG_ERROR("RPC FriendService | request_id={} | 阶段=批量拉取用户资料 | "
                      "结果=失败",
                      request->request_id());
            return err_response(request->request_id(), "批量获取用户信息失败");
        }
        response->set_request_id(rid);
        response->set_success(true);
        for (auto &user : user_lists) {
            response->add_event()->mutable_sender()->CopyFrom(user.second);
        }
    }

private:
    bool GetRecentMessage(const std::string &rid, const std::string &cssid,
                          MessageInfo &msg) {
        auto channel = _mm_channels->choose(_message_service_name);
        if (!channel) {
            LOG_ERROR("内部调用消息服务 | request_id={} | 阶段=RPC选路 | 结果=失败 | "
                      "target={}",
                      rid, _message_service_name);
            return false;
        }
        MsgStorageService_Stub stub(channel.get());
        GetRecentMsgReq req;
        GetRecentMsgRsp rsp;
        brpc::Controller cntl;
        req.set_request_id(rid);
        req.set_chat_session_id(cssid);
        req.set_msg_count(1);
        stub.GetRecentMsg(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("内部调用消息服务 | request_id={} | 阶段=RPC调用 | 结果=失败 | "
                      "brpc={}",
                      rid, cntl.ErrorText());
            return false;
        }
        if (rsp.success() == false) {
            LOG_WARN("内部调用消息服务 | request_id={} | 业务返回失败 | detail={}",
                     rid, rsp.errmsg());
            return false;
        }
        if (rsp.msg_list_size() > 0) {
            msg.CopyFrom(rsp.msg_list(0));
            return true;
        }
        return false;
    }
    bool GetUserInfo(const std::string &rid,
                     const std::unordered_set<std::string> &uid_list,
                     std::unordered_map<std::string, UserInfo> &user_list) {
        auto channel = _mm_channels->choose(_user_service_name);
        if (!channel) {
            LOG_ERROR("内部调用用户服务 | request_id={} | 阶段=RPC选路 | 结果=失败 | "
                      "target={}",
                      rid, _user_service_name);
            return false;
        }
        UserService_Stub stub(channel.get());
        GetMultiUserInfoReq req;
        GetMultiUserInfoRsp rsp;
        brpc::Controller cntl;
        req.set_request_id(rid);
        for (auto &user : uid_list) {
            req.add_users_id(user);
        }
        stub.GetMultiUserInfo(&cntl, &req, &rsp, nullptr);
        if (cntl.Failed() == true) {
            LOG_ERROR("内部调用用户服务 | request_id={} | 阶段=RPC调用 | 结果=失败 | "
                      "brpc={}",
                      rid, cntl.ErrorText());
            return false;
        }
        if (rsp.success() == false) {
            LOG_WARN("内部调用用户服务 | request_id={} | 业务返回失败 | detail={}",
                     rid, rsp.errmsg());
            return false;
        }
        const auto &users_list = rsp.users_info();
        for (const auto &user : users_list) {
            user_list.insert(std::make_pair(user.first, user.second));
        }
        return true;
    }

private:
    ESUser::ptr _es_user;                                      ///< Elasticsearch用户索引管理
    ChatSessionMemberTable::ptr _mysql_chat_session_member;   ///< MySQL会话成员表操作
    ChatSessionTable::ptr _mysql_chat_session;                ///< MySQL会话表操作
    FriendApplyTable::ptr _mysql_apply;                       ///< MySQL好友申请表操作
    RelationTable::ptr _mysql_relation;                       ///< MySQL好友关系表操作
    std::string _message_service_name;                        ///< 消息服务名称
    std::string _user_service_name;                           ///< 用户服务名称
    ServiceManager::ptr _mm_channels;                         ///< 下游服务管理器
};

/**
 * @class FriendServer
 * @brief 好友服务器主类
 * @details 封装好友服务的所有依赖组件，提供启动接口
 */
class FriendServer {
public:
    using ptr = std::shared_ptr<FriendServer>;
    
    /**
     * @brief 构造函数
     * @param mysql_client MySQL数据库连接
     * @param es_client Elasticsearch客户端
     * @param service_discoverer 服务发现客户端
     * @param registry_client 服务注册客户端
     * @param rpc_server RPC服务器实例
     */
    FriendServer(const std::shared_ptr<odb::core::database> &mysql_client,
                 const std::shared_ptr<elasticlient::Client> &es_client,
                 const std::shared_ptr<Discoverer> &service_discoverer,
                 const std::shared_ptr<Registrar> &registry_client,
                 const std::shared_ptr<brpc::Server> &rpc_server)
        : _mysql_client(mysql_client), _es_client(es_client),
          _service_discoverer(service_discoverer),
          _registry_client(registry_client), _rpc_server(rpc_server) {}
    
    ~FriendServer() {}

    /**
     * @brief 启动RPC服务器
     * @details 阻塞运行直到收到退出信号
     */
    void start() { _rpc_server->RunUntilAskedToQuit(); }

private:
    std::shared_ptr<odb::core::database> _mysql_client;    ///< MySQL数据库连接
    std::shared_ptr<elasticlient::Client> _es_client;      ///< Elasticsearch客户端
    Discoverer::ptr _service_discoverer;                   ///< 服务发现客户端
    Registrar::ptr _registry_client;                       ///< 服务注册客户端
    std::shared_ptr<brpc::Server> _rpc_server;             ///< RPC服务器
};

/**
 * @class FriendServerBuilder
 * @brief 好友服务器构建器
 * @details 使用Builder模式构建好友服务器，按步骤初始化各个组件
 */
class FriendServerBuilder {
public:
    /**
     * @brief 创建MySQL客户端
     * @param user 数据库用户名
     * @param passwd 数据库密码
     * @param host 数据库地址
     * @param db 数据库名
     * @param cset 字符集
     * @param port 数据库端口
     * @param conn_pool_count 连接池大小
     */
    void make_mysql_object(const std::string &user, const std::string &passwd,
                           const std::string &host, const std::string &db,
                           const std::string &cset, int port,
                           int &conn_pool_count) {
        _mysql_client = im_server::ODBFactory::create(
            user, passwd, host, db, cset, port, conn_pool_count);
    }

    /**
     * @brief 创建Elasticsearch客户端
     * @param host_list ES节点地址列表
     */
    void make_es_object(const std::vector<std::string> &host_list) {
        _es_client = im_server::ESClientFactory::create(host_list);
    }

    /**
     * @brief 创建服务发现客户端
     * @param reg_host etcd服务器地址
     * @param base_service_name 服务发现基础路径
     * @param user_service_name 用户服务名称
     * @param message_service_name 消息服务名称
     * @details 监听用户服务和消息服务的上下线事件
     */
    void make_discovery_object(const std::string &reg_host,
                               const std::string &base_service_name,
                               const std::string &user_service_name,
                               const std::string &message_service_name) {
        _user_service_name = user_service_name;
        _message_service_name = message_service_name;
        _mm_channels = std::make_shared<ServiceManager>();
        _mm_channels->declared(_user_service_name);
        _mm_channels->declared(_message_service_name);
        auto put_cb =
            std::bind(&ServiceManager::onServiceOnline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        auto del_cb =
            std::bind(&ServiceManager::onServiceOffline, _mm_channels.get(),
                      std::placeholders::_1, std::placeholders::_2);
        _service_discoverer = std::make_shared<Discoverer>(
            reg_host, base_service_name, put_cb, del_cb);
    }

    /**
     * @brief 创建服务注册客户端
     * @param reg_host etcd服务器地址
     * @param service_name 服务名称
     * @param access_host 服务访问地址
     * @details 将本服务注册到etcd，失败则终止程序
     */
    void make_registry_object(const std::string &reg_host,
                              const std::string &service_name,
                              const std::string &access_host) {
        _registry_client = std::make_shared<Registrar>(reg_host);
        bool ret = _registry_client->registry(service_name, access_host);
        if (ret == false)
            abort();
    }

    /**
     * @brief 创建RPC服务器
     * @param port 监听端口
     * @param timeout 空闲超时时间（秒）
     * @param num_threads 工作线程数
     * @details 创建并启动RPC服务器，注册好友服务实现
     */
    void make_rpc_object(const uint16_t &port, const uint32_t &timeout,
                         const uint8_t &num_threads) {
        if (!_mysql_client) {
            LOG_ERROR("好友服务启动检查失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("好友服务启动检查失败 | 组件=Elasticsearch | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("好友服务启动检查失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("好友服务启动检查失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        _rpc_server = std::make_shared<brpc::Server>();
        FriendServiceImpl *friend_service =
            new FriendServiceImpl(_mysql_client, _es_client, _mm_channels,
                                  _message_service_name, _user_service_name);
        int ret = _rpc_server->AddService(
            friend_service, brpc::ServiceOwnership::SERVER_OWNS_SERVICE);
        if (ret == -1) {
            LOG_ERROR("好友服务启动失败 | 阶段=添加RPC服务");
            abort();
        }
        brpc::ServerOptions options;
        options.idle_timeout_sec = timeout;
        options.num_threads = num_threads;
        ret = _rpc_server->Start(port, &options);
        if (ret == -1) {
            LOG_ERROR("好友服务启动失败 | 阶段=启动RPC服务器 | port={}", port);
            abort();
        }
        LOG_INFO("好友服务启动成功 | port={} | timeout={}s | threads={}", port, timeout, num_threads);
    }

    FriendServer::ptr build() {
        if (!_mysql_client) {
            LOG_ERROR("好友服务构建失败 | 组件=MySQL | 原因=未初始化");
            abort();
        }
        if (!_es_client) {
            LOG_ERROR("好友服务构建失败 | 组件=Elasticsearch | 原因=未初始化");
            abort();
        }
        if (!_mm_channels) {
            LOG_ERROR("好友服务构建失败 | 组件=下游RPC信道 | 原因=未初始化");
            abort();
        }
        if (!_service_discoverer) {
            LOG_ERROR("好友服务构建失败 | 组件=etcd服务发现 | 原因=未初始化");
            abort();
        }
        if (!_registry_client) {
            LOG_ERROR("好友服务构建失败 | 组件=etcd服务注册 | 原因=未初始化");
            abort();
        }
        if (!_rpc_server) {
            LOG_ERROR("好友服务构建失败 | 组件=RPC服务器 | 原因=未初始化");
            abort();
        }
        return std::make_shared<FriendServer>(_mysql_client, _es_client,
                                              _service_discoverer,
                                              _registry_client, _rpc_server);
    }

private:
    std::shared_ptr<odb::core::database> _mysql_client;
    std::shared_ptr<elasticlient::Client> _es_client;
    std::string _user_service_name;
    std::string _message_service_name;
    ServiceManager::ptr _mm_channels;
    Discoverer::ptr _service_discoverer;
    Registrar::ptr _registry_client;
    std::shared_ptr<brpc::Server> _rpc_server;
};
} // namespace im_server