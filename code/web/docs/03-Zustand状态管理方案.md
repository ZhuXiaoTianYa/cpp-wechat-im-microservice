# Zustand 状态管理方案

## Store 结构设计

### 主 Store: useIMStore.ts

```typescript
// src/store/useIMStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { im_server } from '@/proto/generated';

export interface IMStore {
  // ========== 用户状态 ==========
  currentUser: im_server.IUserInfo | null;
  sessionId: string | null;

  // ========== 会话与消息 ==========
  sessions: Map<string, im_server.IChatSessionInfo>;
  messages: Map<string, im_server.IMessageInfo[]>;
  activeSessionId: string | null;

  // ========== 好友列表 ==========
  friends: Map<string, im_server.IUserInfo>;
  pendingFriendRequests: im_server.IFriendEvent[];

  // ========== WebSocket 状态 ==========
  wsConnected: boolean;
  wsReconnecting: boolean;
  wsReconnectAttempts: number;

  // ========== UI 状态 ==========
  unreadCount: Map<string, number>;

  // ========== Actions: 用户 ==========
  login: (sessionId: string, user: im_server.IUserInfo) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<im_server.IUserInfo>) => void;

  // ========== Actions: 会话 ==========
  setSessions: (sessions: im_server.IChatSessionInfo[]) => void;
  updateSession: (session: im_server.IChatSessionInfo) => void;
  removeSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string | null) => void;

  // ========== Actions: 消息 ==========
  addMessage: (sessionId: string, msg: im_server.IMessageInfo) => void;
  setMessages: (sessionId: string, msgs: im_server.IMessageInfo[]) => void;
  prependMessages: (sessionId: string, msgs: im_server.IMessageInfo[]) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;

  // ========== Actions: 好友 ==========
  setFriends: (friends: im_server.IUserInfo[]) => void;
  addFriend: (friend: im_server.IUserInfo) => void;
  removeFriend: (userId: string) => void;
  setPendingRequests: (requests: im_server.IFriendEvent[]) => void;
  addPendingFriendRequest: (request: im_server.IFriendEvent) => void;
  removePendingFriendRequest: (eventId: string) => void;

  // ========== Actions: WebSocket ==========
  setWSStatus: (connected: boolean, reconnecting?: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;

  // ========== Actions: UI ==========
  incrementUnread: (sessionId: string) => void;
  clearUnread: (sessionId: string) => void;
}

export const useIMStore = create<IMStore>()(
  persist(
    immer((set) => ({
      // ========== 初始状态 ==========
      currentUser: null,
      sessionId: null,
      sessions: new Map(),
      messages: new Map(),
      activeSessionId: null,
      friends: new Map(),
      pendingFriendRequests: [],
      wsConnected: false,
      wsReconnecting: false,
      wsReconnectAttempts: 0,
      unreadCount: new Map(),

      // ========== 用户 Actions ==========
      login: (sessionId, user) => set((state) => {
        state.sessionId = sessionId;
        state.currentUser = user;
      }),

      logout: () => set((state) => {
        state.sessionId = null;
        state.currentUser = null;
        state.sessions.clear();
        state.messages.clear();
        state.friends.clear();
        state.pendingFriendRequests = [];
        state.activeSessionId = null;
        state.unreadCount.clear();
      }),

      updateCurrentUser: (updates) => set((state) => {
        if (state.currentUser) {
          Object.assign(state.currentUser, updates);
        }
      }),

      // ========== 会话 Actions ==========
      setSessions: (sessions) => set((state) => {
        state.sessions.clear();
        sessions.forEach((session) => {
          if (session.chatSessionId) {
            state.sessions.set(session.chatSessionId, session);
          }
        });
      }),

      updateSession: (session) => set((state) => {
        if (session.chatSessionId) {
          state.sessions.set(session.chatSessionId, session);
        }
      }),

      removeSession: (sessionId) => set((state) => {
        state.sessions.delete(sessionId);
        state.messages.delete(sessionId);
        state.unreadCount.delete(sessionId);
        if (state.activeSessionId === sessionId) {
          state.activeSessionId = null;
        }
      }),

      setActiveSession: (sessionId) => set((state) => {
        state.activeSessionId = sessionId;
        if (sessionId) {
          state.unreadCount.set(sessionId, 0);
        }
      }),

      // ========== 消息 Actions ==========
      addMessage: (sessionId, msg) => set((state) => {
        if (!state.messages.has(sessionId)) {
          state.messages.set(sessionId, []);
        }
        state.messages.get(sessionId)!.push(msg);

        // 更新会话的最后一条消息
        const session = state.sessions.get(sessionId);
        if (session) {
          session.prevMessage = msg;
        }

        // 如果不是当前活跃会话，增加未读数
        if (state.activeSessionId !== sessionId) {
          const current = state.unreadCount.get(sessionId) || 0;
          state.unreadCount.set(sessionId, current + 1);
        }
      }),

      setMessages: (sessionId, msgs) => set((state) => {
        state.messages.set(sessionId, msgs);
      }),

      prependMessages: (sessionId, msgs) => set((state) => {
        if (!state.messages.has(sessionId)) {
          state.messages.set(sessionId, []);
        }
        state.messages.get(sessionId)!.unshift(...msgs);
      }),

      deleteMessage: (sessionId, messageId) => set((state) => {
        const msgs = state.messages.get(sessionId);
        if (msgs) {
          const index = msgs.findIndex((m) => m.messageId === messageId);
          if (index !== -1) {
            msgs.splice(index, 1);
          }
        }
      }),

      // ========== 好友 Actions ==========
      setFriends: (friends) => set((state) => {
        state.friends.clear();
        friends.forEach((friend) => {
          if (friend.userId) {
            state.friends.set(friend.userId, friend);
          }
        });
      }),

      addFriend: (friend) => set((state) => {
        if (friend.userId) {
          state.friends.set(friend.userId, friend);
        }
      }),

      removeFriend: (userId) => set((state) => {
        state.friends.delete(userId);
      }),

      setPendingRequests: (requests) => set((state) => {
        state.pendingFriendRequests = requests;
      }),

      addPendingFriendRequest: (request) => set((state) => {
        state.pendingFriendRequests.push(request);
      }),

      removePendingFriendRequest: (eventId) => set((state) => {
        state.pendingFriendRequests = state.pendingFriendRequests.filter(
          (r) => r.eventId !== eventId
        );
      }),

      // ========== WebSocket Actions ==========
      setWSStatus: (connected, reconnecting = false) => set((state) => {
        state.wsConnected = connected;
        state.wsReconnecting = reconnecting;
      }),

      incrementReconnectAttempts: () => set((state) => {
        state.wsReconnectAttempts += 1;
      }),

      resetReconnectAttempts: () => set((state) => {
        state.wsReconnectAttempts = 0;
      }),

      // ========== UI Actions ==========
      incrementUnread: (sessionId) => set((state) => {
        const current = state.unreadCount.get(sessionId) || 0;
        state.unreadCount.set(sessionId, current + 1);
      }),

      clearUnread: (sessionId) => set((state) => {
        state.unreadCount.set(sessionId, 0);
      }),
    })),
    {
      name: 'im-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        sessionId: state.sessionId,
      }),
    }
  )
);
```

