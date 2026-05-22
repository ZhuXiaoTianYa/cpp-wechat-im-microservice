/**
 * 消息 API 模块
 * 包含消息发送、历史查询、搜索等接口
 */
import apiClient from './api-client';
import { im_server } from '@/proto/generated';

/**
 * 获取历史消息（按时间范围）
 * @param sessionId 登录会话ID
 * @param chatSessionId 聊天会话ID
 * @param startTime 起始时间戳（秒）
 * @param overTime 结束时间戳（秒）
 */
export async function getHistoryMsg(
  sessionId: string,
  chatSessionId: string,
  startTime: number,
  overTime: number
): Promise<im_server.GetHistoryMsgRsp> {
  const req = im_server.GetHistoryMsgReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_id: chatSessionId,
    start_time: startTime,
    over_time: overTime,
  });
  
  return apiClient.post('/service/message_storage/get_history', req, {
    metadata: { responseType: im_server.GetHistoryMsgRsp },
  });
}

/**
 * 获取最近N条消息
 * @param sessionId 登录会话ID
 * @param chatSessionId 聊天会话ID
 * @param msgCount 消息数量（默认20）
 */
export async function getRecentMsg(
  sessionId: string,
  chatSessionId: string,
  msgCount: number = 20
): Promise<im_server.GetRecentMsgRsp> {
  const req = im_server.GetRecentMsgReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_id: chatSessionId,
    msg_count: msgCount,
  });
  
  return apiClient.post('/service/message_storage/get_recent', req, {
    metadata: { responseType: im_server.GetRecentMsgRsp },
  });
}

/**
 * 搜索历史消息
 * @param sessionId 登录会话ID
 * @param chatSessionId 聊天会话ID
 * @param searchKey 搜索关键词
 */
export async function msgSearch(
  sessionId: string,
  chatSessionId: string,
  searchKey: string
): Promise<im_server.MsgSearchRsp> {
  const req = im_server.MsgSearchReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_id: chatSessionId,
    search_key: searchKey,
  });
  
  return apiClient.post('/service/message_storage/search_history', req, {
    metadata: { responseType: im_server.MsgSearchRsp },
  });
}

/**
 * 发送消息
 * @param sessionId 登录会话ID
 * @param chatSessionId 聊天会话ID
 * @param message 消息内容
 */
export async function sendMessage(
  sessionId: string,
  chatSessionId: string,
  message: im_server.IMessageContent
): Promise<im_server.NewMessageRsp> {
  const req = im_server.NewMessageReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    chat_session_id: chatSessionId,
    message,
  });
  
  return apiClient.post('/service/message_transmit/new_message', req, {
    metadata: { responseType: im_server.NewMessageRsp },
  });
}
