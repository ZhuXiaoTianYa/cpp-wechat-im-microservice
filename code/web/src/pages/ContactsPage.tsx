/**
 * 联系人页面 - 微信风格
 * 参考 Figma 设计稿
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, UserPlus, X, Plus, Bell, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { getFriendList, friendSearch, friendAdd, getPendingFriendEventList, friendAddProcess, friendRemove } from '@/api/friend';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { handleAPIError } from '@/utils/error-handler';
import { uint8ArrayToBlobURL } from '@/utils/proto-helpers';
import { UserAvatar } from './MainLayout';

type ContactView = 'requests' | string;

export default function ContactsPage() {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const friends = useIMStore((state) => Array.from(state.friends.values()));
  const pendingRequests = useIMStore((state) => state.pendingFriendRequests);
  const [search, setSearch] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<ContactView>('requests');

  useEffect(() => {
    if (sessionId) {
      loadFriends();
      loadPendingRequests();
    }
  }, [sessionId]);

  const loadFriends = async () => {
    if (!sessionId || !currentUser?.userId) return;
    
    setLoading(true);
    try {
      const response = await getFriendList(sessionId, currentUser.userId);
      useIMStore.getState().setFriends(response.friendList || []);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    if (!sessionId || !currentUser?.userId) return;
    
    try {
      const response = await getPendingFriendEventList(sessionId, currentUser.userId);
      useIMStore.getState().setPendingRequests(response.event || []);
    } catch (error) {
      console.error('加载好友申请失败:', error);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    friend.phone?.includes(search)
  );

  const groupedFriends = filteredFriends.reduce((acc, friend) => {
    const firstLetter = friend.nickname?.charAt(0)?.toUpperCase() || '#';
    const letter = /^[A-Z]/.test(firstLetter) ? firstLetter : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(friend);
    return acc;
  }, {} as Record<string, im_server.IUserInfo[]>);

  const sortedLetters = Object.keys(groupedFriends).sort((a, b) => {
    if (a === '#') return -1;
    if (b === '#') return 1;
    return a.localeCompare(b);
  });

  const activeFriend = friends.find((f) => f.userId === activeView);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left panel */}
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
        {/* Title */}
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
          <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>通讯录</span>
          <button
            onClick={() => setShowAddFriend(true)}
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
            title="添加好友"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <UserPlus style={{ width: 16, height: 16, color: '#555' }} />
          </button>
        </div>

        {/* Search */}
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
              placeholder="搜索好友"
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
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Friend Requests entry */}
          <div
            onClick={() => setActiveView('requests')}
            style={{
              height: 58,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              paddingRight: 16,
              cursor: 'pointer',
              background: activeView === 'requests' ? '#C9C7C7' : 'transparent',
              gap: 12,
            }}
            onMouseEnter={(e) => {
              if (activeView !== 'requests') (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'requests') (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: '#07C160',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bell style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>新的朋友</span>
              {pendingRequests.length > 0 && (
                <span
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: '#F5222D',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {pendingRequests.length}
                </span>
              )}
            </div>
          </div>

          {/* Group chats entry */}
          <div
            style={{
              height: 58,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              paddingRight: 16,
              cursor: 'pointer',
              gap: 12,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: '#0984E3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Users style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>群聊</span>
          </div>

          {/* Friends list by initial */}
          {sortedLetters.map((letter) => (
            <div key={letter}>
              <div
                style={{
                  paddingLeft: 16,
                  paddingTop: 4,
                  paddingBottom: 4,
                  color: '#ABABAB',
                  fontSize: 11,
                  fontWeight: 500,
                  background: '#E0DEDE',
                }}
              >
                {letter}
              </div>
              {groupedFriends[letter].map((friend) => (
                <div
                  key={friend.userId}
                  onClick={() => setActiveView(friend.userId || '')}
                  style={{
                    height: 58,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 16,
                    paddingRight: 16,
                    cursor: 'pointer',
                    background: activeView === friend.userId ? '#C9C7C7' : 'transparent',
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    if (activeView !== friend.userId) (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
                  }}
                  onMouseLeave={(e) => {
                    if (activeView !== friend.userId) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  <FriendAvatar friend={friend} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#191919', fontSize: 14 }}>{friend.nickname}</p>
                    {friend.description && (
                      <p style={{ color: '#ABABAB', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {friend.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {friends.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
              <Users style={{ width: 32, height: 32, color: '#D9D9D9' }} />
              <p style={{ color: '#C8C8C8', fontSize: 13 }}>暂无好友</p>
            </div>
          )}
        </div>
      </div>

      {/* Right content */}
      {activeView === 'requests' ? (
        <FriendRequestsPanel 
          requests={pendingRequests} 
          onProcess={loadPendingRequests} 
        />
      ) : activeFriend ? (
        <FriendProfile friend={activeFriend} />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
          <p style={{ color: '#C8C8C8', fontSize: 14 }}>选择一个联系人</p>
        </div>
      )}

      {showAddFriend && (
        <AddFriendDialog
          onClose={() => setShowAddFriend(false)}
          onSuccess={() => {
            setShowAddFriend(false);
            loadFriends();
          }}
        />
      )}
    </div>
  );
}

function FriendAvatar({ friend }: { friend: im_server.IUserInfo }) {
  const hasValidAvatar = friend.avatar && friend.avatar.length > 0;
  const avatarUrl = hasValidAvatar
    ? uint8ArrayToBlobURL(friend.avatar as Uint8Array, 'image/jpeg')
    : null;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return <UserAvatar color="#07C160" initials={friend.nickname?.charAt(0)?.toUpperCase() || '?'} size={42} />;
}

function FriendRequestsPanel({
  requests,
  onProcess,
}: {
  requests: im_server.IFriendEvent[];
  onProcess: () => void;
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#FAFAFA' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 16,
          borderBottom: '1px solid #EBEBEB',
          background: '#FAFAFA',
        }}
      >
        <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>新的好友申请</h2>
      </div>

      {requests.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
          <Bell style={{ width: 40, height: 40, color: '#D9D9D9' }} />
          <p style={{ color: '#ABABAB', fontSize: 13 }}>暂无新的好友申请</p>
        </div>
      ) : (
        <div style={{ background: '#fff', marginTop: 0 }}>
          {requests.map((request) => (
            <FriendRequestItem
              key={request.eventId}
              request={request}
              onProcess={onProcess}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FriendRequestItem({
  request,
  onProcess,
}: {
  request: im_server.IFriendEvent;
  onProcess: () => void;
}) {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (agree: boolean) => {
    console.log('=== handleProcess 开始 ===');
    console.log('sessionId:', sessionId);
    console.log('request.eventId:', request.eventId);
    console.log('request.sender:', request.sender);
    console.log('currentUser:', currentUser);

    if (!sessionId) {
      console.log('❌ 缺少 sessionId');
      return;
    }
    if (!currentUser?.userId) {
      console.log('❌ 缺少 currentUser.userId');
      return;
    }

    console.log('✅ 所有条件都满足，准备发送请求');
    console.log('agree:', agree);
    console.log('applyUserId:', request.sender?.userId || '空');

    setProcessing(true);
    try {
      const applyUserId = request.sender?.userId || '';
      const eventId = request.eventId || '';
      console.log('📤 正在发送请求...');
      console.log('notifyEventId:', eventId);
      await friendAddProcess(sessionId, eventId, agree, applyUserId, currentUser.userId);
      console.log('✅ 请求成功');
      toast.success(agree ? '已同意好友申请' : '已拒绝好友申请');
      onProcess();
    } catch (error) {
      console.log('❌ 请求失败:', error);
      toast.error(handleAPIError(error));
    } finally {
      console.log('=== handleProcess 结束 ===');
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottom: '1px solid #F5F5F5',
        gap: 16,
      }}
    >
      <UserAvatar
        color="#07C160"
        initials={request.sender?.nickname?.charAt(0)?.toUpperCase() || '?'}
        size={50}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>{request.sender?.nickname}</p>
        <p style={{ color: '#ABABAB', fontSize: 12 }}>{request.sender?.description}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => handleProcess(false)}
          disabled={processing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderRadius: 20,
            background: '#F5F5F5',
            color: '#666',
            border: '1px solid #E0E0E0',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <X style={{ width: 12, height: 12 }} />
          拒绝
        </button>
        <button
          onClick={() => handleProcess(true)}
          disabled={processing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderRadius: 20,
            background: '#07C160',
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Check style={{ width: 12, height: 12 }} />
          接受
        </button>
      </div>
    </div>
  );
}

function FriendProfile({ friend }: { friend: im_server.IUserInfo }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const sessions = useIMStore((state) => state.sessions);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    // 查找与该好友的会话
    let foundSessionId: string | null = null;
    sessions.forEach((session, sid) => {
      if (session.singleChatFriendId === friend.userId) {
        foundSessionId = sid;
      }
    });
    
    if (foundSessionId) {
      // 如果存在会话，先切换到该会话，然后导航到聊天页面
      useIMStore.getState().setActiveSession(foundSessionId);
      navigate('/chat');
    } else {
      toast.info('会话不存在，请先发起聊天');
    }
  };

  const handleRemove = () => {
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (!friend.userId || !sessionId || !currentUser?.userId) return;
    
    try {
      const response = await friendRemove(sessionId, friend.userId, currentUser.userId);
      if (response.success) {
        toast.success('好友已删除');
        
        const { removeFriend, removeSession } = useIMStore.getState();
        removeFriend(friend.userId);
        
        // 查找并删除对应的会话
        const sessions = useIMStore.getState().sessions;
        sessions.forEach((session, sessionId) => {
          if (session.singleChatFriendId === friend.userId) {
            removeSession(sessionId);
          }
        });
        
        setShowConfirm(false);
      } else {
        toast.error(response.errmsg || '删除好友失败');
        setShowConfirm(false);
      }
    } catch (error) {
      toast.error(handleAPIError(error));
      setShowConfirm(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#FAFAFA' }}>
      {/* Cover */}
      <div
        style={{
          height: 176,
          position: 'relative',
          flexShrink: 0,
          background: `linear-gradient(135deg, #07C160cc, #07C16088)`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.1)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingLeft: 32, paddingBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div
            style={{
              border: '3px solid rgba(255,255,255,0.9)',
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <UserAvatar
              color="#07C160"
              initials={friend.nickname?.charAt(0)?.toUpperCase() || '?'}
              size={68}
            />
          </div>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 20, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {friend.nickname}
            </h2>
            {friend.description && (
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{friend.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ marginLeft: 16, marginRight: 16, marginTop: 16, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <InfoRow label="手机号" value={friend.phone || '-'} />
        <InfoRow label="用户ID" value={friend.userId || '-'} last />
      </div>

      {/* Actions */}
      <div style={{ marginLeft: 16, marginRight: 16, marginTop: 12, display: 'flex', gap: 12 }}>
        <button
          onClick={handleSendMessage}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 44,
            borderRadius: 12,
            background: '#07C160',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="8.5" cy="11" r="1" fill="#fff" />
            <circle cx="12" cy="11" r="1" fill="#fff" />
            <circle cx="15.5" cy="11" r="1" fill="#fff" />
          </svg>
          发消息
        </button>
        <button
          onClick={handleRemove}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingLeft: 20,
            paddingRight: 20,
            height: 44,
            borderRadius: 12,
            background: '#fff',
            color: '#D4183D',
            border: '1px solid #FFCCC7',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#D4183D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="5" x2="12" y2="19" stroke="#D4183D" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          删除
        </button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          title={`删除"${friend.nickname || ''}"?`}
          avatar={
            <UserAvatar
              color="#07C160"
              initials={friend.nickname?.charAt(0)?.toUpperCase() || '?'}
              size={48}
              imageData={friend.avatar}
            />
          }
          subtitle={friend.nickname || undefined}
          confirmText="删除"
          onConfirm={confirmRemove}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 14,
        paddingBottom: 14,
        borderBottom: last ? 'none' : '1px solid #F5F5F5',
      }}
    >
      <span style={{ width: 80, flexShrink: 0, color: '#ABABAB', fontSize: 13 }}>{label}</span>
      <span style={{ flex: 1, color: '#333', fontSize: 14 }}>{value}</span>
    </div>
  );
}

function AddFriendDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState<im_server.IUserInfo[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchKey.trim() || !sessionId || !currentUser?.userId) return;
    
    setSearching(true);
    try {
      const response = await friendSearch(sessionId, searchKey, currentUser.userId);
      setSearchResults(response.userInfo || []);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (userId: string) => {
    if (!sessionId || !currentUser?.userId) return;
    
    try {
      await friendAdd(sessionId, userId, currentUser.userId);
      toast.success('好友申请已发送');
      onSuccess();
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', width: 420, borderRadius: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>添加好友</h3>
          <button onClick={onClose} style={{ color: '#999', background: 'none', padding: 0, border: 'none', cursor: 'pointer' }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flex: 1,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 8,
                background: '#F7F7F7',
                border: '1px solid #EBEBEB',
                height: 40,
              }}
            >
              <Search style={{ width: 16, height: 16, color: '#999' }} />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索昵称或手机号"
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 14,
                }}
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              style={{
                borderRadius: 8,
                background: '#07C160',
                color: '#fff',
                fontSize: 14,
                paddingLeft: 16,
                paddingRight: 16,
                height: 40,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              搜索
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 8,
                    background: '#F7F7F7',
                    gap: 12,
                  }}
                >
                  <UserAvatar color="#07C160" initials={user.nickname?.charAt(0)?.toUpperCase() || '?'} size={46} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>{user.nickname}</p>
                    <p style={{ color: '#999', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.description}
                    </p>
                  </div>
                  <button
                    onClick={() => user.userId && handleAdd(user.userId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      paddingLeft: 12,
                      paddingRight: 12,
                      paddingTop: 6,
                      paddingBottom: 6,
                      borderRadius: 20,
                      background: '#07C160',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus style={{ width: 12, height: 12 }} />
                    添加
                  </button>
                </div>
              ))}
            </div>
          ) : searchKey && !searching ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, gap: 8 }}>
              <AlertCircleIcon style={{ width: 32, height: 32, color: '#ddd' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>未找到相关用户</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, gap: 8 }}>
              <Search style={{ width: 32, height: 32, color: '#ddd' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>输入昵称或手机号搜索</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}