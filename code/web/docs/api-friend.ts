/**
 * 好友 API 模块
 * 包含好友管理、会话管理等接口
 */
import apiClient from './api-client';
import { im_server } from '@/proto/generated';

/**
 * 获取好友列表
 * @param sessionId 登录会话ID
 */
export async function getFriendList(
  sessionId: string
): Promise<im_server.GetFriendListRsp> {
  const req = im_server.GetFriendListReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
  });
  
  return apiClient.post('/service/friend/get_friend_list', req, {
    metadata: { responseType: im_server.GetFriendListRsp },
  });
}

/**
 * 发送好友申请
 * @param sessionId 登录会话ID
 * @param respondentId 被申请人ID
 */
export async function friendAdd(
  sessionId: string,
  respondentId: string
): Promise<im_server.FriendAddRsp> {
  const req = im_server.FriendAddReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    respondent_id: respondentId,
  });
  
  return apiClient.post('/service/friend/add_friend_apply', req, {
    metadata: { responseType: im_server.FriendAddRsp },
  });
}

/**
 * 处理好友申请
 * @param sessionId 登录会话ID
 * @param notifyEventId 通知事件ID
 * @param agree 是否同意
 * @param applyUserId 申请人用户ID
 */
export async function friendAddProcess(
  sessionId: string,
  notifyEventId: string,
  agree: boolean,
  applyUserId: string
): Promise<im_server.FriendAddProcessRsp> {
  const req = im_server.FriendAddProcessReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    notify_event_id: notifyEventId,
    agree,
    apply_user_id: applyUserId,
  });
  
  return apiClient.post('/service/friend/add_friend_process', req, {
    metadata: { responseType: im_server.FriendAddProcessRsp },
  });
}

/**
 * 删除好友
 * @param sessionId 登录会话ID
 * @param peerId 对方用户ID
 */
export async function friendRemove(
  sessionId: string,
  peerId: string
): Promise<im_server.FriendRemoveRsp> {
  const req = im_server.FriendRemoveReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    peer_id: peerId,
  });
  
  return apiClient.post('/service/friend/remove_friend', req, {
    metadata: { responseType: im_server.FriendRemoveRsp },
  });
}

/**
 * 搜索用户
 * @param sessionId 登录会话ID
 * @param searchKey 搜索关键词（昵称或手机号）
 */
export async function friendSearch(
  sessionId: string,
  searchKey: string
): Promise<im_server.FriendSearchRsp> {
  const req = im_server.FriendSearchReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    search_key: searchKey,
  });
  
  return apiClient.post('/service/friend/search_friend', req, {
    metadata: { responseType: im_server.FriendSearchRsp },
  });
}

/**
 * 获取待处理好友申请列表
 * @param sessionId 登录会话ID
 */
export async function getPendingFriendEventList(
  sessionId: string
): Promise<im_server.GetPendingFriendEventListRsp> {
  const req = im_server.GetPendingFriendEventListReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
  });
  
  return apiClient.post('/service/friend/get_pending_friend_events', req, {
    metadata: { responseType: im_server.GetPendingFriendEventListRsp },
  });
}

/**
 * 获取会话列表
 * @param sessionId 登录会话ID
 */
export async function getChatSessionList(
  sessionId: string
): Promise<im_server.GetChatSessionListRsp> {
  const req = im_server.GetChatSessionListReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
  });
  
  return apiClient.post('/service/friend/get_chat_session_list', req, {
    metadata: { responseType: im_server.GetChatSessionListRsp },
  });
}

/**
 * 创建群聊会话
 * @param sessionId 登录会话ID
 * @param chatSessionName 群聊名称
 * @param memberIdList 成员ID列表（包含创建者自己）
 */
export async function chatSessionCreate(
  sessionId: string,
  chatSessionName: string,
  memberIdList: string[]
): Promise<im_server.ChatSessionCreateRsp> {
  const req = im_server.ChatSessionCreateReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_name: chatSessionName,
    member_id_list: memberIdList,
  });
  
  return apiClient.post('/service/friend/create_chat_session', req, {
    metadata: { responseType: im_server.ChatSessionCreateRsp },
  });
}

/**
 * 获取会话成员列表
 * @param sessionId 登录会话ID
 * @param chatSessionId 聊天会话ID
 */
export async function getChatSessionMember(
  sessionId: string,
  chatSessionId: string
): Promise<im_server.GetChatSessionMemberRsp> {
  const req = im_server.GetChatSessionMemberReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_id: chatSessionId,
  });
  
  return apiClient.post('/service/friend/get_chat_session_member', req, {
    metadata: { responseType: im_server.GetChatSessionMemberRsp },
  });
}
