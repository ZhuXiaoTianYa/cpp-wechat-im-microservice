import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { chatSessionCreate, getFriendList } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import { UserAvatar } from '@/pages/MainLayout';

interface CreateGroupDialogProps {
  onClose: () => void;
}

export default function CreateGroupDialog({ onClose }: CreateGroupDialogProps) {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const friends = useIMStore((state) => Array.from(state.friends.values()));
  
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

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

  const toggleFriend = (userId: string) => {
    const newSelected = new Set(selectedFriends);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedFriends(newSelected);
  };

  const handleCreate = async () => {
    if (!sessionId || !currentUser?.userId) return;
    if (!groupName.trim()) {
      toast.error('请输入群聊名称');
      return;
    }
    if (selectedFriends.size === 0) {
      toast.error('请至少选择一位好友');
      return;
    }

    setCreating(true);
    try {
      const memberIdList = [...selectedFriends, currentUser.userId];
      
      await chatSessionCreate(sessionId, groupName.trim(), memberIdList);
      toast.success('群聊创建成功');
      onClose();
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff',
        width: 400,
        borderRadius: 12,
        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 12,
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: '1px solid #EBEBEB',
          }}
        >
          <h3 style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>发起群聊</h3>
          <button onClick={onClose} style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            background: 'none',
            padding: 0,
            border: 'none',
            cursor: 'pointer',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Group name input */}
        <div style={{ padding: 16, borderBottom: '1px solid #EBEBEB' }}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="群聊名称（必填）"
            style={{
              width: '100%',
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 6,
              background: '#FAFAFA',
              border: '1px solid #EBEBEB',
              color: '#333',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Friends list */}
        <div style={{ flex: 1, maxHeight: 300, overflowY: 'auto', padding: 12 }}>
          <p style={{ color: '#888', fontSize: 12, marginBottom: 8, paddingLeft: 8 }}>
            从好友中选择（已选 {selectedFriends.size} 人）
          </p>
          
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
              <div style={{ color: '#999', fontSize: 13 }}>加载中...</div>
            </div>
          ) : friends.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
              <div style={{ color: '#999', fontSize: 13 }}>暂无好友</div>
            </div>
          ) : (
            <div>
              {friends.map((friend) => {
                const isSelected = selectedFriends.has(friend.userId || '');
                
                return (
                  <div
                    key={friend.userId}
                    onClick={() => friend.userId && toggleFriend(friend.userId)}
                    style={{
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 8,
                      paddingRight: 8,
                      cursor: 'pointer',
                      borderRadius: 6,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#F5F5F5'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {/* Radio button */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid #D9D9D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        background: isSelected ? '#fff' : 'transparent',
                        borderColor: isSelected ? '#07C160' : '#D9D9D9',
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#07C160' }} />
                      )}
                    </div>

                    {/* Avatar */}
                    <UserAvatar
                      color="#07C160"
                      initials={friend.nickname?.charAt(0)?.toUpperCase() || '?'}
                      size={36}
                      imageData={friend.avatar}
                    />

                    {/* Name */}
                    <div style={{ flex: 1, marginLeft: 12 }}>
                      <p style={{ color: '#191919', fontSize: 14 }}>{friend.nickname}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 16,
            borderTop: '1px solid #EBEBEB',
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 6,
              background: '#F5F5F5',
              color: '#666',
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EBEBEB'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedFriends.size === 0 || creating}
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 6,
              background: !groupName.trim() || selectedFriends.size === 0 ? '#E8E8E8' : '#07C160',
              color: !groupName.trim() || selectedFriends.size === 0 ? '#999' : '#fff',
              fontSize: 14,
              border: 'none',
              cursor: (!groupName.trim() || selectedFriends.size === 0) ? 'default' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (groupName.trim() && selectedFriends.size > 0) {
                (e.currentTarget as HTMLButtonElement).style.background = '#06AD56';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = !groupName.trim() || selectedFriends.size === 0 ? '#E8E8E8' : '#07C160';
            }}
          >
            {creating ? '创建中...' : '创建群聊'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
