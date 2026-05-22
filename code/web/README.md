<div align="center">

# IM 即时通讯系统 Web 前端

基于 React 19 + TypeScript + Protobuf 的即时通讯系统前端。

## 技术栈

- **React 19** - UI 框架
- **TypeScript 5.x** - 类型系统
- **Zustand** - 状态管理
- **Axios** - HTTP 请求
- **protobufjs** - Protobuf 编解码
- **Radix UI + Tailwind CSS** - UI 组件
- **Vite 6.x** - 构建工具

## 快速开始

*A WeChat-style instant messaging web application*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4-990000?logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

---

## 📖 项目简介

本项目是一个基于 **React 19** + **TypeScript** 的微信风格即时通讯 Web 前端应用，配合 C++ 后端实现完整的即时通讯功能。适用于校招项目展示，重点体现以下技术能力：

- 前端工程化与性能优化
- 状态管理与数据流设计
- 实时通讯与 WebSocket 应用
- 二进制协议（Protobuf）实践
- 微信风格 UI 还原能力

## ✨ 核心功能

| 功能模块 | 功能描述 | 技术实现 |
|---------|---------|----------|
| 用户认证 | 登录/注册/会话管理 | JWT Session + Zustand Persist |
| 好友管理 | 添加/同意/拒绝/删除好友 | HTTP API + 实时推送 |
| 即时通讯 | 文本/图片/文件消息 | WebSocket + Protobuf |
| 消息同步 | 消息历史/已读未读状态 | 本地存储 + 服务端同步 |
| 实时推送 | 新消息/好友申请通知 | WebSocket 长连接 |

## 🏗️ 技术选型

### 技术栈总览

| 技术领域 | 推荐方案 | 版本 | 核心理由 |
|---------|---------|------|---------|
| **核心框架** | React + TypeScript | 19.x + 5.x | Hooks 天然适配 WebSocket、Actions 优化 IM 场景 |
| **状态管理** | Zustand | 4.x | 轻量级零样板代码、完美配合 WebSocket |
| **HTTP 请求** | Axios | 1.x | 原生支持二进制、拦截器适配 Protobuf |
| **WebSocket** | 原生 API + 封装 | - | 完全控制重连逻辑、无额外依赖 |
| **Protobuf** | protobufjs | 7.x | 浏览器支持最佳、完整 TS 支持 |
| **UI 样式** | Tailwind CSS | 4.x | 原子化 CSS、完全自定义微信风格 |
| **构建工具** | Vite | 6.x | HMR 快速、构建优化 |

### 为什么选择 Zustand？

```typescript
// 零样板代码 - 无需 actions/reducers/middleware
// 原生 Immer 支持 - 安全地"直接修改"嵌套状态
// 完美配合 WebSocket - store 外部直接调用 setState

interface IMStore {
  currentUser: UserInfo | null;
  sessions: Map<string, ChatSession>;
  messages: Map<string, Message[]>;
  friends: Map<string, UserInfo>;
  wsConnected: boolean;
}

export const useIMStore = create<IMStore>()(
  persist(
    immer((set) => ({
      // 简洁的状态定义
    })),
    { name: 'im-storage' }
  )
);
```

### 为什么选择 Axios + Protobuf？

```typescript
// 请求拦截：自动 Protobuf 编码
apiClient.interceptors.request.use((config) => {
  const MessageType = config.data.constructor;
  if (MessageType.encode) {
    config.data = MessageType.encode(config.data).finish().buffer;
  }
  return config;
});

// 响应拦截：自动 Protobuf 解码
apiClient.interceptors.response.use((response) => {
  const ResponseType = response.config.metadata?.responseType;
  return ResponseType.decode(new Uint8Array(response.data));
});
```

