/**
 * 格式化工具函数
 */
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { im_server } from '@/proto/generated';

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  
  if (isYesterday(date)) {
    return `昨天 ${format(date, 'HH:mm')}`;
  }
  
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return format(date, 'EEEE HH:mm', { locale: zhCN });
  }
  
  if (now.getFullYear() === date.getFullYear()) {
    return format(date, 'MM-dd HH:mm');
  }
  
  return format(date, 'yyyy-MM-dd HH:mm');
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), {
    addSuffix: true,
    locale: zhCN,
  });
}

export function getMessagePreview(message?: im_server.IMessageInfo['message']): string {
  if (!message) return '';
  
  switch (message.messageType) {
    case im_server.MessageType.STRING:
      return message.stringMessage?.content || '';
    case im_server.MessageType.IMAGE:
      return '[图片]';
    case im_server.MessageType.FILE:
      return `[文件] ${message.fileMessage?.fileName || ''}`;
    case im_server.MessageType.SPEECH:
      return '[语音]';
    default:
      return '';
  }
}
