/**
 * 会话列表组件 - 微信风格
 * 参考 Figma 设计稿
 */
import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, X, Users } from 'lucide-react';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { getChatSessionList } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import { formatMessageTime, getMessagePreview } from '@/utils/format';
import { toast } from 'sonner';
import { UserAvatar } from '@/pages/MainLayout';
import CreateGroupDialog from './CreateGroupDialog';

export default function SessionList({ onSelectSession }: { onSelectSession: (session: im_server.IChatSessionInfo) => void }) {
  const sessionId = useIMStore((state) => state.sessionId);
  const sessions = useIMStore((state) => Array.from(state.sessions.values()));
  const unreadCounts = useIMStore((state) => state.unreadCount);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadSessions();
    }
  }, [sessionId]);

  const loadSessions = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const response = await getChatSessionList(sessionId);
      useIMStore.getState().setSessions(response.chatSessionInfoList || []);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const sortedSessions = useMemo(() => {
    const filtered = sessions.filter((s) =>
      s.chatSessionName?.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const timeA = Number(a.prevMessage?.timestamp) || 0;
      const timeB = Number(b.prevMessage?.timestamp) || 0;
      return timeB - timeA;
    });
  }, [sessions, search]);

  return (
    <div
      style={{
        width: 280,
        background: '#EEEEF0',
        borderRight: '1px solid #D1D1D6',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Panel title + create button */}
      <div
        style={{
          minHeight: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>消息</span>
        <button
          onClick={() => setShowCreateGroup(true)}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          title="发起群聊"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <Plus style={{ width: 16, height: 16, color: '#555' }} />
        </button>
      </div>

      {/* Search bar */}
      <div style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 6,
            background: 'rgba(0,0,0,0.1)',
            height: 30,
            gap: 8,
          }}
        >
          <Search style={{ width: 14, height: 14, color: '#888', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="搜索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              outline: 'none',
              border: 'none',
              color: '#333',
              fontSize: 13,
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              color: '#999',
              background: 'none',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
            }}>
              <X style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
      </div>

      {/* Session items */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
            <div style={{ color: '#999', fontSize: 12 }}>加载中...</div>
          </div>
        ) : sortedSessions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="#ccc" strokeWidth="1.5" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="#ccc" strokeWidth="1.5" />
            </svg>
            <p style={{ color: '#bbb', fontSize: 13 }}>暂无会话</p>
          </div>
        ) : (
          <div>
            {sortedSessions.map((session) => {
              const unread = unreadCounts.get(session.chatSessionId || '') || 0;
              const isActive = useIMStore.getState().activeSessionId === session.chatSessionId;
              return (
                <SessionItem
                  key={session.chatSessionId}
                  session={session}
                  isActive={isActive}
                  unread={unread}
                  onClick={() => onSelectSession(session)}
                />
              );
            })}
          </div>
        )}
      </div>
      {showCreateGroup && <CreateGroupDialog onClose={() => setShowCreateGroup(false)} />}
    </div>
  );
}

function SessionItem({
  session,
  isActive,
  unread,
  onClick,
}: {
  session: im_server.IChatSessionInfo;
  isActive: boolean;
  unread: number;
  onClick: () => void;
}) {
  const avatarInitials = session.chatSessionName?.charAt(0)?.toUpperCase() || '?';
  const preview = getMessagePreview(session.prevMessage?.message);
  const isGroup = !session.singleChatFriendId;
  const senderPrefix = isGroup && session.prevMessage ? `${session.prevMessage.sender?.nickname}：` : '';

  return (
    <div
      onClick={onClick}
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        cursor: 'pointer',
        background: isActive ? '#C9C7C7' : 'transparent',
        position: 'relative',
        gap: 12,
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <UserAvatar 
          color="#07C160" 
          initials={avatarInitials} 
          size={46}
          imageData={session.avatar}
        />
        {isGroup && (
          <div style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: 14,
            height: 14,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#07C160',
          }}>
            <Users style={{ width: 10, height: 10, color: '#fff' }} />
          </div>
        )}
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            background: '#F5222D',
            color: '#fff',
            fontSize: 9,
            fontWeight: 700,
            padding: '0 3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
          <span style={{
            color: '#191919',
            fontSize: 14,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {session.chatSessionName}
          </span>
          <span style={{
            color: '#ABABAB',
            fontSize: 11,
            flexShrink: 0,
            marginLeft: 8,
          }}>
            {session.prevMessage?.timestamp ? formatMessageTime(Number(session.prevMessage.timestamp)) : ''}
          </span>
        </div>
        <span style={{
          color: '#ABABAB',
          fontSize: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 180,
          display: 'block',
        }}>
          {senderPrefix}{preview || '\u00A0'}
        </span>
      </div>
    </div>
  );
}