## 🏗️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户端                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌─────────────┐    ┌─────────────────┐   │
│   │  Pages  │───►│ Components  │───►│  Store (Zustand) │   │
│   └─────────┘    └─────────────┘    └────────┬────────┘   │
│                                              │              │
│   ┌─────────┐    ┌─────────────┐    ┌────────▼────────┐   │
│   │  Hooks  │───►│  Services   │───►│  API (Axios)    │   │
│   └─────────┘    └─────────────┘    └────────┬────────┘   │
│                                              │              │
│   ┌──────────────────────────────────────────┴─────────┐   │
│   │              Protobuf (二进制协议)                  │   │
│   └──────────────────────────────────────────────────┘   │
│                            │                              │
├────────────────────────────┼──────────────────────────────┤
│                     网络通讯层                              │
│   ┌───────────────────────┴───────────────────────────┐  │
│   │         HTTP (Axios)        │    WebSocket       │  │
│   │         /service/*          │    /ws/*           │  │
│   └─────────────────────────────┴─────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                      C++ Backend                          │
│                   (API: 9000 / WebSocket: 9001)          │
└────────────────────────────────────────────────────────────┘
```

### 项目结构

```
im-web/
├── src/
│   ├── api/                    # API 请求封装
│   │   ├── client.ts          # Axios 实例 + 拦截器
│   │   ├── user.ts            # 用户接口
│   │   ├── friend.ts          # 好友接口
│   │   └── message.ts         # 消息接口
│   ├── components/             # React 组件
│   │   ├── chat/              # 聊天组件
│   │   │   ├── SessionList.tsx # 会话列表
│   │   │   ├── ChatArea.tsx   # 聊天区域
│   │   │   └── MessageBubble.tsx # 消息气泡
│   │   ├── common/            # 通用组件
│   │   └── profile/           # 个人资料
│   ├── pages/                  # 页面组件
│   │   ├── LoginPage.tsx      # 登录页
│   │   ├── ChatPage.tsx       # 聊天页
│   │   └── ContactsPage.tsx   # 通讯录页
│   ├── proto/                  # Protobuf 生成代码
│   ├── services/               # 业务逻辑
│   │   ├── websocket.ts       # WebSocket 封装
│   │   └── message-handler.ts # 消息分发
│   ├── store/                  # Zustand Store
│   │   └── useIMStore.ts      # IM 状态管理
│   ├── styles/                 # 全局样式
│   └── utils/                  # 工具函数
├── deploy/                     # 部署配置
│   └── im-web.conf            # Nginx 配置
├── docs/                       # 技术文档
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## � 核心实现

### 1. Zustand 状态管理

完整的 IM Store 设计，涵盖用户、会话、消息、好友、WebSocket 状态：

```typescript
interface IMStore {
  // 用户状态
  currentUser: UserInfo | null;
  sessionId: string | null;

  // 会话与消息
  sessions: Map<string, ChatSession>;
  messages: Map<string, Message[]>;
  activeSessionId: string | null;

  // 好友
  friends: Map<string, UserInfo>;
  pendingFriendRequests: FriendEvent[];

  // WebSocket
  wsConnected: boolean;
  wsReconnecting: boolean;
  wsReconnectAttempts: number;

  // 未读计数
  unreadCount: Map<string, number>;
}

// Actions
login: (sessionId: string, user: UserInfo) => void;
logout: () => void;
addMessage: (sessionId: string, msg: Message) => void;
setFriends: (friends: UserInfo[]) => void;
setWSStatus: (connected: boolean, reconnecting?: boolean) => void;
```

**关键特性**：
- Immer 中间件：`immer()` 支持"直接修改"嵌套状态
- Persist 中间件：自动持久化到 localStorage
- Map 结构：高效的消息和好友数据管理

### 2. WebSocket 封装

完整的 WebSocket 客户端封装，包含心跳检测和自动重连：

```typescript
export class IMWebSocket {
  private ws: WebSocket | null = null;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  connect(sessionId: string) {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onmessage = async (event) => {
      const blob = await event.data.blob();
      const buffer = await blob.arrayBuffer();
      const notify = im_server.NotifyMessage.decode(new Uint8Array(buffer));
      handleNotifyMessage(notify);
    };
  }

  // 指数退避重连：1s → 2s → 4s → ... → 30s
  private scheduleReconnect() {
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    setTimeout(() => this.connect(this.sessionId), this.reconnectDelay);
  }
}
```

**关键特性**：
- 二进制消息处理（Blob → ArrayBuffer → Protobuf）
- 指数退避重连策略
- 心跳检测机制
- 手动/自动断开控制

### 3. Axios + Protobuf 集成

请求/响应拦截器自动处理 Protobuf 编解码：

```typescript
// 请求拦截：编码
apiClient.interceptors.request.use((config) => {
  if (config.data?.constructor?.encode) {
    config.data = config.data.constructor.encode(config.data).finish().buffer;
  }
  return config;
});

// 响应拦截：解码
apiClient.interceptors.response.use((response) => {
  const ResponseType = response.config.metadata?.responseType;
  return ResponseType.decode(new Uint8Array(response.data));
});
```

### 4. 消息处理器

根据通知类型分发到对应的 Store action：

```typescript
export function handleNotifyMessage(notify: INotifyMessage) {
  switch (notify.notifyType) {
    case CHAT_MESSAGE_NOTIFY:
      handleNewMessage(notify.newMessageInfo);    // 消息
      break;
    case FRIEND_ADD_APPLY_NOTIFY:
      handleFriendAddApply(notify.friendAddApply); // 好友申请
      break;
    case FRIEND_ADD_PROCESS_NOTIFY:
      handleFriendAddProcess(notify.friendProcessResult); // 申请处理
      break;
    case CHAT_SESSION_CREATE_NOTIFY:
      handleNewChatSession(notify.newChatSessionInfo); // 新会话
      break;
    case FRIEND_REMOVE_NOTIFY:
      handleFriendRemove(notify.friendRemove); // 好友删除
      break;
  }
}
```

## 🎨 微信风格 UI

### 配色方案

| 元素 | 颜色值 | CSS 变量 |
|------|--------|----------|
| 主题绿 | `#07C160` | `--wechat-primary` |
| 背景灰 | `#EDEDED` | `--wechat-bg-gray` |
| 自己的气泡 | `#95EC69` | `--wechat-bubble-self` |
| 对方的气泡 | `#FFFFFF` | `--wechat-bubble-other` |
| 边框 | `#D9D9D9` | `--wechat-border` |
| 主要文字 | `#191919` | `--wechat-text-primary` |
| 次要文字 | `#ABABAB` | `--wechat-text-secondary` |

## 🚀 快速开始

### 环境要求

| 组件 | 版本要求 |
|------|----------|
| Node.js | >= 18.0.0 |
| pnpm | >= 8.0.0 |

### 安装启动

```bash
# 克隆项目
git clone <repository_url>
cd im-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

### 构建部署

```bash
# 生产构建
pnpm build

# 预览构建
pnpm preview
```

## 🌐 部署指南

### Nginx 部署

```bash
# 1. 构建项目
pnpm build

# 2. 上传构建产物
scp -r dist/* user@server:/var/www/im_web/

# 3. 配置 Nginx
sudo cp deploy/im-web.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/im-web.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

### Nginx 配置要点

```nginx
server {
    listen 10001;
    root /var/www/im_web/dist;

    # React Router 支持 SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /service/ {
        proxy_pass http://localhost:9000/service/;
    }

    # WebSocket 代理（长连接）
    location /ws/ {
        proxy_pass http://localhost:9001/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 7d;
    }
}
```

## � 技术文档

| 文档 | 内容 |
|------|------|
| [技术选型总览](./docs/01-技术选型总览.md) | 核心技术栈及选型理由 |
| [完整依赖清单](./docs/02-完整依赖清单.md) | package.json 详解 |
| [Zustand 状态管理](./docs/03-Zustand状态管理方案.md) | Store 完整设计 |
| [Axios 配置方案](./docs/04-Axios配置方案.md) | HTTP + Protobuf 集成 |
| [WebSocket 方案](./docs/05-WebSocket封装方案.md) | 实时通讯封装 |
| [Protobuf 类型生成](./docs/06-Protobuf类型生成方案.md) | 从 .proto 生成 TS 类型 |
| [Vite 配置方案](./docs/07-Vite配置方案.md) | 构建工具配置 |
| [项目结构](./docs/09-项目结构建议.md) | 代码组织规范 |

## 🔧 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 代码检查 |

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|----------|
| 页面空白 | 检查 `try_files` 配置和 `root` 路径 |
| API 请求失败 | 确认后端运行在 9000 端口 |
| WebSocket 连接失败 | 检查 `Upgrade` 头和 `proxy_http_version 1.1` |

## 📝 License

[MIT License](LICENSE)

---

<div align="center">

**Built with ❤️ for my C++ IM Backend**

</div>
