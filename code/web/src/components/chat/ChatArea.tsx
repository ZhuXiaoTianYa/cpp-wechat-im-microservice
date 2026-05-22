/**
 * 聊天区域组件 - 微信风格
 * 参考 Figma 设计稿
 */
import { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Scissors, Mic, X, Image as ImageIcon, FileIcon as FileIconLucide, MoreHorizontal, Send, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { getRecentMsg, sendMessage } from '@/api/message';
import { getChatSessionMember } from '@/api/friend';
import { handleAPIError } from '@/utils/error-handler';
import { formatMessageTime } from '@/utils/format';
import { isTextMessage, fileToUint8Array } from '@/utils/proto-helpers';
import MessageBubble from './MessageBubble';
import ChatInfoPanel from './ChatInfoPanel';
import EmojiPicker from './EmojiPicker';
import { UserAvatar } from '@/pages/MainLayout';

export default function ChatArea({ session }: { session: im_server.IChatSessionInfo }) {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const messages = useIMStore((state) => state.messages.get(session.chatSessionId || '') || []);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupMemberCount, setGroupMemberCount] = useState(0);
  const [memberLoading, setMemberLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<{
    stream: MediaStream;
    audioContext: AudioContext;
    source: MediaStreamAudioSourceNode;
    processor: ScriptProcessorNode;
    audioBuffer: number[];
    startTime: number;
  } | null>(null);

  const isGroup = !session.singleChatFriendId;

  useEffect(() => { loadRecentMessages(); }, [session.chatSessionId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);
  useEffect(() => {
    setShowChatInfo(false);
    setSearchQuery('');
  }, [session.chatSessionId, session.singleChatFriendId]);

  useEffect(() => {
    if (isGroup && sessionId && session.chatSessionId) {
      loadGroupMemberCount();
    }
  }, [session.chatSessionId, isGroup, sessionId]);

  const loadGroupMemberCount = async () => {
    if (!sessionId || !session.chatSessionId) return;
    setMemberLoading(true);
    try {
      const response = await getChatSessionMember(sessionId, session.chatSessionId);
      if (response.success && response.memberInfoList) {
        setGroupMemberCount(response.memberInfoList.length);
      }
    } catch (error) {
      console.error('加载群成员数量失败:', error);
    } finally {
      setMemberLoading(false);
    }
  };

  const loadRecentMessages = async () => {
    if (!sessionId || !session.chatSessionId) return;
    setLoading(true);
    try {
      const response = await getRecentMsg(sessionId, session.chatSessionId, 50, currentUser?.userId || '');
      useIMStore.getState().setMessages(session.chatSessionId, response.msgList || []);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !sessionId || !session.chatSessionId || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);
    const tempMessage: im_server.IMessageInfo = {
      messageId: `temp-${Date.now()}`,
      chatSessionId: session.chatSessionId,
      timestamp: Math.floor(Date.now() / 1000),
      sender: currentUser!,
      message: { messageType: im_server.MessageType.STRING, stringMessage: { content: text } },
    };
    useIMStore.getState().addMessage(session.chatSessionId, tempMessage);
    try {
      await sendMessage(sessionId, session.chatSessionId, {
        messageType: im_server.MessageType.STRING,
        stringMessage: { content: text },
      }, currentUser?.userId || '');
    } catch (error) {
      toast.error(handleAPIError(error));
      useIMStore.getState().deleteMessage(session.chatSessionId || '', tempMessage.messageId || '');
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleSendImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sessionId || !session.chatSessionId) return;

    setShowAttachMenu(false);
    setSending(true);

    try {
      const fileData = await fileToUint8Array(file);
      
      const tempMessage: im_server.IMessageInfo = {
        messageId: `temp-${Date.now()}`,
        chatSessionId: session.chatSessionId,
        timestamp: Math.floor(Date.now() / 1000),
        sender: currentUser!,
        message: { 
          messageType: im_server.MessageType.IMAGE, 
          imageMessage: { imageContent: fileData } 
        },
      };
      useIMStore.getState().addMessage(session.chatSessionId, tempMessage);

      await sendMessage(sessionId, session.chatSessionId, {
        messageType: im_server.MessageType.IMAGE,
        imageMessage: { imageContent: fileData },
      }, currentUser?.userId || '');
      
      toast.success('图片发送成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setSending(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleSendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sessionId || !session.chatSessionId) return;

    setShowAttachMenu(false);
    setSending(true);

    try {
      const fileData = await fileToUint8Array(file);
      
      const tempMessage: im_server.IMessageInfo = {
        messageId: `temp-${Date.now()}`,
        chatSessionId: session.chatSessionId,
        timestamp: Math.floor(Date.now() / 1000),
        sender: currentUser!,
        message: { 
          messageType: im_server.MessageType.FILE, 
          fileMessage: { 
            fileName: file.name,
            fileSize: file.size,
            fileContents: fileData 
          } 
        },
      };
      useIMStore.getState().addMessage(session.chatSessionId, tempMessage);

      await sendMessage(sessionId, session.chatSessionId, {
        messageType: im_server.MessageType.FILE,
        fileMessage: {
          fileName: file.name,
          fileSize: file.size,
          fileContents: fileData,
        },
      }, currentUser?.userId || '');
      
      toast.success('文件发送成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          displaySurface: 'monitor',
        },
        audio: false,
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      document.body.appendChild(video);
      
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
      }
      
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(video);
      
      canvas.toBlob(async (blob) => {
        if (!blob || !sessionId || !session.chatSessionId) return;
        
        setSending(true);
        try {
          const fileData = await fileToUint8Array(new File([blob], 'screenshot.png', { type: 'image/png' }));
          
          const tempMessage: im_server.IMessageInfo = {
            messageId: `temp-${Date.now()}`,
            chatSessionId: session.chatSessionId,
            timestamp: Math.floor(Date.now() / 1000),
            sender: currentUser!,
            message: { 
              messageType: im_server.MessageType.IMAGE, 
              imageMessage: { imageContent: fileData } 
            },
          };
          useIMStore.getState().addMessage(session.chatSessionId, tempMessage);

          await sendMessage(sessionId, session.chatSessionId, {
            messageType: im_server.MessageType.IMAGE,
            imageMessage: { imageContent: fileData },
          }, currentUser?.userId || '');
          
          toast.success('截图发送成功');
        } catch (error) {
          toast.error(handleAPIError(error));
        } finally {
          setSending(false);
        }
      }, 'image/png');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error('截图失败，请重试');
      }
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      const audioBuffer: number[] = [];
      const maxDuration = 60; // 最长60秒
      const maxSamples = maxDuration * 16000; // 16kHz采样率
      
      let startTime = Date.now();

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        for (let i = 0; i < inputData.length; i++) {
          if (audioBuffer.length < maxSamples) {
            audioBuffer.push(inputData[i]);
          } else {
            // 达到最大时长，自动停止录音
            handleStopRecording();
            toast.warning('录音已达到60秒上限');
            return;
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // 保存引用以便停止时使用
      mediaRecorderRef.current = {
        stream,
        audioContext,
        source,
        processor,
        audioBuffer,
        startTime,
      };

      setIsRecording(true);
      toast.info('开始录音，再次点击停止（最长60秒）');
    } catch (error) {
      toast.error('无法访问麦克风，请检查权限设置');
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    
    const { stream, audioContext, source, processor, audioBuffer } = mediaRecorderRef.current;
    
    // 停止录音
    processor.disconnect();
    source.disconnect();
    audioContext.close();
    stream.getTracks().forEach(track => track.stop());
    
    setIsRecording(false);

    // 检查是否有录音数据
    if (audioBuffer.length === 0) {
      toast.warning('未录制到音频');
      return;
    }

    // 将音频数据转换为PCM格式（16bit位深、单声道、16kHz采样率）
    const pcmData = new Int16Array(audioBuffer.length);
    for (let i = 0; i < audioBuffer.length; i++) {
      // 将float转换为16bit有符号整数
      const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
      pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    // 转换为Uint8Array
    const byteArray = new Uint8Array(pcmData.buffer);

    // 发送消息
    if (sessionId && session.chatSessionId) {
      try {
        const tempMessage: im_server.IMessageInfo = {
          messageId: `temp-${Date.now()}`,
          chatSessionId: session.chatSessionId,
          timestamp: Math.floor(Date.now() / 1000),
          sender: currentUser!,
          message: { 
            messageType: im_server.MessageType.SPEECH, 
            speechMessage: { fileContents: byteArray } 
          },
        };
        useIMStore.getState().addMessage(session.chatSessionId, tempMessage);

        await sendMessage(sessionId, session.chatSessionId, {
          messageType: im_server.MessageType.SPEECH,
          speechMessage: { fileContents: byteArray },
        }, currentUser?.userId || '');
        
        toast.success('语音发送成功');
      } catch (error) {
        toast.error(handleAPIError(error));
      }
    }

    mediaRecorderRef.current = null;
  };

  const displayMessages = searchQuery ? messages.filter((m) =>
    isTextMessage(m.message!) && m.message.stringMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : messages;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          height: 54,
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>
              {session.chatSessionName}
            </span>
            {isGroup && (
              <span style={{ color: '#ABABAB', fontSize: 12, marginLeft: 6 }}>
                {memberLoading ? '加载中...' : `${groupMemberCount}人`}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setShowChatInfo(!showChatInfo)}
              style={{
                width: 32,
                height: 32,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
              }}
              title="聊天信息"
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <MoreHorizontal style={{ width: 16, height: 16, color: showChatInfo ? '#07C160' : '#888' }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16, background: '#FAFAFA' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ color: '#999', fontSize: 12 }}>加载中...</div>
            </div>
          ) : searchQuery && displayMessages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
              <Search style={{ width: 32, height: 32, color: '#ccc' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>未找到包含"{searchQuery}"的消息</p>
            </div>
          ) : displayMessages.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ color: '#999', fontSize: 12 }}>暂无消息</div>
            </div>
          ) : (
            <div>
              {displayMessages.map((msg, idx) => {
                const isSelf = msg.sender?.userId === currentUser?.userId;
                const prevMsg = displayMessages[idx - 1];
                const showTime = !prevMsg || ((Number(msg.timestamp) || 0) - (Number(prevMsg.timestamp) || 0)) > 300000;
                return (
                  <div key={msg.messageId}>
                    {showTime && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, marginBottom: 12 }}>
                        <span style={{
                          paddingLeft: 12,
                          paddingRight: 12,
                          paddingTop: 4,
                          paddingBottom: 4,
                          borderRadius: 20,
                          background: 'rgba(0,0,0,0.1)',
                          color: '#888',
                          fontSize: 11,
                        }}>
                          {formatMessageTime(msg.timestamp as number)}
                        </span>
                      </div>
                    )}
                    <MessageBubble message={msg} isSelf={isSelf} isGroup={isGroup} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Hidden inputs for file selection */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleSendImage}
          style={{ display: 'none' }}
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleSendFile}
          style={{ display: 'none' }}
        />

        {/* Input area */}
        <div style={{
          background: '#F2F2F2',
          borderTop: '1px solid #D9D9D9',
          flexShrink: 0,
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            paddingLeft: 12,
            paddingTop: 8,
            paddingBottom: 4,
            borderBottom: '1px solid #E8E8E8',
          }}>
            <div style={{ position: 'relative' }}>
              <ToolbarButton title="表情" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile style={{ width: 18, height: 18 }} />
              </ToolbarButton>
              {showEmojiPicker && (
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <ToolbarButton title="发送文件" onClick={() => setShowAttachMenu(!showAttachMenu)}>
                <Paperclip style={{ width: 18, height: 18 }} />
              </ToolbarButton>
              {showAttachMenu && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: 4,
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #eee',
                  width: 160,
                  zIndex: 10,
                }}>
                  <button
                    onClick={() => { setShowAttachMenu(false); imageInputRef.current?.click(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 10,
                      paddingBottom: 10,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#333',
                      fontSize: 13,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <ImageIcon style={{ width: 16, height: 16, color: '#07C160' }} />
                    发送图片
                  </button>
                  <button
                    onClick={() => { setShowAttachMenu(false); fileInputRef.current?.click(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 10,
                      paddingBottom: 10,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#333',
                      fontSize: 13,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <FileIconLucide style={{ width: 16, height: 16, color: '#1890FF' }} />
                    发送文件
                  </button>
                </div>
              )}
            </div>

            <ToolbarButton title="截图" onClick={handleScreenshot}>
              <Scissors style={{ width: 18, height: 18 }} />
            </ToolbarButton>

            <ToolbarButton
              title={isRecording ? '停止录音' : '发送语音'}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              active={isRecording}
            >
              <Mic style={{ width: 18, height: 18 }} />
            </ToolbarButton>

            {isRecording && (
              <span style={{ 
                color: '#F5222D', 
                fontSize: 12, 
                marginLeft: 4,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}>
                ● 录音中...
              </span>
            )}
          </div>

          {/* Text input */}
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="输入消息..."
                style={{
                  flex: 1,
                  resize: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#333',
                  fontSize: 14,
                  lineHeight: 1.6,
                  minHeight: 64,
                  maxHeight: 120,
                  border: 'none',
                  fontFamily: 'inherit',
                }}
                rows={3}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || sending}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 50,
                  background: inputText.trim() && !sending ? '#07C160' : 'rgba(0,0,0,0.08)',
                  color: inputText.trim() && !sending ? '#fff' : '#bbb',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Group Panel */}


      {/* Create Group Dialog */}
      {showCreateGroup && (
        <CreateGroupDialog
          onClose={() => setShowCreateGroup(false)}
          onCreate={() => { setShowCreateGroup(false); toast.info('创建群聊功能开发中'); }}
        />
      )}

      {/* Chat Info Panel */}
      {showChatInfo && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'transparent',
              zIndex: 99,
            }}
            onClick={() => setShowChatInfo(false)}
          />
          <ChatInfoPanel
            session={session}
            onClose={() => setShowChatInfo(false)}
          />
        </>
      )}
    </div>
  );
}

function ToolbarButton({ children, title, onClick, active = false }: { children: React.ReactNode; title: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32,
        height: 32,
        background: 'transparent',
        color: active ? '#07C160' : '#666',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.08)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}



function CreateGroupDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const mockFriends = Array.from({ length: 5 }, (_, i) => ({
    userId: `friend_${i}`,
    nickname: `好友${i + 1}`,
  }));

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!groupName.trim() || selected.length === 0) return;
    onCreate(groupName.trim(), selected);
    onClose();
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        background: '#fff',
        width: 420,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 16,
          paddingBottom: 16,
          borderBottom: '1px solid #f0f0f0',
        }}>
          <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>发起群聊</h3>
          <button onClick={onClose} style={{ color: '#999', background: 'none', padding: 0, border: 'none', cursor: 'pointer' }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="群聊名称（必填）"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              width: '100%',
              outline: 'none',
              background: '#F7F7F7',
              border: '1px solid #eee',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              color: '#333',
            }}
          />

          <p style={{ color: '#999', fontSize: 12, margin: 0 }}>
            从好友中选择（已选 {selected.length} 人）
          </p>

          <div style={{ maxHeight: 208, overflowY: 'auto' }}>
            {mockFriends.map((friend) => (
              <div
                key={friend.userId}
                onClick={() => toggle(friend.userId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: selected.includes(friend.userId) ? 'rgba(7,193,96,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!selected.includes(friend.userId)) (e.currentTarget as HTMLDivElement).style.background = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  if (!selected.includes(friend.userId)) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  border: `2px solid ${selected.includes(friend.userId) ? '#07C160' : '#ddd'}`,
                  background: selected.includes(friend.userId) ? '#07C160' : 'transparent',
                  flexShrink: 0,
                }}>
                  {selected.includes(friend.userId) && (
                    <svg viewBox="0 0 12 12" width="10" height="10">
                      <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <UserAvatar color="#07C160" initials={friend.nickname?.charAt(0)?.toUpperCase() || '?'} size={34} />
                <span style={{ color: '#333', fontSize: 14 }}>{friend.nickname}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 16,
          paddingBottom: 16,
          display: 'flex',
          gap: 12,
          borderTop: '1px solid #f0f0f0',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              borderRadius: 8,
              paddingTop: 8,
              paddingBottom: 8,
              background: '#f0f0f0',
              color: '#666',
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selected.length === 0}
            style={{
              flex: 1,
              borderRadius: 8,
              paddingTop: 8,
              paddingBottom: 8,
              background: groupName.trim() && selected.length > 0 ? '#07C160' : '#E0E0E0',
              color: groupName.trim() && selected.length > 0 ? '#fff' : '#aaa',
              fontSize: 14,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            创建群聊
          </button>
        </div>
      </div>
    </div>
  );
}