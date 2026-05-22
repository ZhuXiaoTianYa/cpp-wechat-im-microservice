// ==================== Type Definitions ====================

export interface UserInfo {
  user_id: string;
  nickname: string;
  description: string;
  phone: string;
  avatar_color: string;
  avatar_initials: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'voice';

export interface MessageContent {
  type: MessageType;
  text?: string;
  file_id?: string;
  file_name?: string;
  file_size?: string;
  duration?: number;
  image_url?: string;
  voice_text?: string;
}

export interface Message {
  message_id: string;
  session_id: string;
  sender_id: string;
  sender: UserInfo;
  content: MessageContent;
  timestamp: number;
}

export interface ChatSession {
  session_id: string;
  session_name: string;
  session_type: 0 | 1; // 0=single, 1=group
  avatar_color: string;
  avatar_initials: string;
  member_ids: string[];
  last_message?: Message;
  unread_count: number;
  pinned: boolean;
}

export interface FriendRequest {
  event_id: string;
  sender: UserInfo;
  timestamp: number;
}

// ==================== Mock Users ====================

export const CURRENT_USER: UserInfo = {
  user_id: 'user_001',
  nickname: '张明',
  description: '永远不要停止探索',
  phone: '13800138001',
  avatar_color: '#07C160',
  avatar_initials: '张',
};

export const MOCK_USERS: Record<string, UserInfo> = {
  user_001: CURRENT_USER,
  user_002: {
    user_id: 'user_002',
    nickname: '李静',
    description: '热爱生活，热爱代码',
    phone: '13800138002',
    avatar_color: '#FF6B6B',
    avatar_initials: '李',
  },
  user_003: {
    user_id: 'user_003',
    nickname: '王磊',
    description: '前端工程师 | 摄影爱好者',
    phone: '13800138003',
    avatar_color: '#4ECDC4',
    avatar_initials: '王',
  },
  user_004: {
    user_id: 'user_004',
    nickname: '陈美',
    description: '今天也要好好加油！',
    phone: '13800138004',
    avatar_color: '#F7B731',
    avatar_initials: '陈',
  },
  user_005: {
    user_id: 'user_005',
    nickname: '刘建国',
    description: '技术改变世界',
    phone: '13800138005',
    avatar_color: '#A29BFE',
    avatar_initials: '刘',
  },
  user_006: {
    user_id: 'user_006',
    nickname: '赵文博',
    description: '产品经理，专注用户体验',
    phone: '13800138006',
    avatar_color: '#FD79A8',
    avatar_initials: '赵',
  },
  user_007: {
    user_id: 'user_007',
    nickname: '孙悦',
    description: '设计师 | UI/UX',
    phone: '13800138007',
    avatar_color: '#FDCB6E',
    avatar_initials: '孙',
  },
};

export const MOCK_FRIENDS: UserInfo[] = [
  MOCK_USERS['user_002'],
  MOCK_USERS['user_003'],
  MOCK_USERS['user_004'],
  MOCK_USERS['user_005'],
  MOCK_USERS['user_006'],
  MOCK_USERS['user_007'],
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  {
    event_id: 'req_001',
    sender: {
      user_id: 'user_008',
      nickname: '林小宇',
      description: '全栈开发工程师',
      phone: '13800138008',
      avatar_color: '#6C5CE7',
      avatar_initials: '林',
    },
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    event_id: 'req_002',
    sender: {
      user_id: 'user_009',
      nickname: '周晓燕',
      description: '数据分析师',
      phone: '13800138009',
      avatar_color: '#00B894',
      avatar_initials: '周',
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
  },
];

// ==================== Mock Sessions & Messages ====================

const now = Date.now();
const d = (minutes: number) => now - minutes * 60 * 1000;

export const MOCK_MESSAGES: Record<string, Message[]> = {
  session_001: [
    {
      message_id: 'msg_001_1',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '你好，今天会议几点开始？' },
      timestamp: d(120),
    },
    {
      message_id: 'msg_001_2',
      session_id: 'session_001',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: { type: 'text', text: '下午三点，在三楼会议室，记得提前准备一下PPT哦' },
      timestamp: d(118),
    },
    {
      message_id: 'msg_001_3',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '好的！我已经准备好了，还有什么需要注意的吗？' },
      timestamp: d(115),
    },
    {
      message_id: 'msg_001_4',
      session_id: 'session_001',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: {
        type: 'file',
        file_id: 'file_001',
        file_name: '项目进度报告_2026Q1.pdf',
        file_size: '2.4MB',
      },
      timestamp: d(110),
    },
    {
      message_id: 'msg_001_5',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '收到，我看一下📄' },
      timestamp: d(105),
    },
    {
      message_id: 'msg_001_6',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: {
        type: 'image',
        file_id: 'img_001',
        image_url: 'https://images.unsplash.com/photo-1723962807917-ffab0600929c?w=400&q=80',
      },
      timestamp: d(60),
    },
    {
      message_id: 'msg_001_7',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '今天午饭好好吃，哈哈😄' },
      timestamp: d(59),
    },
    {
      message_id: 'msg_001_8',
      session_id: 'session_001',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: {
        type: 'voice',
        file_id: 'voice_001',
        duration: 8,
        voice_text: '哈哈看起来不错，等会儿见！',
      },
      timestamp: d(50),
    },
    {
      message_id: 'msg_001_9',
      session_id: 'session_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '好的，等会儿见～' },
      timestamp: d(5),
    },
  ],
  session_002: [
    {
      message_id: 'msg_002_1',
      session_id: 'session_002',
      sender_id: 'user_003',
      sender: MOCK_USERS['user_003'],
      content: { type: 'text', text: '代码我已经提交到dev分支了' },
      timestamp: d(300),
    },
    {
      message_id: 'msg_002_2',
      session_id: 'session_002',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: { type: 'text', text: '好的，我review一下，有问题再沟通' },
      timestamp: d(295),
    },
    {
      message_id: 'msg_002_3',
      session_id: 'session_002',
      sender_id: 'user_003',
      sender: MOCK_USERS['user_003'],
      content: {
        type: 'image',
        file_id: 'img_002',
        image_url: 'https://images.unsplash.com/photo-1762436933065-fe6d7f51d4f3?w=400&q=80',
      },
      timestamp: d(200),
    },
    {
      message_id: 'msg_002_4',
      session_id: 'session_002',
      sender_id: 'user_003',
      sender: MOCK_USERS['user_003'],
      content: { type: 'text', text: '最近拍的照片，城市夜景还不错吧？' },
      timestamp: d(199),
    },
    {
      message_id: 'msg_002_5',
      session_id: 'session_002',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: { type: 'text', text: '哇，很好看！用什么设备拍的？' },
      timestamp: d(195),
    },
    {
      message_id: 'msg_002_6',
      session_id: 'session_002',
      sender_id: 'user_003',
      sender: MOCK_USERS['user_003'],
      content: { type: 'text', text: '索尼A7M4，最近入的手，摸索摸索中😊' },
      timestamp: d(180),
    },
  ],
  session_003: [
    {
      message_id: 'msg_003_1',
      session_id: 'session_003',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: { type: 'text', text: '设计稿看完了，整体感觉不错！有几个小地方建议调整一下' },
      timestamp: d(500),
    },
    {
      message_id: 'msg_003_2',
      session_id: 'session_003',
      sender_id: 'user_004',
      sender: MOCK_USERS['user_004'],
      content: { type: 'text', text: '好，你说说看，哪些地方需要改？' },
      timestamp: d(495),
    },
    {
      message_id: 'msg_003_3',
      session_id: 'session_003',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: {
        type: 'file',
        file_id: 'file_002',
        file_name: 'UI设计规范v2.0.sketch',
        file_size: '15.8MB',
      },
      timestamp: d(490),
    },
    {
      message_id: 'msg_003_4',
      session_id: 'session_003',
      sender_id: 'user_004',
      sender: MOCK_USERS['user_004'],
      content: { type: 'text', text: '好的，谢谢！我按照这个改一下' },
      timestamp: d(480),
    },
  ],
  session_group_001: [
    {
      message_id: 'msg_g001_1',
      session_id: 'session_group_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '大家好，明天Sprint Review提醒一下，记得准备演示' },
      timestamp: d(180),
    },
    {
      message_id: 'msg_g001_2',
      session_id: 'session_group_001',
      sender_id: 'user_003',
      sender: MOCK_USERS['user_003'],
      content: { type: 'text', text: '收到！前端部分我已经准备好了' },
      timestamp: d(175),
    },
    {
      message_id: 'msg_g001_3',
      session_id: 'session_group_001',
      sender_id: 'user_004',
      sender: MOCK_USERS['user_004'],
      content: { type: 'text', text: '后端API全部联调完成，没问题' },
      timestamp: d(170),
    },
    {
      message_id: 'msg_g001_4',
      session_id: 'session_group_001',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: {
        type: 'file',
        file_id: 'file_003',
        file_name: 'Sprint_20260507_演示材料.pptx',
        file_size: '8.2MB',
      },
      timestamp: d(150),
    },
    {
      message_id: 'msg_g001_5',
      session_id: 'session_group_001',
      sender_id: 'user_005',
      sender: MOCK_USERS['user_005'],
      content: { type: 'text', text: '好的，收到文件！大家明天加油💪' },
      timestamp: d(140),
    },
    {
      message_id: 'msg_g001_6',
      session_id: 'session_group_001',
      sender_id: 'user_002',
      sender: MOCK_USERS['user_002'],
      content: { type: 'text', text: '加油！相信大家都准备好了' },
      timestamp: d(30),
    },
  ],
  session_group_002: [
    {
      message_id: 'msg_g002_1',
      session_id: 'session_group_002',
      sender_id: 'user_005',
      sender: MOCK_USERS['user_005'],
      content: { type: 'text', text: '新的技术分享计划出来了，这周五下午分享WebSocket实战' },
      timestamp: d(720),
    },
    {
      message_id: 'msg_g002_2',
      session_id: 'session_group_002',
      sender_id: 'user_006',
      sender: MOCK_USERS['user_006'],
      content: { type: 'text', text: '很期待！WebSocket在IM系统里用得很多' },
      timestamp: d(715),
    },
    {
      message_id: 'msg_g002_3',
      session_id: 'session_group_002',
      sender_id: 'user_001',
      sender: CURRENT_USER,
      content: {
        type: 'voice',
        file_id: 'voice_002',
        duration: 12,
        voice_text: '这个主题不错，我也对Protobuf序列化感兴趣，顺便可以讲讲吗？',
      },
      timestamp: d(710),
    },
    {
      message_id: 'msg_g002_4',
      session_id: 'session_group_002',
      sender_id: 'user_005',
      sender: MOCK_USERS['user_005'],
      content: { type: 'text', text: '当然！Protobuf也会一起讲，大家到时候一起来👍' },
      timestamp: d(700),
    },
  ],
};