## 命名规范

**重要**: 本项目使用 Protobuf 生成的 TypeScript 类型，属性命名遵循 camelCase 规范：

| Protobuf 字段 | TypeScript 属性 | 说明 |
|--------------|-----------------|------|
| chat_session_id | chatSessionId | 会话ID |
| message_id | messageId | 消息ID |
| prev_message | prevMessage | 最后一条消息 |
| user_id | userId | 用户ID |
| session_id | sessionId | 会话ID |
| event_id | eventId | 事件ID |
| sender_id | senderId | 发送者ID |

## 持久化配置

Store 使用 `persist` 中间件进行数据持久化，只保存用户登录状态：

```typescript
{
  name: 'im-store',
  partialize: (state) => ({
    currentUser: state.currentUser,
    sessionId: state.sessionId,
  }),
}
```

## 使用示例

### 在组件中使用

```typescript
import { useIMStore } from '@/store/useIMStore';

function ChatPage() {
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const sessions = useIMStore((state) => Array.from(state.sessions.values()));

  // ...
}
```

### 在 Store 外部更新状态

```typescript
import { useIMStore } from '@/store/useIMStore';

// WebSocket 消息回调中直接更新
const store = useIMStore.getState();
store.addMessage(sessionId, newMessage);
```

### 订阅状态变化

```typescript
const unsubscribe = useIMStore.subscribe(
  (state) => state.wsConnected,
  (wsConnected) => {
    console.log('WebSocket 状态变化:', wsConnected);
  }
);

// 组件卸载时取消订阅
unsubscribe();
```

## 中间件说明

### immer 中间件

使用 `immer` 中间件可以直接修改嵌套状态：

```typescript
// 直接修改，不需要手动创建新对象
set((state) => {
  state.messages.get(sessionId)!.push(newMessage);
});
```

### persist 中间件

使用 `persist` 中间件将状态持久化到 localStorage：

```typescript
persist(
  immer((set, get) => ({ /* ... */ })),
  {
    name: 'im-store',
    partialize: (state) => ({ /* 只持久化部分状态 */ }),
  }
)
```
