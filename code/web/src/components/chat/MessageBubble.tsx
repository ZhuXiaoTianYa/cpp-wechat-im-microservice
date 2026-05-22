/**
 * 消息气泡组件 - 微信风格
 * 参考 Figma 设计稿
 */
import { FileIcon, Download, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useIMStore } from '@/store/useIMStore';
import { im_server } from '@/proto/generated';
import { uint8ArrayToBlobURL } from '@/utils/proto-helpers';
import { getSingleFile } from '@/api/file';
import { speechRecognition } from '@/api/speech';
import { handleAPIError } from '@/utils/error-handler';
import { UserAvatar } from '@/pages/MainLayout';
import ContextMenu from './ContextMenu';

interface MessageBubbleProps {
  message: im_server.IMessageInfo;
  isSelf: boolean;
  isGroup?: boolean;
}

export default function MessageBubble({ message, isSelf, isGroup = false }: MessageBubbleProps) {
  const sessionId = useIMStore((state) => state.sessionId);
  const content = message.message;
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (content?.messageType === im_server.MessageType.IMAGE) {
      const loadImage = async () => {
        if (content.imageMessage?.imageContent) {
          const url = uint8ArrayToBlobURL(content.imageMessage.imageContent as Uint8Array, 'image/jpeg');
          setImageUrl(url);
        } else if (content.imageMessage?.fileId && sessionId) {
          try {
            setImageLoading(true);
            const response = await getSingleFile(sessionId, content.imageMessage.fileId);
            if (response.success && response.fileData?.fileContent) {
              const url = uint8ArrayToBlobURL(response.fileData.fileContent, 'image/jpeg');
              setImageUrl(url);
            }
          } catch (error) {
            console.error('加载图片失败:', error);
          } finally {
            setImageLoading(false);
          }
        }
      };
      loadImage();
      
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }
  }, [content, sessionId]);
  
  if (!content) return null;

  const avatarInitials = message.sender?.nickname?.charAt(0)?.toUpperCase() || '?';

  const handleFileDownload = async () => {
    if (!content.fileMessage?.fileId || !sessionId) return;
    
    try {
      const response = await getSingleFile(sessionId, content.fileMessage.fileId);
      if (!response.success || !response.fileData?.fileContent) {
        toast.error(response.errmsg || '下载失败');
        return;
      }
      
      const arrayBuffer = content.fileMessage.fileContents?.buffer.slice(0) as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = content.fileMessage.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('文件下载成功');
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleSpeechPlay = async () => {
    if (!content.speechMessage?.fileContents) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }
    
    const arrayBuffer = content.speechMessage.fileContents.buffer.slice(0) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
    };
    
    audio.onerror = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
      toast.error('语音播放失败');
    };
    
    audioRef.current = audio;
    setIsPlaying(true);
    await audio.play();
  };

  const handleSpeechConvert = async () => {
    if (!content.speechMessage?.fileContents || !sessionId) return;
    
    setConverting(true);
    try {
      const response = await speechRecognition(sessionId, content.speechMessage.fileContents as Uint8Array);
      if (response.success && response.recognitionResult) {
        setSpeechText(response.recognitionResult);
        toast.success('语音转文字成功');
      } else {
        toast.error(response.errmsg || '语音转文字失败');
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setConverting(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (content?.messageType !== im_server.MessageType.SPEECH) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const renderContent = () => {
    switch (content.messageType) {
      case im_server.MessageType.STRING:
        if (!content.stringMessage?.content) return null;
        return (
          <div
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
            {content.stringMessage.content}
          </div>
        );

      case im_server.MessageType.IMAGE:
        if (!content.imageMessage) return null;
        return (
          <div style={{ borderRadius: isSelf ? '12px 2px 12px 12px' : '2px 12px 12px 12px', overflow: 'hidden', maxWidth: 240, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
            {imageLoading ? (
              <div style={{ width: 200, height: 150, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#999', fontSize: 13 }}>加载中...</span>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="图片消息"
                style={{ display: 'block', maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23f0f0f0" width="200" height="150"/><text fill="%23999" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em">图片加载失败</text></svg>';
                }}
              />
            ) : (
              <div style={{ width: 200, height: 150, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#999', fontSize: 13 }}>图片加载失败</span>
              </div>
            )}
          </div>
        );

      case im_server.MessageType.FILE:
        if (!content.fileMessage) return null;
        return (
          <div
            onClick={handleFileDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: isSelf ? '#95EC69' : '#fff',
              borderRadius: isSelf ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
              padding: '10px 14px',
              maxWidth: 280,
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#1890FF',
                flexShrink: 0,
              }}
            >
              <FileIcon style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#191919', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {content.fileMessage.fileName || '未命名文件'}
              </p>
              <p style={{ color: '#999', fontSize: 11, margin: 0, marginTop: 2 }}>{formatFileSize(Number(content.fileMessage.fileSize) || 0)}</p>
            </div>
            <Download style={{ width: 16, height: 16, color: '#07C160', flexShrink: 0 }} />
          </div>
        );

      case im_server.MessageType.SPEECH:
        if (!content.speechMessage?.fileContents) return null;
        return (
          <div>
            <button
              onClick={handleSpeechPlay}
              onContextMenu={handleContextMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isSelf ? '#95EC69' : '#fff',
                borderRadius: isSelf ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                padding: '8px 14px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                {isPlaying ? (
                  <Pause style={{ width: 16, height: 16, color: '#07C160' }} />
                ) : converting ? (
                  <span style={{ fontSize: 14 }}>⏳</span>
                ) : (
                  <Play style={{ width: 16, height: 16, color: '#07C160' }} />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {[3, 6, 5, 8, 4].map((h, i) => (
                  <div
                    key={i}
                    style={{ 
                      width: 2.5, 
                      height: h, 
                      background: '#07C160', 
                      borderRadius: 1.5,
                      opacity: isPlaying ? 1 : 0.6,
                      animation: isPlaying ? `wave ${0.5 + i * 0.1}s ease-in-out infinite` : 'none',
                    }}
                  />
                ))}
              </div>
              <span style={{ color: '#666', fontSize: 13 }}>5"</span>
            </button>
            {speechText && (
              <div style={{
                marginTop: 6,
                padding: '6px 10px',
                background: '#F5F5F5',
                borderRadius: 6,
                fontSize: 13,
                color: '#333',
                maxWidth: 280,
                wordBreak: 'break-word',
              }}>
                <span style={{ color: '#999', fontSize: 11, marginRight: 6 }}>转文字:</span>
                {speechText}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      paddingTop: 4,
      paddingBottom: 4,
      flexDirection: isSelf ? 'row-reverse' : 'row',
    }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <UserAvatar color="#07C160" initials={avatarInitials} size={38} imageData={message.sender?.avatar} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '65%',
        alignItems: isSelf ? 'flex-end' : 'flex-start',
      }}>
        {isGroup && !isSelf && (
          <span style={{ color: '#888', fontSize: 11, marginBottom: 4, paddingLeft: 2, paddingRight: 2 }}>
            {message.sender?.nickname}
          </span>
        )}
        {renderContent()}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onConvertToText={handleSpeechConvert}
        />
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}