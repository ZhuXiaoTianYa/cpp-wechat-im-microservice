import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Search, Plus, Smile, Paperclip, Scissors, Mic,
  Send, MoreHorizontal, X, Download,
  Users, Image, File as FileIcon,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ChatSession, Message, MOCK_USERS, formatTime, getMessagePreview,
} from '../data/mockData';
import { UserAvatar } from './MainLayout';
import { ApiTag, ApiTooltip } from '../components/common/ApiTag';

// ─── Session List ─────────────────────────────────────────────────
function SessionList({
  sessions,
  activeId,
  onSelect,
  onCreateGroup,
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreateGroup: () => void;
}) {
  const [search, setSearch] = useState('');
  const { showApiAnnotations } = useApp();

  const filtered = sessions.filter((s) =>
    s.session_name.toLowerCase().includes(search.toLowerCase())
  );
  const pinned = filtered.filter((s) => s.pinned);
  const unpinned = filtered.filter((s) => !s.pinned);
  const sorted = [...pinned, ...unpinned];

  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{ width: 280, background: '#EBE9E9', borderRight: '1px solid #D9D9D9' }}
    >
      {/* Panel title + create button */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0"
        style={{ minHeight: 54 }}
      >
        <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>消息</span>
        <button
          onClick={onCreateGroup}
          className="flex items-center justify-center rounded-md transition-colors hover:bg-black/10"
          style={{ width: 28, height: 28 }}
          title="发起群聊"
        >
          <Plus className="w-4 h-4" style={{ color: '#555' }} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 rounded-md"
          style={{ background: 'rgba(0,0,0,0.1)', height: 30 }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#888' }} />
          <input
            type="text"
            placeholder="搜索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: '#333', fontSize: 13 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: '#999', background: 'none', padding: 0 }}>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        {showApiAnnotations && (
          <div className="mt-1.5">
            <ApiTag endpoint="/service/friend/get_chat_session_list" params="session_id" />
          </div>
        )}
      </div>

      {/* Session items */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="#ccc" strokeWidth="1.5" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="#ccc" strokeWidth="1.5" />
            </svg>
            <p style={{ color: '#bbb', fontSize: 13 }}>暂无会话</p>
          </div>
        ) : (
          sorted.map((session) => (
            <SessionItem
              key={session.session_id}
              session={session}
              isActive={session.session_id === activeId}
              onClick={() => onSelect(session.session_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SessionItem({
  session,
  isActive,
  onClick,
}: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
}) {
  const preview = getMessagePreview(session.last_message);
  const senderPrefix =
    session.session_type === 1 && session.last_message
      ? `${session.last_message.sender.nickname}：`
      : '';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 cursor-pointer relative"
      style={{
        height: 64,
        background: isActive ? '#C9C7C7' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLDivElement).style.background = '#E0DEDE';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* Pinned dot */}
      {session.pinned && (
        <div
          className="absolute top-1 right-2"
          style={{ fontSize: 8, color: '#aaa' }}
        >
          ●
        </div>
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <UserAvatar
          color={session.avatar_color}
          initials={session.avatar_initials}
          size={46}
        />
        {session.session_type === 1 && (
          <div
            className="absolute -bottom-0.5 -right-0.5 rounded flex items-center justify-center"
            style={{ background: '#07C160', width: 14, height: 14, borderRadius: 3 }}
          >
            <Users className="w-2.5 h-2.5" style={{ color: '#fff' }} />
          </div>
        )}
        {session.unread_count > 0 && (
          <span
            className="absolute flex items-center justify-center text-white"
            style={{
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: '#F5222D',
              fontSize: 9,
              fontWeight: 700,
              padding: '0 3px',
            }}
          >
            {session.unread_count > 99 ? '99+' : session.unread_count}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className="truncate flex-1"
            style={{ color: '#191919', fontSize: 14, fontWeight: 500 }}
          >
            {session.session_name}
          </span>
          <span className="ml-2 flex-shrink-0" style={{ color: '#ABABAB', fontSize: 11 }}>
            {session.last_message ? formatTime(session.last_message.timestamp) : ''}
          </span>
        </div>
        <span
          className="block truncate"
          style={{ color: '#ABABAB', fontSize: 12, maxWidth: 180 }}
        >
          {senderPrefix}{preview || ' '}
        </span>
      </div>
    </div>
  );
}

// ─── Chat Area ────────────────────────────────────────────────────
function ChatArea({ session }: { session: ChatSession }) {
  const { messages, sendMessage, currentUser, showApiAnnotations } = useApp();
  const sessionMessages = messages[session.session_id] || [];
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showGroupPanel, setShowGroupPanel] = useState(session.session_type === 1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages.length]);

  useEffect(() => {
    setShowGroupPanel(session.session_type === 1);
    setShowSearch(false);
    setSearchQuery('');
  }, [session.session_id, session.session_type]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(session.session_id, { type: 'text', text: inputText.trim() });
    setInputText('');
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    setShowAttachMenu(false);
    if (type === 'image') {
      sendMessage(session.session_id, {
        type: 'image',
        file_id: `img_${Date.now()}`,
        image_url: 'https://images.unsplash.com/photo-1723962807917-ffab0600929c?w=400&q=80',
      });
    } else {
      sendMessage(session.session_id, {
        type: 'file',
        file_id: `file_${Date.now()}`,
        file_name: '上传的文件.pdf',
        file_size: '1.2MB',
      });
    }
  };

  const handleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      sendMessage(session.session_id, {
        type: 'voice',
        file_id: `voice_${Date.now()}`,
        duration: Math.floor(Math.random() * 10) + 3,
        voice_text: '这是一条语音消息（已转文字）',
      });
    } else {
      setIsRecording(true);
    }
  };

  const displayMessages = searchQuery
    ? sessionMessages.filter(
        (m) =>
          m.content.type === 'text' &&
          m.content.text?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sessionMessages;

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center px-5 flex-shrink-0"
          style={{
            height: 54,
            background: '#F2F2F2',
            borderBottom: '1px solid #D9D9D9',
          }}
        >
          <div className="flex-1 min-w-0">
            <span style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>
              {session.session_name}
            </span>
            {session.session_type === 1 && (
              <span style={{ color: '#ABABAB', fontSize: 12, marginLeft: 6 }}>
                {session.member_ids.length}人
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ApiTooltip
              endpoint="/service/message_storage/search_history"
              description="按关键词搜索历史消息"
              params={[
                { name: 'session_id', desc: '会话ID', required: true },
                { name: 'search_key', desc: '搜索关键词', required: true },
              ]}
            >
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  background: 'none',
                  color: showSearch ? '#07C160' : '#888',
                }}
                title="搜索聊天记录"
              >
                <Search className="w-4 h-4" />
              </button>
            </ApiTooltip>

            {session.session_type === 1 && (
              <button
                onClick={() => setShowGroupPanel(!showGroupPanel)}
                className="flex items-center justify-center rounded transition-colors hover:bg-black/8"
                style={{ width: 32, height: 32, background: 'none', color: '#888' }}
                title="群组信息"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div
            className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
            style={{ background: '#EBEBEB', borderBottom: '1px solid #D9D9D9' }}
          >
            {showApiAnnotations && (
              <ApiTag endpoint="/service/message_storage/search_history" params="session_id, search_key" />
            )}
            <div
              className="flex items-center gap-2 flex-1 px-3 rounded-md"
              style={{ background: '#fff', border: '1px solid #ddd', height: 30 }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#999' }} />
              <input
                type="text"
                placeholder="搜索聊天记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 13, color: '#333' }}
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: '#ccc', background: 'none', padding: 0 }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              style={{ color: '#666', background: 'none', fontSize: 13 }}
            >
              取消
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4 space-y-1"
          style={{ background: '#EDEDED' }}
        >
          {showApiAnnotations && (
            <div className="flex justify-center mb-2">
              <ApiTag endpoint="/service/message_storage/get_recent" params="session_id, msg_nums(default:20)" />
            </div>
          )}

          {searchQuery && displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Search className="w-8 h-8" style={{ color: '#ccc' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>未找到包含"{searchQuery}"的消息</p>
            </div>
          ) : (
            displayMessages.map((msg, idx) => {
              const isSelf = msg.sender_id === currentUser.user_id;
              const prevMsg = displayMessages[idx - 1];
              const showTime = !prevMsg || msg.timestamp - prevMsg.timestamp > 5 * 60 * 1000;
              return (
                <div key={msg.message_id}>
                  {showTime && (
                    <div className="flex justify-center my-3">
                      <span
                        className="px-3 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.1)', color: '#888', fontSize: 11 }}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <MessageBubble msg={msg} isSelf={isSelf} isGroup={session.session_type === 1} />
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="flex-shrink-0"
          style={{ background: '#F2F2F2', borderTop: '1px solid #D9D9D9' }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center gap-0.5 px-3 pt-2 pb-1"
            style={{ borderBottom: '1px solid #E8E8E8' }}
          >
            <ToolbarButton title="表情">
              <Smile className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <div className="relative">
              <ToolbarButton title="发送文件" onClick={() => setShowAttachMenu(!showAttachMenu)}>
                <Paperclip className="w-[18px] h-[18px]" />
              </ToolbarButton>
              {showAttachMenu && (
                <div
                  className="absolute bottom-full left-0 mb-1 rounded-lg shadow-xl overflow-hidden z-10"
                  style={{ background: '#fff', border: '1px solid #eee', width: 160 }}
                >
                  {showApiAnnotations && (
                    <div className="px-2 pt-1.5">
                      <ApiTag endpoint="/service/file/put_single_file" params="file_content, file_name, file_size" />
                    </div>
                  )}
                  <button
                    onClick={() => handleFileUpload('image')}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    style={{ color: '#333', background: 'none', fontSize: 13 }}
                  >
                    <Image className="w-4 h-4" style={{ color: '#07C160' }} />
                    发送图片
                  </button>
                  <button
                    onClick={() => handleFileUpload('file')}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    style={{ color: '#333', background: 'none', fontSize: 13 }}
                  >
                    <FileIcon className="w-4 h-4" style={{ color: '#1890FF' }} />
                    发送文件
                  </button>
                </div>
              )}
            </div>

            <ToolbarButton title="截图">
              <Scissors className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ApiTooltip
              endpoint="/service/speech/recognition"
              description="语音识别转文字"
              params={[
                { name: 'session_id', desc: '会话ID', required: true },
                { name: 'speech_content', desc: '语音二进制数据(Base64)', required: true },
              ]}
            >
              <ToolbarButton
                title={isRecording ? '停止录音' : '发送语音'}
                onClick={handleVoice}
                active={isRecording}
              >
                <Mic className="w-[18px] h-[18px]" />
              </ToolbarButton>
            </ApiTooltip>

            {isRecording && (
              <span className="ml-1 animate-pulse" style={{ color: '#F5222D', fontSize: 12 }}>
                ● 录音中...
              </span>
            )}
          </div>

          {/* Text input */}
          <div className="px-4 py-2 pb-3">
            {showApiAnnotations && (
              <div className="mb-1">
                <ApiTag endpoint="/service/message_transmit/new_message" params="session_id, msg_type, content" />
              </div>
            )}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="输入消息..."
              className="w-full resize-none outline-none bg-transparent"
              style={{ color: '#333', fontSize: 14, lineHeight: 1.6, minHeight: 64, maxHeight: 120 }}
              rows={3}
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="px-5 py-1.5 rounded transition-colors"
                style={{
                  background: inputText.trim() ? '#07C160' : 'rgba(0,0,0,0.08)',
                  color: inputText.trim() ? '#fff' : '#bbb',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Group Panel */}
      {session.session_type === 1 && showGroupPanel && (
        <GroupPanel session={session} />
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  title,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center rounded transition-colors"
      style={{
        width: 32,
        height: 32,
        background: 'none',
        color: active ? '#07C160' : '#666',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'none';
      }}
    >
      {children}
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────
function MessageBubble({ msg, isSelf, isGroup }: {
  msg: Message;
  isSelf: boolean;
  isGroup: boolean;
}) {
  const [showVoiceText, setShowVoiceText] = useState(false);

  const renderContent = () => {
    const { content } = msg;
    switch (content.type) {
      case 'text':
        return (
          <div
            className="break-words"
            style={{
              background: isSelf ? '#95EC69' : '#fff',
              color: '#191919',
              fontSize: 14,
              lineHeight: 1.55,
              padding: '8px 12px',
              borderRadius: isSelf ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
              maxWidth: 360,
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              wordBreak: 'break-word',
            }}
          >
            {content.text}
          </div>
        );
      case 'image':
        return (
          <div style={{ borderRadius: 8, overflow: 'hidden', maxWidth: 240, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
            <img
              src={content.image_url}
              alt="图片消息"
              style={{ display: 'block', maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23ddd" width="200" height="150"/><text fill="%23999" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em">图片</text></svg>';
              }}
            />
          </div>
        );
      case 'file':
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            style={{
              background: isSelf ? '#95EC69' : '#fff',
              borderRadius: 8,
              padding: '10px 14px',
              maxWidth: 280,
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: 8, background: '#1890FF' }}
            >
              <FileIcon className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ color: '#191919', fontSize: 13, fontWeight: 500 }}>
                {content.file_name}
              </p>
              <p style={{ color: '#999', fontSize: 11 }}>{content.file_size}</p>
            </div>
            <Download className="w-4 h-4 flex-shrink-0" style={{ color: '#07C160' }} />
          </div>
        );
      case 'voice':
        return (
          <div>
            <button
              onClick={() => setShowVoiceText(!showVoiceText)}
              className="flex items-center gap-2 transition-colors"
              style={{
                background: isSelf ? '#95EC69' : '#fff',
                borderRadius: isSelf ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                padding: '8px 14px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <Volume2 className="w-4 h-4" style={{ color: '#07C160' }} />
              <div className="flex items-end gap-0.5">
                {[3, 6, 5, 8, 4].map((h, i) => (
                  <div
                    key={i}
                    style={{ width: 2.5, height: h, background: '#07C160', borderRadius: 1.5 }}
                  />
                ))}
              </div>
              <span style={{ color: '#666', fontSize: 13 }}>{content.duration}"</span>
            </button>
            {showVoiceText && content.voice_text && (
              <div
                className="mt-1 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.07)', color: '#666', fontSize: 12, maxWidth: 260 }}
              >
                <span style={{ color: '#999' }}>转文字：</span>{content.voice_text}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start gap-2.5 py-1 ${isSelf ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0 mt-0.5">
        <UserAvatar
          color={msg.sender.avatar_color}
          initials={msg.sender.avatar_initials}
          size={38}
        />
      </div>
      <div className={`flex flex-col max-w-[65%] ${isSelf ? 'items-end' : 'items-start'}`}>
        {isGroup && !isSelf && (
          <span className="mb-1 px-0.5" style={{ color: '#888', fontSize: 11 }}>
            {msg.sender.nickname}
          </span>
        )}
        {renderContent()}
      </div>
    </div>
  );
}

// ─── Group Panel ──────────────────────────────────────────────────
function GroupPanel({ session }: { session: ChatSession }) {
  const { showApiAnnotations } = useApp();
  const members = session.member_ids.map((id) => MOCK_USERS[id]).filter(Boolean);

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{ width: 230, background: '#F7F7F7', borderLeft: '1px solid #D9D9D9' }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #E8E8E8' }}>
        <h4 style={{ color: '#333', fontSize: 13, fontWeight: 600 }}>
          群成员 ({members.length})
        </h4>
        {showApiAnnotations && (
          <div className="mt-1">
            <ApiTag endpoint="/service/friend/get_chat_session_member" params="session_id" />
          </div>
        )}
      </div>

      {/* Members grid */}
      <div className="p-3">
        <div className="grid grid-cols-4 gap-2">
          {members.map((member) => (
            <div key={member.user_id} className="flex flex-col items-center gap-1">
              <UserAvatar color={member.avatar_color} initials={member.avatar_initials} size={36} />
              <span
                className="text-center truncate w-full"
                style={{ color: '#666', fontSize: 10 }}
              >
                {member.nickname}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1">
            <button
              className="flex items-center justify-center transition-colors"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#E8E8E8',
                border: '1px dashed #ccc',
              }}
              title="添加成员"
            >
              <Plus className="w-4 h-4" style={{ color: '#999' }} />
            </button>
            <span style={{ color: '#999', fontSize: 10 }}>添加</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #EBEBEB', margin: '0 12px' }} />

      <div className="px-3 py-2 space-y-0">
        <GroupSettingRow label="群聊名称" value={session.session_name} />
        <GroupSettingRow label="我的昵称" value="（未设置）" />
      </div>

      <div style={{ borderTop: '1px solid #EBEBEB', margin: '0 12px' }} />

      <div className="px-3 py-2 space-y-0">
        <ToggleRow label="消息免打扰" />
        <ToggleRow label="置顶聊天" defaultOn={session.pinned} />
        <ToggleRow label="显示成员昵称" defaultOn />
      </div>

      <div className="px-3 py-4 mt-auto">
        <button
          className="w-full py-2 rounded-lg transition-colors"
          style={{ background: '#FFF2F0', color: '#D4183D', border: '1px solid #FFCCC7', fontSize: 13 }}
        >
          清空聊天记录
        </button>
      </div>
    </div>
  );
}

function GroupSettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
      <span style={{ color: '#333', fontSize: 13 }}>{label}</span>
      <span style={{ color: '#999', fontSize: 13 }}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <span style={{ color: '#333', fontSize: 13 }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="relative rounded-full transition-colors flex-shrink-0"
        style={{ width: 38, height: 21, background: on ? '#07C160' : '#D0D0D0' }}
      >
        <span
          className="absolute top-0.5 rounded-full bg-white transition-transform"
          style={{
            width: 17,
            height: 17,
            left: 2,
            transform: on ? 'translateX(17px)' : 'translateX(0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        />
      </button>
    </div>
  );
}

// ─── Create Group Dialog ──────────────────────────────────────────
function CreateGroupDialog({
  friends,
  onClose,
  onCreate,
}: {
  friends: any[];
  onClose: () => void;
  onCreate: (name: string, ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const { showApiAnnotations } = useApp();

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selected.length === 0) return;
    onCreate(groupName.trim(), selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-xl shadow-2xl overflow-hidden"
        style={{ background: '#fff', width: 420 }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>发起群聊</h3>
          <button onClick={onClose} style={{ color: '#999', background: 'none', padding: 0 }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {showApiAnnotations && (
            <ApiTag endpoint="/service/friend/create_chat_session" params="session_name, member_ids[]" />
          )}

          <input
            type="text"
            placeholder="群聊名称（必填）"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full outline-none"
            style={{
              background: '#F7F7F7',
              border: '1px solid #eee',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              color: '#333',
            }}
          />

          <p style={{ color: '#999', fontSize: 12 }}>
            从好友中选择（已选 {selected.length} 人）
          </p>

          <div className="space-y-0.5 max-h-52 overflow-y-auto">
            {friends.map((friend) => (
              <div
                key={friend.user_id}
                onClick={() => toggle(friend.user_id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: selected.includes(friend.user_id) ? 'rgba(7,193,96,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!selected.includes(friend.user_id))
                    (e.currentTarget as HTMLDivElement).style.background = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  if (!selected.includes(friend.user_id))
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    border: `2px solid ${selected.includes(friend.user_id) ? '#07C160' : '#ddd'}`,
                    background: selected.includes(friend.user_id) ? '#07C160' : 'transparent',
                  }}
                >
                  {selected.includes(friend.user_id) && (
                    <svg viewBox="0 0 12 12" width="10" height="10">
                      <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <UserAvatar color={friend.avatar_color} initials={friend.avatar_initials} size={34} />
                <span style={{ color: '#333', fontSize: 14 }}>{friend.nickname}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-2"
            style={{ background: '#f0f0f0', color: '#666', fontSize: 14 }}
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selected.length === 0}
            className="flex-1 rounded-lg py-2"
            style={{
              background: groupName.trim() && selected.length > 0 ? '#07C160' : '#E0E0E0',
              color: groupName.trim() && selected.length > 0 ? '#fff' : '#aaa',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            创建群聊
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{ background: '#EDEDED' }}>
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
      <p className="mt-4" style={{ color: '#B0B0B0', fontSize: 14 }}>选择一个会话开始聊天</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function ChatPage() {
  const { sessions, setActiveSession, activeSessionId, friends, createGroupSession } = useApp();
  const params = useParams();
  const navigate = useNavigate();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const sessionId = params.id || activeSessionId;
  const activeSession = sessions.find((s) => s.session_id === sessionId);

  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    navigate(`/chat/${id}`);
  };

  const handleCreateGroup = (name: string, memberIds: string[]) => {
    const newSession = createGroupSession(name, memberIds);
    handleSelectSession(newSession.session_id);
  };

  return (
    <>
      <SessionList
        sessions={sessions}
        activeId={sessionId || null}
        onSelect={handleSelectSession}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      {activeSession ? <ChatArea session={activeSession} /> : <EmptyState />}

      {showCreateGroup && (
        <CreateGroupDialog
          friends={friends}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </>
  );
}
