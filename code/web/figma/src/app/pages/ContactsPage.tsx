import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, UserPlus, UserMinus, MessageSquare, Bell,
  ChevronRight, Check, X, Users, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserInfo, formatTime } from '../data/mockData';
import { UserAvatar } from './MainLayout';
import { ApiTag, ApiTooltip } from '../components/common/ApiTag';

// ─── Search User Dialog ───────────────────────────────────────────
function SearchUserDialog({ onClose }: { onClose: () => void }) {
  const { showApiAnnotations } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setResults([
      {
        user_id: 'user_search_01',
        nickname: `${query}的用户`,
        description: '热爱技术，乐于分享',
        phone: '138****8888',
        avatar_color: '#6C5CE7',
        avatar_initials: query.charAt(0) || '用',
      },
    ]);
    setLoading(false);
  };

  const handleAddFriend = (userId: string) => {
    setRequested((prev) => new Set([...prev, userId]));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="overflow-hidden"
        style={{ background: '#fff', width: 420, borderRadius: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>添加好友</h3>
          <button onClick={onClose} style={{ color: '#999', background: 'none', padding: 0 }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {showApiAnnotations && (
            <div className="mb-3">
              <ApiTag endpoint="/service/friend/search_friend" params="search_key（昵称/手机号）" />
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <div
              className="flex items-center gap-2 flex-1 px-3 rounded-lg"
              style={{ background: '#F7F7F7', border: '1px solid #EBEBEB', height: 40 }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#999' }} />
              <input
                type="text"
                placeholder="搜索昵称或手机号"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#333', fontSize: 14 }}
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-lg px-4"
              style={{ background: '#07C160', color: '#fff', fontSize: 14, height: 40 }}
            >
              搜索
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div
                className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: '#07C160', borderTopColor: 'transparent' }}
              />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: '#F7F7F7' }}
                >
                  <UserAvatar color={user.avatar_color} initials={user.avatar_initials} size={46} />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>{user.nickname}</p>
                    <p className="truncate" style={{ color: '#999', fontSize: 12 }}>{user.description}</p>
                  </div>
                  {showApiAnnotations && (
                    <ApiTag endpoint="/service/friend/add_friend_apply" params="respondent_id" />
                  )}
                  {requested.has(user.user_id) ? (
                    <span
                      className="px-3 py-1 rounded-full"
                      style={{ background: '#E8F5E9', color: '#07C160', fontSize: 12 }}
                    >
                      已发送
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(user.user_id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                      style={{ background: '#07C160', color: '#fff', fontSize: 12, fontWeight: 500 }}
                    >
                      <UserPlus className="w-3 h-3" />
                      添加
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <AlertCircle className="w-8 h-8" style={{ color: '#ddd' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>未找到相关用户</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 gap-2">
              <Search className="w-8 h-8" style={{ color: '#ddd' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>输入昵称或手机号搜索</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Friend Requests Panel ────────────────────────────────────────
function FriendRequestsPanel() {
  const { friendRequests, acceptFriendRequest, rejectFriendRequest, showApiAnnotations } = useApp();

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#F7F7F7' }}>
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #EBEBEB', background: '#fff' }}
      >
        <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>新的好友申请</h2>
        {showApiAnnotations && (
          <ApiTag endpoint="/service/friend/get_pending_friend_events" params="session_id" />
        )}
      </div>

      {friendRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3">
          <Bell className="w-10 h-10" style={{ color: '#D9D9D9' }} />
          <p style={{ color: '#ABABAB', fontSize: 13 }}>暂无新的好友申请</p>
        </div>
      ) : (
        <div className="bg-white mt-0">
          {friendRequests.map((req) => (
            <div
              key={req.event_id}
              className="flex items-center gap-4 px-6 py-4"
              style={{ borderBottom: '1px solid #F5F5F5' }}
            >
              <UserAvatar color={req.sender.avatar_color} initials={req.sender.avatar_initials} size={50} />
              <div className="flex-1 min-w-0">
                <p style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>{req.sender.nickname}</p>
                <p style={{ color: '#ABABAB', fontSize: 12 }}>{req.sender.description}</p>
                <p style={{ color: '#C8C8C8', fontSize: 11 }}>{formatTime(req.timestamp)}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                {showApiAnnotations && (
                  <ApiTag endpoint="/service/friend/add_friend_process" params="apply_user_id, process_result" />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectFriendRequest(req.event_id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ background: '#F5F5F5', color: '#666', border: '1px solid #E0E0E0', fontSize: 12 }}
                  >
                    <X className="w-3 h-3" />
                    拒绝
                  </button>
                  <button
                    onClick={() => acceptFriendRequest(req.event_id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ background: '#07C160', color: '#fff', fontSize: 12, fontWeight: 500 }}
                  >
                    <Check className="w-3 h-3" />
                    接受
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Friend Profile Panel ─────────────────────────────────────────
function FriendProfile({
  friend,
  onChat,
  onRemove,
}: {
  friend: UserInfo;
  onChat: () => void;
  onRemove: () => void;
}) {
  const { showApiAnnotations } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#F7F7F7' }}>
      {/* Cover */}
      <div
        className="h-44 relative flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${friend.avatar_color}cc, ${friend.avatar_color}88)`,
        }}
      >
        {/* Blur overlay */}
        <div
          className="absolute inset-0"
          style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.1)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-5 flex items-end gap-4">
          <div
            style={{
              border: '3px solid rgba(255,255,255,0.9)',
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <UserAvatar
              color={friend.avatar_color}
              initials={friend.avatar_initials}
              size={68}
            />
          </div>
          <div className="pb-0.5">
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
      <div className="mx-4 mt-4 rounded-xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <InfoRow label="手机号" value={friend.phone} />
        <InfoRow label="用户ID" value={friend.user_id} last />
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3 flex gap-3">
        {showApiAnnotations && (
          <ApiTag endpoint="/service/friend/get_chat_session_list" params="session_id（进入对应单聊）" />
        )}
        <button
          onClick={onChat}
          className="flex items-center gap-2 flex-1 justify-center rounded-xl"
          style={{ background: '#07C160', color: '#fff', height: 44, fontSize: 14, fontWeight: 500 }}
        >
          <MessageSquare className="w-4 h-4" />
          发消息
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-5 rounded-xl"
          style={{ background: '#fff', color: '#D4183D', border: '1px solid #FFCCC7', height: 44, fontSize: 14 }}
        >
          <UserMinus className="w-4 h-4" />
          删除
        </button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <div
            className="rounded-xl shadow-2xl p-6"
            style={{ background: '#fff', width: 320 }}
          >
            <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              删除好友
            </h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              确认删除好友「{friend.nickname}」？删除后将同时清除对应会话记录。
            </p>
            {showApiAnnotations && (
              <div className="mb-4">
                <ApiTag endpoint="/service/friend/remove_friend" params="friend_id" />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg"
                style={{ background: '#F5F5F5', color: '#666', height: 40, fontSize: 14 }}
              >
                取消
              </button>
              <button
                onClick={() => { onRemove(); setShowConfirm(false); }}
                className="flex-1 rounded-lg"
                style={{ background: '#D4183D', color: '#fff', height: 40, fontSize: 14, fontWeight: 500 }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center px-5 py-3.5"
      style={{ borderBottom: last ? 'none' : '1px solid #F5F5F5' }}
    >
      <span className="w-20 flex-shrink-0" style={{ color: '#ABABAB', fontSize: 13 }}>{label}</span>
      <span className="flex-1" style={{ color: '#333', fontSize: 14 }}>{value}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
type ContactView = 'requests' | string;

export default function ContactsPage() {
  const { friends, friendRequests, sessions, setActiveSession, removeFriend, showApiAnnotations } = useApp();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ContactView>('requests');
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const handleChat = (friend: UserInfo) => {
    const session = sessions.find(
      (s) => s.session_type === 0 && s.member_ids.includes(friend.user_id)
    );
    if (session) {
      setActiveSession(session.session_id);
      navigate(`/chat/${session.session_id}`);
    } else {
      navigate('/chat');
    }
  };

  const handleRemove = (userId: string) => {
    removeFriend(userId);
    setActiveView('requests');
  };

  const filteredFriends = localSearch
    ? friends.filter((f) =>
        f.nickname.toLowerCase().includes(localSearch.toLowerCase())
      )
    : friends;

  const grouped: Record<string, UserInfo[]> = {};
  filteredFriends.forEach((f) => {
    const key = f.nickname.charAt(0).toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  });
  const sortedKeys = Object.keys(grouped).sort();
  const activeFriend = friends.find((f) => f.user_id === activeView);

  return (
    <>
      {/* Left panel */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{ width: 280, background: '#EBE9E9', borderRight: '1px solid #D9D9D9' }}
      >
        {/* Title */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0"
          style={{ minHeight: 54 }}
        >
          <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>通讯录</span>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center justify-center rounded-md transition-colors hover:bg-black/10"
            style={{ width: 28, height: 28 }}
            title="添加好友"
          >
            <UserPlus className="w-4 h-4" style={{ color: '#555' }} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2 flex-shrink-0">
          <div
            className="flex items-center gap-2 px-3 rounded-md"
            style={{ background: 'rgba(0,0,0,0.1)', height: 30 }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#888' }} />
            <input
              type="text"
              placeholder="搜索好友"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{ color: '#333', fontSize: 13 }}
            />
          </div>
          {showApiAnnotations && (
            <div className="mt-1.5">
              <ApiTag endpoint="/service/friend/get_friend_list" params="session_id" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Friend Requests entry */}
          <div
            onClick={() => setActiveView('requests')}
            className="flex items-center gap-3 px-4 cursor-pointer"
            style={{
              height: 58,
              background: activeView === 'requests' ? '#C9C7C7' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (activeView !== 'requests') (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'requests') (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 46, height: 46, borderRadius: 10, background: '#07C160' }}
            >
              <Bell className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>新的朋友</span>
              {friendRequests.length > 0 && (
                <span
                  className="flex items-center justify-center text-white"
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: '#F5222D',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '0 4px',
                  }}
                >
                  {friendRequests.length}
                </span>
              )}
            </div>
          </div>

          {/* Group chats entry */}
          <div
            className="flex items-center gap-3 px-4 cursor-pointer"
            style={{ height: 58 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 46, height: 46, borderRadius: 10, background: '#0984E3' }}
            >
              <Users className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <span style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}>群聊</span>
          </div>

          {/* Friends list by initial */}
          {sortedKeys.map((key) => (
            <div key={key}>
              <div
                className="px-4 py-1"
                style={{ color: '#ABABAB', fontSize: 11, fontWeight: 500, background: '#E0DEDE' }}
              >
                {key}
              </div>
              {grouped[key].map((friend) => (
                <div
                  key={friend.user_id}
                  onClick={() => setActiveView(friend.user_id)}
                  className="flex items-center gap-3 px-4 cursor-pointer"
                  style={{
                    height: 58,
                    background: activeView === friend.user_id ? '#C9C7C7' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeView !== friend.user_id) (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
                  }}
                  onMouseLeave={(e) => {
                    if (activeView !== friend.user_id) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  <UserAvatar color={friend.avatar_color} initials={friend.avatar_initials} size={42} />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#191919', fontSize: 14 }}>{friend.nickname}</p>
                    {friend.description && (
                      <p className="truncate" style={{ color: '#ABABAB', fontSize: 11 }}>{friend.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {friends.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Users className="w-8 h-8" style={{ color: '#D9D9D9' }} />
              <p style={{ color: '#C8C8C8', fontSize: 13 }}>暂无好友</p>
            </div>
          )}
        </div>
      </div>

      {/* Right content */}
      {activeView === 'requests' ? (
        <FriendRequestsPanel />
      ) : activeFriend ? (
        <FriendProfile
          friend={activeFriend}
          onChat={() => handleChat(activeFriend)}
          onRemove={() => handleRemove(activeFriend.user_id)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center" style={{ background: '#F7F7F7' }}>
          <p style={{ color: '#C8C8C8', fontSize: 14 }}>选择一个联系人</p>
        </div>
      )}

      {showSearch && <SearchUserDialog onClose={() => setShowSearch(false)} />}
    </>
  );
}
