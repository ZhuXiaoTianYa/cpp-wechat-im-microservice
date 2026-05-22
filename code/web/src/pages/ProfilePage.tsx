/**
 * 个人资料页面 - 微信风格
 * 参考 Figma 设计稿
 */
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Edit2, Phone, Mail, User as UserIcon, ChevronRight, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { setUserAvatar, setUserNickname, setUserDescription, getUserInfo } from '@/api/user';
import { getFriendList, getChatSessionList } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import { fileToUint8Array } from '@/utils/proto-helpers';
import { UserAvatar } from './MainLayout';
import { ChangePhoneModal } from '@/components/profile/ChangePhoneModal';

type EditField = 'nickname' | 'description' | null;

export default function ProfilePage() {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const [editing, setEditing] = useState<EditField>(null);
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [description, setDescription] = useState(currentUser?.description || '');
  const [uploading, setUploading] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [friendCount, setFriendCount] = useState<number | null>(null);
  const [groupCount, setGroupCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!sessionId || !currentUser?.userId) {
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);

      // 获取好友数量
      try {
        const friendRsp = await getFriendList(sessionId, currentUser.userId);
        if (friendRsp.success) {
          setFriendCount(friendRsp.friendList?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch friend list:', error);
      }

      // 获取群聊数量
      try {
        const sessionRsp = await getChatSessionList(sessionId);
        if (sessionRsp.success && sessionRsp.chatSessionInfoList) {
          // 群聊会话的 single_chat_friend_id 字段为空
          const groupSessions = sessionRsp.chatSessionInfoList.filter(
            (session) => !session.singleChatFriendId
          );
          setGroupCount(groupSessions.length);
        }
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
      }

      setLoadingStats(false);
    };

    fetchStats();
  }, [sessionId, currentUser?.userId]);

  const handlePhoneChangeSuccess = async () => {
    if (!sessionId) return;
    try {
      const rsp = await getUserInfo(sessionId);
      if (rsp.success && rsp.userInfo) {
        useIMStore.getState().updateCurrentUser({
          phone: rsp.userInfo.phone,
        });
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      const avatarData = await fileToUint8Array(file);
      await setUserAvatar(sessionId, avatarData);
      
      useIMStore.getState().updateCurrentUser({ avatar: avatarData });
      toast.success('头像更新成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!nickname.trim() || !sessionId) return;

    try {
      await setUserNickname(sessionId, nickname);
      useIMStore.getState().updateCurrentUser({ nickname });
      setEditing(null);
      toast.success('昵称更新成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleSaveDescription = async () => {
    if (!sessionId) return;

    try {
      await setUserDescription(sessionId, description);
      useIMStore.getState().updateCurrentUser({ description });
      setEditing(null);
      toast.success('个性签名更新成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left sidebar */}
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
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>我</span>
        </div>

        {/* Avatar + info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, paddingBottom: 32, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <UserAvatar
              color="#07C160"
              initials={currentUser?.nickname?.charAt(0)?.toUpperCase() || '?'}
              size={80}
              imageData={currentUser?.avatar}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#07C160',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                cursor: 'pointer',
              }}
              title="修改头像"
            >
              <Camera style={{ width: 12, height: 12, color: '#fff' }} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>

          <h2 style={{ color: '#191919', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
            {currentUser?.nickname}
          </h2>
          <p style={{ color: '#ABABAB', fontSize: 12, textAlign: 'center' }}>
            {currentUser?.description || '暂未设置个性签名'}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 12,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Users style={{ width: 16, height: 16, color: '#07C160' }} />
              <span style={{ color: '#191919', fontSize: 18, fontWeight: 600 }}>
                {loadingStats ? '...' : friendCount !== null ? friendCount : '-'}
              </span>
            </div>
            <span style={{ color: '#ABABAB', fontSize: 11 }}>好友</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <MessageSquare style={{ width: 16, height: 16, color: '#74B9FF' }} />
              <span style={{ color: '#191919', fontSize: 18, fontWeight: 600 }}>
                {loadingStats ? '...' : groupCount !== null ? groupCount : '-'}
              </span>
            </div>
            <span style={{ color: '#ABABAB', fontSize: 11 }}>群聊</span>
          </div>
        </div>

        {/* User info */}
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <p style={{ color: '#BEBEBE', fontSize: 11 }}>ID: {currentUser?.userId}</p>
          <p style={{ color: '#BEBEBE', fontSize: 11 }}>手机: {currentUser?.phone || '未绑定'}</p>
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', paddingTop: 24, paddingLeft: 24, paddingRight: 24 }}>
          <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>个人资料</h2>

          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: 20,
            }}
          >
            <ProfileRow
              icon={<UserIcon style={{ width: 16, height: 16, color: '#fff' }} />}
              iconBg="#07C160"
              label="昵称"
              value={currentUser?.nickname || ''}
              onClick={() => setEditing('nickname')}
              editing={editing === 'nickname'}
              editValue={nickname}
              setEditValue={setNickname}
              onSave={handleSaveNickname}
              onCancel={() => { setEditing(null); setNickname(currentUser?.nickname || ''); }}
            />
            <ProfileRow
              icon={<Mail style={{ width: 16, height: 16, color: '#fff' }} />}
              iconBg="#74B9FF"
              label="个性签名"
              value={currentUser?.description || '暂未设置'}
              onClick={() => setEditing('description')}
              editing={editing === 'description'}
              editValue={description}
              setEditValue={setDescription}
              onSave={handleSaveDescription}
              onCancel={() => { setEditing(null); setDescription(currentUser?.description || ''); }}
            />
            <ProfileRow
              icon={<Phone style={{ width: 16, height: 16, color: '#fff' }} />}
              iconBg="#FDCB6E"
              label="手机号"
              value={currentUser?.phone || '未绑定'}
              onClick={() => setShowChangePhoneModal(true)}
            />
          </div>

          <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>账号安全</h2>

          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingTop: 14, paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 style={{ width: 16, height: 16, color: '#fff' }} />
                </div>
                <span style={{ color: '#333', fontSize: 14 }}>登录密码</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#ABABAB', fontSize: 13 }}>已设置</span>
                <ChevronRight style={{ width: 16, height: 16, color: '#D9D9D9' }} />
              </div>
            </div>
          </div>

          {/* System info */}
          <div
            style={{
              borderRadius: 12,
              padding: 16,
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <p style={{ color: '#ABABAB', fontSize: 12 }}>即时通讯系统 v1.0.0</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>API：http://211.159.146.107:9000</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>WebSocket：ws://211.159.146.107:9001</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>协议：HTTP + Protobuf / WebSocket + Protobuf</p>
          </div>
        </div>
      </div>

      {/* Change phone modal */}
      <ChangePhoneModal
        isOpen={showChangePhoneModal}
        onClose={() => setShowChangePhoneModal(false)}
        sessionId={sessionId || ''}
        currentPhone={currentUser?.phone || ''}
        onSuccess={handlePhoneChangeSuccess}
      />
    </div>
  );
}

function ProfileRow({
  icon,
  iconBg,
  label,
  value,
  onClick,
  editing = false,
  editValue = '',
  setEditValue,
  onSave,
  onCancel,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  onClick?: () => void;
  editing?: boolean;
  editValue?: string;
  setEditValue?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      onClick={!editing ? onClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 14,
        paddingBottom: 14,
        borderBottom: '1px solid #F5F5F5',
        cursor: onClick && !editing ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (onClick && !editing) (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = '#fff';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ color: '#333', fontSize: 14 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing && setEditValue && onSave && onCancel ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                background: '#F7F7F7',
                border: '1px solid #EBEBEB',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                color: '#333',
                outline: 'none',
                width: 150,
              }}
              autoFocus
            />
            <button
              onClick={onSave}
              style={{
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 6,
                background: '#07C160',
                color: '#fff',
                fontSize: 12,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              保存
            </button>
            <button
              onClick={onCancel}
              style={{
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 6,
                background: '#F0F0F0',
                color: '#666',
                fontSize: 12,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
          </div>
        ) : (
          <>
            <span style={{ color: '#ABABAB', fontSize: 13 }}>{value}</span>
            {onClick && !editing && <ChevronRight style={{ width: 16, height: 16, color: '#D9D9D9' }} />}
          </>
        )}
      </div>
    </div>
  );
}