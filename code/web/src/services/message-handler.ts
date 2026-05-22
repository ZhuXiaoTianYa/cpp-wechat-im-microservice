/**
 * WebSocket 消息处理器
 * 根据通知类型分发到对应的 Store action
 */
import { im_server } from '@/proto/generated';
import { useIMStore } from '@/store/useIMStore';

export function handleNotifyMessage(notify: im_server.INotifyMessage) {
  switch (notify.notifyType) {
    case im_server.NotifyType.CHAT_MESSAGE_NOTIFY:
      handleNewMessage(notify.newMessageInfo);
      break;
      
    case im_server.NotifyType.FRIEND_ADD_APPLY_NOTIFY:
      handleFriendAddApply(notify.friendAddApply);
      break;
      
    case im_server.NotifyType.FRIEND_ADD_PROCESS_NOTIFY:
      handleFriendAddProcess(notify.friendProcessResult);
      break;
      
    case im_server.NotifyType.CHAT_SESSION_CREATE_NOTIFY:
      handleNewChatSession(notify.newChatSessionInfo);
      break;
      
    case im_server.NotifyType.FRIEND_REMOVE_NOTIFY:
      handleFriendRemove(notify.friendRemove);
      break;
      
    default:
      console.warn('未知通知类型:', notify.notifyType);
  }
}

function handleNewMessage(newMessageInfo: im_server.INotifyNewMessage | null | undefined) {
  if (!newMessageInfo?.messageInfo) return;
  
  const msg = newMessageInfo.messageInfo;
  const store = useIMStore.getState();
  
  store.addMessage(msg.chatSessionId || '', msg);
  console.log('收到新消息:', {
    sessionId: msg.chatSessionId,
    sender: msg.sender?.nickname,
    type: msg.message?.messageType,
  });
}

function handleFriendAddApply(friendAddApply: im_server.INotifyFriendAddApply | null | undefined) {
  if (!friendAddApply?.userInfo) return;
  
  const store = useIMStore.getState();
  const event: im_server.IFriendEvent = {
    eventId: crypto.randomUUID(),
    sender: friendAddApply.userInfo,
  };
  
  store.addPendingFriendRequest(event);
  console.log('收到好友申请:', friendAddApply.userInfo.nickname);
}

function handleFriendAddProcess(friendProcessResult: im_server.INotifyFriendAddProcess | null | undefined) {
  if (!friendProcessResult) return;
  
  const { agree, userInfo } = friendProcessResult;
  
  if (agree && userInfo) {
    const store = useIMStore.getState();
    store.addFriend(userInfo);
    console.log('好友申请已同意:', userInfo.nickname);
  } else {
    console.log('好友申请已拒绝');
  }
}

function handleNewChatSession(newChatSessionInfo: im_server.INotifyNewChatSession | null | undefined) {
  if (!newChatSessionInfo?.chatSessionInfo) return;
  
  const session = newChatSessionInfo.chatSessionInfo;
  const store = useIMStore.getState();
  
  store.updateSession(session);
  console.log('新建会话:', session.chatSessionName);
}

function handleFriendRemove(friendRemove: im_server.INotifyFriendRemove | null | undefined) {
  if (!friendRemove?.userId) return;
  
  const store = useIMStore.getState();
  store.removeFriend(friendRemove.userId);
  console.log('好友已删除:', friendRemove.userId);
}
