/**
 * 聊天信息面板组件 - 微信风格
 * 包含查找聊天内容功能，支持群聊和私聊
 */
import { Search, X, ChevronRight, Users, Image as ImageIcon, FileIcon, Download, Play, Pause } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { UserAvatar } from '@/pages/MainLayout';
import { msgSearch, getHistoryMsg } from '@/api/message';
import { uint8ArrayToBlobURL } from '@/utils/proto-helpers';
import { getSingleFile } from '@/api/file';
import { getChatSessionMember, friendRemove } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface ChatInfoPanelProps {
  session: im_server.IChatSessionInfo;
  onClose: () => void;
}

interface SearchResult {
  message: im_server.IMessageInfo;
  preview: string;
  messageType: im_server.MessageType;
}

export default function ChatInfoPanel({ session, onClose }: ChatInfoPanelProps) {
  const [showSearchContent, setShowSearchContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [imageThumbnails, setImageThumbnails] = useState<Record<string, string>>({});
  const [groupMembers, setGroupMembers] = useState<im_server.IUserInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const messagesStore = useIMStore((state) => state.messages);
  const friends = useIMStore((state) => state.friends);
  const messages = session.chatSessionId ? messagesStore.get(session.chatSessionId) || [] : [];
  
  const isGroup = !session.singleChatFriendId;
  const panelRef = useRef<HTMLDivElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 加载群成员列表
  useEffect(() => {
    if (isGroup && session.chatSessionId && sessionId) {
      loadGroupMembers();
    }
  }, [isGroup, session.chatSessionId, sessionId]);

  const loadGroupMembers = async () => {
    if (!sessionId || !session.chatSessionId) return;
    
    setMembersLoading(true);
    try {
      const response = await getChatSessionMember(sessionId, session.chatSessionId);
      if (response.success && response.memberInfoList) {
        setGroupMembers(response.memberInfoList);
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setMembersLoading(false);
    }
  };

  const handleRemoveFriend = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemoveFriend = async () => {
    if (!sessionId || !currentUser?.userId || !session.singleChatFriendId) return;
    
    try {
      const response = await friendRemove(sessionId, session.singleChatFriendId, currentUser.userId);
      if (response.success) {
        toast.success('删除好友成功');
        
        const { removeSession, removeFriend } = useIMStore.getState();
        
        if (session.chatSessionId) {
          removeSession(session.chatSessionId);
        }
        
        removeFriend(session.singleChatFriendId);
        
        setShowRemoveConfirm(false);
        onClose();
      } else {
        toast.error(response.errmsg || '删除好友失败');
        setShowRemoveConfirm(false);
      }
    } catch (error) {
      toast.error(handleAPIError(error));
      setShowRemoveConfirm(false);
    }
  };

  const handleLeaveGroup = async () => {
    setShowRemoveConfirm(true);
  };

  const confirmLeaveGroup = () => {
    toast.warning('退出群聊功能开发中');
    setShowRemoveConfirm(false);
  };

  useEffect(() => {
    const loadImageThumbnails = async () => {
      const newThumbnails: Record<string, string> = {};
      for (const result of searchResults) {
        if (result.messageType === im_server.MessageType.IMAGE && result.message.messageId) {
          if (imageThumbnails[result.message.messageId]) continue;
          const imgMsg = result.message.message?.imageMessage;
          if (imgMsg?.imageContent) {
            newThumbnails[result.message.messageId] = uint8ArrayToBlobURL(imgMsg.imageContent as Uint8Array, 'image/jpeg');
          } else if (imgMsg?.fileId && sessionId) {
            try {
              const response = await getSingleFile(sessionId, imgMsg.fileId);
              if (response.success && response.fileData?.fileContent) {
                newThumbnails[result.message.messageId] = uint8ArrayToBlobURL(response.fileData.fileContent as Uint8Array, 'image/jpeg');
              }
            } catch (error) {
              console.error('加载图片缩略图失败:', error);
            }
          }
        }
      }
      if (Object.keys(newThumbnails).length > 0) {
        setImageThumbnails(prev => ({ ...prev, ...newThumbnails }));
      }
    };
    if (searchResults.length > 0) {
      loadImageThumbnails();
    }
    return () => {
      Object.values(imageThumbnails).forEach(url => URL.revokeObjectURL(url));
    };
  }, [searchResults, sessionId]);

  const getMessagePreview = (msg: im_server.IMessageInfo): { preview: string; messageType: im_server.MessageType } => {
    const msgType = msg.message?.messageType;
    switch (msgType) {
      case im_server.MessageType.STRING:
        return {
          preview: msg.message?.stringMessage?.content?.slice(0, 50) + (msg.message?.stringMessage?.content && msg.message.stringMessage.content.length > 50 ? '...' : '') || '[文字消息]',
          messageType: msgType,
        };
      case im_server.MessageType.IMAGE:
        return { preview: '[图片]', messageType: msgType };
      case im_server.MessageType.FILE:
        return {
          preview: `[文件] ${msg.message?.fileMessage?.fileName || '未命名文件'}`,
          messageType: msgType,
        };
      case im_server.MessageType.SPEECH:
        return { preview: '[语音消息]', messageType: msgType };
      default:
        return { preview: '[未知消息]', messageType: msgType || 0 };
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !sessionId || !session.chatSessionId) return;
    
    setSearchLoading(true);
    setSearchTriggered(true);
    try {
      const response = await msgSearch(sessionId, session.chatSessionId, searchQuery);
      const filtered = (response.msgList || []).map((m: im_server.IMessageInfo) => {
        const { preview, messageType } = getMessagePreview(m);
        return { message: m, preview, messageType };
      });
      setSearchResults(filtered);
    } catch (error) {
      console.error('搜索失败:', error);
      const filtered = messages
        .filter((m: im_server.IMessageInfo) => {
          if (!m.message) return false;
          if (m.message.messageType === im_server.MessageType.STRING) {
            return m.message.stringMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        })
        .map((m: im_server.IMessageInfo) => {
          const { preview, messageType } = getMessagePreview(m);
          return { message: m, preview, messageType };
        });
      setSearchResults(filtered);
    } finally {
      setSearchLoading(false);
    }
  }, [sessionId, session.chatSessionId, messages, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  const confirmDateSearch = async () => {
    setSearchLoading(true);
    setSearchTriggered(true);
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      
      const startTime = Math.floor(new Date(year, month, day, 0, 0, 0).getTime() / 1000);
      const overTime = Math.floor(new Date(year, month, day, 23, 59, 59).getTime() / 1000);
      
      const response = await getHistoryMsg(sessionId || '', session.chatSessionId || '', startTime, overTime, currentUser?.userId || '');
      const filtered = (response.msgList || []).map((m: im_server.IMessageInfo) => {
        const { preview, messageType } = getMessagePreview(m);
        return { message: m, preview, messageType };
      });
      setSearchResults(filtered);
      setSearchQuery(`${month + 1}月${day}日`);
    } catch (error) {
      console.error('日期搜索失败:', error);
    } finally {
      setSearchLoading(false);
      setShowDatePicker(false);
    }
  };

  const renderDatePicker = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <button
          key={i}
          onClick={() => handleDateSelect(i)}
          style={{
            width: 36,
            height: 32,
            border: 'none',
            background: selectedDate.getDate() === i ? '#07C160' : 'transparent',
            color: selectedDate.getDate() === i ? '#fff' : '#333',
            borderRadius: selectedDate.getDate() === i ? '50%' : 'none',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{
        position: 'absolute',
        right: 16,
        top: 100,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        padding: 12,
        zIndex: 100,
        minWidth: 250,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button
            onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#07C160', fontSize: 14 }}
          >
            {'<'}
          </button>
          <span style={{ fontWeight: 600, color: '#191919', fontSize: 14 }}>
            {year}年 {month + 1}月
          </span>
          <button
            onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#07C160', fontSize: 14 }}
          >
            {'>'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 10 }}>
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} style={{ textAlign: 'center', color: '#999', fontSize: 11 }}>{day}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {days}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowDatePicker(false)}
            style={{
              padding: '4px 12px',
              border: '1px solid #E5E5E5',
              borderRadius: 16,
              background: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            取消
          </button>
          <button
            onClick={confirmDateSearch}
            style={{
              padding: '4px 12px',
              border: 'none',
              borderRadius: 16,
              background: '#07C160',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            确定
          </button>
        </div>
      </div>
    );
  };

  const handleSearchModalClick = (e: React.MouseEvent) => {
    if (e.target === searchModalRef.current) {
      setShowSearchContent(false);
    }
  };

  const renderSearchContent = () => {
    return (
      <div 
        ref={searchModalRef}
        onClick={handleSearchModalClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 60,
        }}
      >
        <div style={{
          width: 480,
          maxHeight: '80vh',
          background: '#EEEEF0',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}>
          {/* 标题栏 */}
          <div style={{
            background: '#fff',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E5E5',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#191919' }}>
              与"{session.chatSessionName}"的聊天记录
            </span>
            <button
              onClick={() => setShowSearchContent(false)}
              style={{
                width: 28,
                height: 28,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X style={{ width: 18, height: 18, color: '#888' }} />
            </button>
          </div>

          {/* 搜索栏 */}
          <div style={{
            background: '#fff',
            padding: '10px 16px',
            borderBottom: '1px solid #E5E5E5',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#EDEDED',
                borderRadius: 20,
                padding: '6px 14px',
              }}>
                <Search style={{ width: 15, height: 15, color: '#999' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索聊天记录"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: 14,
                  }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchTriggered(false); }} style={{
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
              <button
                onClick={handleSearch}
                style={{
                  padding: '6px 16px',
                  background: '#07C160',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                搜索
              </button>
            </div>
          </div>

          {/* 日期筛选 */}
          <div style={{
            background: '#fff',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid #E5E5E5',
          }}>
            <button
              onClick={() => setShowDatePicker(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                background: 'transparent',
                color: '#666',
                fontSize: 13,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span>日期筛选</span>
            </button>
          </div>

          {/* 搜索结果 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {searchLoading && (
              <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                搜索中...
              </div>
            )}
            {!searchLoading && searchTriggered && searchResults.length > 0 && (
              <div style={{ marginBottom: 10, color: '#999', fontSize: 12 }}>
                找到 {searchResults.length} 条相关消息
              </div>
            )}
            {!searchLoading && searchTriggered && searchResults.map((result, index) => {
              const timestamp = result.message.timestamp;
              const dateStr = timestamp !== null && timestamp !== undefined 
                ? new Date(Number(timestamp) * 1000).toLocaleString('zh-CN', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';
              
              const handlePreview = async () => {
                 if (result.messageType === im_server.MessageType.IMAGE) {
                   const imgMsg = result.message.message?.imageMessage;
                   if (imgMsg?.imageContent) {
                     const url = uint8ArrayToBlobURL(imgMsg.imageContent as Uint8Array, 'image/jpeg');
                     setPreviewImage(url);
                   } else if (imgMsg?.fileId && sessionId) {
                     try {
                       const response = await getSingleFile(sessionId, imgMsg.fileId);
                       if (response.success && response.fileData?.fileContent) {
                         const url = uint8ArrayToBlobURL(response.fileData.fileContent as Uint8Array, 'image/jpeg');
                         setPreviewImage(url);
                       }
                     } catch (error) {
                       console.error('获取图片失败:', error);
                     }
                   }
                 } else if (result.messageType === im_server.MessageType.FILE) {
                    const fileMsg = result.message.message?.fileMessage;
                    if (fileMsg?.fileContents) {
                      const arrayBuffer = (fileMsg.fileContents as Uint8Array).buffer.slice((fileMsg.fileContents as Uint8Array).byteOffset, (fileMsg.fileContents as Uint8Array).byteOffset + (fileMsg.fileContents as Uint8Array).byteLength) as ArrayBuffer;
                      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = fileMsg.fileName || 'download';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } else if (fileMsg?.fileId && sessionId) {
                      try {
                        const response = await getSingleFile(sessionId, fileMsg.fileId);
                        if (response.success && response.fileData?.fileContent) {
                          const arrayBuffer = (response.fileData.fileContent as Uint8Array).buffer.slice((response.fileData.fileContent as Uint8Array).byteOffset, (response.fileData.fileContent as Uint8Array).byteOffset + (response.fileData.fileContent as Uint8Array).byteLength) as ArrayBuffer;
                          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = fileMsg.fileName || 'download';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      } catch (error) {
                        console.error('下载文件失败:', error);
                      }
                    }
                  } else if (result.messageType === im_server.MessageType.SPEECH) {
                    const speechMsg = result.message.message?.speechMessage;
                    if (playingAudioId === result.message.messageId) {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                      }
                      setPlayingAudioId(null);
                      return;
                    }
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current = null;
                    }
                    if (speechMsg?.fileContents) {
                      const arrayBuffer = (speechMsg.fileContents as Uint8Array).buffer.slice((speechMsg.fileContents as Uint8Array).byteOffset, (speechMsg.fileContents as Uint8Array).byteOffset + (speechMsg.fileContents as Uint8Array).byteLength) as ArrayBuffer;
                      const blob = new Blob([arrayBuffer], { type: 'audio/webm' });
                      const url = URL.createObjectURL(blob);
                      const audio = new Audio(url);
                      audio.onended = () => {
                        setPlayingAudioId(null);
                        URL.revokeObjectURL(url);
                      };
                      audioRef.current = audio;
                      setPlayingAudioId(result.message.messageId || null);
                      audio.play();
                    } else if (speechMsg?.fileId && sessionId) {
                      try {
                        const response = await getSingleFile(sessionId, speechMsg.fileId);
                        if (response.success && response.fileData?.fileContent) {
                          const arrayBuffer = (response.fileData.fileContent as Uint8Array).buffer.slice((response.fileData.fileContent as Uint8Array).byteOffset, (response.fileData.fileContent as Uint8Array).byteOffset + (response.fileData.fileContent as Uint8Array).byteLength) as ArrayBuffer;
                          const blob = new Blob([arrayBuffer], { type: 'audio/webm' });
                          const url = URL.createObjectURL(blob);
                          const audio = new Audio(url);
                          audio.onended = () => {
                            setPlayingAudioId(null);
                            URL.revokeObjectURL(url);
                          };
                          audioRef.current = audio;
                          setPlayingAudioId(result.message.messageId || null);
                          audio.play();
                        }
                      } catch (error) {
                        console.error('播放语音失败:', error);
                      }
                    }
                  }
               };
              
              const isPlayingAudio = playingAudioId === result.message.messageId;
              const isImage = result.messageType === im_server.MessageType.IMAGE;
              const isFile = result.messageType === im_server.MessageType.FILE;
              const isSpeech = result.messageType === im_server.MessageType.SPEECH;
              
              return (
                <div key={index} style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: '#07C160',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 12,
                    }}>
                      {result.message.sender?.nickname?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500, color: '#191919', fontSize: 13 }}>
                          {result.message.sender?.nickname}
                        </span>
                        <span style={{ color: '#999', fontSize: 11 }}>
                          {dateStr}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                        {isImage && (
                          (() => {
                            const thumbnailUrl = imageThumbnails[result.message.messageId || ''];
                            if (thumbnailUrl) {
                              return (
                                <img
                                  src={thumbnailUrl}
                                  alt="缩略图"
                                  onClick={handlePreview}
                                  style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                  }}
                                />
                              );
                            }
                            return (
                              <button
                                onClick={handlePreview}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '4px 8px',
                                  border: 'none',
                                  borderRadius: 4,
                                  background: '#1890FF',
                                  color: '#fff',
                                  fontSize: 12,
                                  cursor: 'pointer',
                                }}
                              >
                                <ImageIcon style={{ width: 14, height: 14 }} />
                                加载图片
                              </button>
                            );
                          })()
                        )}
                        {(isFile || isSpeech) && (
                          <button
                            onClick={handlePreview}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: 4,
                              background: isFile ? '#FA8C16' : '#52C41A',
                              color: '#fff',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            {isFile && <FileIcon style={{ width: 14, height: 14 }} />}
                            {isSpeech && (isPlayingAudio ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14 }} />)}
                            {isFile && <Download style={{ width: 14, height: 14 }} />}
                            {isFile && '下载'}
                            {isSpeech && (isPlayingAudio ? '暂停' : '播放')}
                          </button>
                        )}
                        <span style={{ color: '#333', fontSize: 13, flex: 1 }}>
                          {result.preview}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!searchLoading && searchTriggered && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', paddingTop: 30 }}>
                未找到相关消息
              </div>
            )}
            {!searchLoading && !searchTriggered && (
              <div style={{ textAlign: 'center', color: '#999', paddingTop: 30 }}>
                请输入关键词或选择日期进行搜索
              </div>
            )}
          </div>

          {showDatePicker && renderDatePicker()}
          
          {previewImage && (
            <div
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'zoom-out',
              }}
            >
              <img
                src={previewImage}
                alt="预览"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 36,
                  height: 36,
                  border: 'none',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showSearchContent) {
    return renderSearchContent();
  }

  // 渲染群成员头像网格（最多显示4个）
  const renderGroupMembers = () => {
    const displayMembers = groupMembers.slice(0, 4);
    const remainingCount = groupMembers.length - 4;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {displayMembers.map((member) => (
          <div key={member.userId} style={{ position: 'relative' }}>
            <UserAvatar
              color="#07C160"
              initials={member.nickname?.charAt(0)?.toUpperCase() || '?'}
              size={42}
              imageData={member.avatar}
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: '#EDEDED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: '#666',
              fontWeight: 500,
            }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={panelRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 260,
        background: '#fff',
        borderLeft: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* 头部 */}
      <div style={{
        padding: 14,
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#191919' }}>聊天信息</span>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <X style={{ width: 16, height: 16, color: '#888' }} />
        </button>
      </div>

      {/* 用户/群聊信息 */}
      <div style={{ padding: 16, borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isGroup ? (
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: '#EDEDED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users style={{ width: 24, height: 24, color: '#07C160' }} />
            </div>
          ) : (
            <UserAvatar color="#07C160" initials={session.chatSessionName?.charAt(0)?.toUpperCase() || '?'} size={56} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#191919', margin: 0 }}>
              {session.chatSessionName}
            </h3>
            {!isGroup && (
              <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0 0' }}>
                个性签名：这个人很懒，什么都没有留下
              </p>
            )}
            {isGroup && (
              <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0 0' }}>
                {membersLoading ? '加载中...' : `${groupMembers.length} 位成员`}
              </p>
            )}
          </div>
        </div>
        
        {/* 群成员头像网格 */}
        {isGroup && (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 6, color: '#888', fontSize: 12 }}>
              群成员 ({groupMembers.length})
            </div>
            {membersLoading ? (
              <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                加载中...
              </div>
            ) : groupMembers.length === 0 ? (
              <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                暂无成员
              </div>
            ) : (
              renderGroupMembers()
            )}
          </div>
        )}
      </div>

      {/* 群聊名称显示 */}
      {isGroup && (
        <div style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F0F0F0',
        }}>
          <span style={{ color: '#888', fontSize: 14 }}>群聊名称</span>
          <span style={{ color: '#191919', fontSize: 14 }}>{session.chatSessionName}</span>
        </div>
      )}

      {/* 查找聊天内容 */}
      <button
        onClick={() => setShowSearchContent(true)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid #F0F0F0',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F7F7F7'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <Search style={{ width: 16, height: 16, color: '#888' }} />
        <span style={{ flex: 1, textAlign: 'left', color: '#191919', fontSize: 14 }}>查找聊天内容</span>
        <ChevronRight style={{ width: 14, height: 14, color: '#C8C8C8' }} />
      </button>

      {/* 删除好友/退出群聊 */}
      <button
        onClick={isGroup ? handleLeaveGroup : handleRemoveFriend}
        style={{
          width: 'calc(100% - 32px)',
          margin: '16px',
          padding: '12px',
          border: 'none',
          background: '#fff1f0',
          color: '#ff4d4f',
          borderRadius: 8,
          fontSize: 14,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ffccc7'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff1f0'; }}
      >
        {isGroup ? '退出群聊' : '删除好友'}
      </button>

      {/* 删除/退出确认对话框 */}
      {showRemoveConfirm && (
        <ConfirmDialog
          title={isGroup ? `退出"${session.chatSessionName || ''}"?` : `删除"${session.chatSessionName || ''}"?`}
          avatar={!isGroup && session.singleChatFriendId ? (
            <UserAvatar
              color="#07C160"
              initials={session.chatSessionName?.charAt(0)?.toUpperCase() || '?'}
              size={48}
              imageData={friends.get(session.singleChatFriendId)?.avatar}
            />
          ) : undefined}
          subtitle={session.chatSessionName || undefined}
          showCleanMessage={!isGroup}
          confirmText={isGroup ? '退出' : '删除'}
          onConfirm={isGroup ? confirmLeaveGroup : confirmRemoveFriend}
          onCancel={() => setShowRemoveConfirm(false)}
        />
      )}
    </div>
  );
}
