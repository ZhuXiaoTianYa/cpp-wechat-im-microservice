/**
 * 聊天页面
 * 显示消息列表和输入框，支持发送文本、图片、文件
 */
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { getChatSessionList } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import SessionList from '@/components/chat/SessionList';
import ChatArea from '@/components/chat/ChatArea';

export default function ChatPage() {
  const { id } = useParams();
  const sessionId = useIMStore((state) => state.sessionId);

  useEffect(() => {
    if (sessionId) {
      loadSessions();
    }
  }, [sessionId]);

  useEffect(() => {
    if (id) {
      useIMStore.getState().setActiveSession(id);
    }
  }, [id]);

  const loadSessions = async () => {
    if (!sessionId) return;
    
    try {
      const response = await getChatSessionList(sessionId);
      useIMStore.getState().setSessions(response.chatSessionInfoList || []);
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleSelectSession = (session: im_server.IChatSessionInfo) => {
    useIMStore.getState().setActiveSession(session.chatSessionId || null);
  };

  const activeSessionId = useIMStore((state) => state.activeSessionId);
  const activeSession = activeSessionId
    ? useIMStore.getState().sessions.get(activeSessionId)
    : null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <SessionList
        onSelectSession={handleSelectSession}
      />
      
      {activeSession ? (
        <ChatArea session={activeSession} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#FAFAFA',
    }}>
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <ellipse cx="30" cy="34" rx="18" ry="15" fill="#D9D9D9" />
        <ellipse cx="52" cy="32" rx="18" ry="15" fill="#C8C8C8" />
        <circle cx="24" cy="33" r="3" fill="#B0B0B0" />
        <circle cx="30" cy="33" r="3" fill="#B0B0B0" />
        <circle cx="36" cy="33" r="3" fill="#B0B0B0" />
        <circle cx="46" cy="31" r="3" fill="#A0A0A0" />
        <circle cx="52" cy="31" r="3" fill="#A0A0A0" />
        <circle cx="58" cy="31" r="3" fill="#A0A0A0" />
      </svg>
      <p style={{ color: '#B0B0B0', fontSize: 14, marginTop: 16 }}>选择一个会话开始聊天</p>
    </div>
  );
}