export const MOCK_SESSIONS: ChatSession[] = [
  {
    session_id: 'session_001',
    session_name: '李静',
    session_type: 0,
    avatar_color: '#FF6B6B',
    avatar_initials: '李',
    member_ids: ['user_001', 'user_002'],
    last_message: MOCK_MESSAGES['session_001'].at(-1),
    unread_count: 2,
    pinned: true,
  },
  {
    session_id: 'session_group_001',
    session_name: '项目开发群',
    session_type: 1,
    avatar_color: '#0984E3',
    avatar_initials: '项',
    member_ids: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'],
    last_message: MOCK_MESSAGES['session_group_001'].at(-1),
    unread_count: 5,
    pinned: true,
  },
  {
    session_id: 'session_002',
    session_name: '王磊',
    session_type: 0,
    avatar_color: '#4ECDC4',
    avatar_initials: '王',
    member_ids: ['user_001', 'user_003'],
    last_message: MOCK_MESSAGES['session_002'].at(-1),
    unread_count: 0,
    pinned: false,
  },
  {
    session_id: 'session_003',
    session_name: '陈美',
    session_type: 0,
    avatar_color: '#F7B731',
    avatar_initials: '陈',
    member_ids: ['user_001', 'user_004'],
    last_message: MOCK_MESSAGES['session_003'].at(-1),
    unread_count: 0,
    pinned: false,
  },
  {
    session_id: 'session_group_002',
    session_name: '技术讨论群',
    session_type: 1,
    avatar_color: '#6C5CE7',
    avatar_initials: '技',
    member_ids: ['user_001', 'user_003', 'user_005', 'user_006'],
    last_message: MOCK_MESSAGES['session_group_002'].at(-1),
    unread_count: 1,
    pinned: false,
  },
];

// ==================== Helpers ====================

export function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const date = new Date(timestamp);
  const today = new Date(now);

  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}分钟前`;

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (isToday) return timeStr;
  if (isYesterday) return `昨天 ${timeStr}`;
  return `${date.getMonth() + 1}/${date.getDate()} ${timeStr}`;
}

export function getMessagePreview(msg?: Message): string {
  if (!msg) return '';
  switch (msg.content.type) {
    case 'text':
      return msg.content.text || '';
    case 'image':
      return '[图片]';
    case 'file':
      return `[文件] ${msg.content.file_name}`;
    case 'voice':
      return '[语音]';
    default:
      return '';
  }
}
