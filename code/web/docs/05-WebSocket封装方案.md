# WebSocket 封装方案

## 核心封装类

### src/services/websocket.ts

```typescript
/**
 * WebSocket 客户端封装
 * 管理长连接、心跳、重连
 */
import { im_server } from '@/proto/generated';
import { handleNotifyMessage } from './message-handler';
import { useIMStore } from '@/store/useIMStore';

export class IMWebSocket {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private isManualClose = false;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private connectionStartTime: number = 0;

  constructor(private wsUrl: string = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:9001`) {}

  connect(sessionId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] 已连接，跳过重复连接');
      return;
    }

    this.sessionId = sessionId;
    this.isManualClose = false;
    this.connectionStartTime = Date.now();

    try {
      console.log(`[WebSocket] 正在连接到 ${this.wsUrl}`);
      this.ws = new WebSocket(this.wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[WebSocket] 连接失败:', error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      const elapsed = Date.now() - this.connectionStartTime;
      console.log(`[WebSocket] 连接已建立，耗时 ${elapsed}ms`);
      useIMStore.getState().setWSStatus(true, false);
      useIMStore.getState().resetReconnectAttempts();
      this.reconnectDelay = 1000;

      this.sendAuthentication();
      this.startHeartbeatCheck();
    };

    this.ws.onmessage = async (event) => {
      try {
        const blob = event.data as Blob;
        const buffer = await blob.arrayBuffer();
        const notify = im_server.NotifyMessage.decode(new Uint8Array(buffer));
        console.log(`[WebSocket] 收到消息，类型: ${notify.notifyType}`);
        handleNotifyMessage(notify);
      } catch (error) {
        console.error('[WebSocket] 解析消息失败:', error);
      }
    };

    this.ws.onerror = (error) => {
      const duration = Date.now() - this.connectionStartTime;
      console.error('[WebSocket] 错误:', error);
      console.error(`[WebSocket] 当前连接状态: ${this.ws?.readyState}`);
      console.error(`[WebSocket] 连接持续时间: ${duration}ms`);
    };

    this.ws.onclose = (event) => {
      const duration = Date.now() - this.connectionStartTime;
      console.log(`[WebSocket] 连接已断开`);
      console.log(`[WebSocket] 关闭码: ${event.code} (${this.getCloseCodeDescription(event.code)})`);
      console.log(`[WebSocket] 关闭原因: ${event.reason || '无'}`);
      console.log(`[WebSocket] 连接持续时间: ${duration}ms`);
      console.log(`[WebSocket] 是否手动关闭: ${this.isManualClose}`);

      this.stopHeartbeatCheck();
      useIMStore.getState().setWSStatus(false, false);

      if (!this.isManualClose) {
        console.log('[WebSocket] 非手动关闭，触发重连逻辑');
        this.scheduleReconnect();
      }
    };
  }

  private getCloseCodeDescription(code: number): string {
    const descriptions: Record<number, string> = {
      1000: '正常关闭',
      1001: '端点正在离开',
      1002: '协议错误',
      1003: '不支持的数据类型',
      1004: '保留',
      1005: '无状态码',
      1006: '异常关闭',
      1007: '数据格式错误',
      1008: '策略冲突',
      1009: '消息过大',
      1010: '缺少扩展',
      1011: '服务器内部错误',
    };
    return descriptions[code] || '未知';
  }

  private sendAuthentication() {
    if (!this.ws || !this.sessionId || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] 无法发送鉴权，连接状态:', this.ws?.readyState);
      return;
    }

    const authReq = im_server.ClientAuthenticationReq.create({
      requestId: crypto.randomUUID(),
      sessionId: this.sessionId,
    });

    const buffer = im_server.ClientAuthenticationReq.encode(authReq).finish();
    this.ws.send(buffer);
    console.log('[WebSocket] 已发送鉴权消息');
  }

  /**
   * 启动连接状态检测
   * 定期检查 WebSocket 连接状态
   *
   * 注意：WebSocket 协议会自动处理服务器的 ping 帧，浏览器会自动响应 pong
   * 不需要前端手动发送心跳，后端发送的 ping 会由浏览器自动响应
   */
  private startHeartbeatCheck() {
    this.stopHeartbeatCheck();

    this.heartbeatTimer = setInterval(() => {
      if (!this.ws) {
        console.warn('[WebSocket] 状态检测: WebSocket 实例为空');
        return;
      }

      const connectionDuration = Date.now() - this.connectionStartTime;

      console.log(`[WebSocket] 状态检测 | 连接状态: ${this.getReadyStateText(this.ws.readyState)} | 连接时长: ${connectionDuration}ms`);

      if (this.ws.readyState !== WebSocket.OPEN) {
        console.warn(`[WebSocket] 状态检测: 连接非 OPEN 状态 (${this.getReadyStateText(this.ws.readyState)})，准备重连`);
        this.stopHeartbeatCheck();
        this.scheduleReconnect();
      }
    }, 30000);
  }

  private getReadyStateText(state: number): string {
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    return states[state] || 'UNKNOWN';
  }

  private stopHeartbeatCheck() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
      console.log('[WebSocket] 心跳检测已停止');
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      console.log('[WebSocket] 重连定时器已存在，跳过');
      return;
    }

    useIMStore.getState().setWSStatus(false, true);
    useIMStore.getState().incrementReconnectAttempts();

    console.log(`[WebSocket] ${this.reconnectDelay / 1000}秒后尝试重连...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      if (this.sessionId) {
        console.log('[WebSocket] 执行重连...');
        this.connect(this.sessionId);
      } else {
        console.warn('[WebSocket] 无法重连: sessionId 为空');
      }

      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    }, this.reconnectDelay);
  }

  disconnect() {
    console.log('[WebSocket] 手动断开连接');
    this.isManualClose = true;
    this.stopHeartbeatCheck();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    useIMStore.getState().setWSStatus(false, false);
    console.log('[WebSocket] 已手动断开');
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionInfo() {
    return {
      readyState: this.ws?.readyState,
      readyStateText: this.ws ? this.getReadyStateText(this.ws.readyState) : 'NONE',
      duration: this.connectionStartTime ? Date.now() - this.connectionStartTime : 0,
    };
  }
}

export const imWebSocket = new IMWebSocket();
```

## 消息处理器

### src/services/message-handler.ts

```typescript
/**
 * WebSocket 消息处理器
 * 根据通知类型分发到对应的 Store action
 */
import { im_server } from '@/proto/generated';
import { useIMStore } from '@/store/useIMStore';

export function handleNotifyMessage(notify: im_server.INotifyMessage) {
  switch (notify.notifyType) {
    case im_server.NotifyType.CHAT_MESSAGE_NOTIFY:
      handleNewMessage(notify.newMessageInfo);
      break;

    case im_server.NotifyType.FRIEND_ADD_APPLY_NOTIFY:
      handleFriendAddApply(notify.friendAddApply);
      break;

    case im_server.NotifyType.FRIEND_ADD_PROCESS_NOTIFY:
      handleFriendAddProcess(notify.friendProcessResult);
      break;

    case im_server.NotifyType.CHAT_SESSION_CREATE_NOTIFY:
      handleNewChatSession(notify.newChatSessionInfo);
      break;

    case im_server.NotifyType.FRIEND_REMOVE_NOTIFY:
      handleFriendRemove(notify.friendRemove);
      break;

    default:
      console.warn('未知通知类型:', notify.notifyType);
  }
}

function handleNewMessage(newMessageInfo: im_server.INotifyNewMessage | null | undefined) {
  if (!newMessageInfo?.messageInfo) return;

  const msg = newMessageInfo.messageInfo;
  const store = useIMStore.getState();

  store.addMessage(msg.chatSessionId || '', msg);
  console.log('收到新消息:', {
    sessionId: msg.chatSessionId,
    sender: msg.sender?.nickname,
    type: msg.message?.messageType,
  });
}

function handleFriendAddApply(friendAddApply: im_server.INotifyFriendAddApply | null | undefined) {
  if (!friendAddApply?.userInfo) return;

  const store = useIMStore.getState();
  const event: im_server.IFriendEvent = {
    eventId: crypto.randomUUID(),
    sender: friendAddApply.userInfo,
  };

  store.addPendingFriendRequest(event);
  console.log('收到好友申请:', friendAddApply.userInfo.nickname);
}

function handleFriendAddProcess(friendProcessResult: im_server.INotifyFriendAddProcess | null | undefined) {
  if (!friendProcessResult) return;

  const { agree, userInfo } = friendProcessResult;

  if (agree && userInfo) {
    const store = useIMStore.getState();
    store.addFriend(userInfo);
    console.log('好友申请已同意:', userInfo.nickname);
  } else {
    console.log('好友申请已拒绝');
  }
}

function handleNewChatSession(newChatSessionInfo: im_server.INotifyNewChatSession | null | undefined) {
  if (!newChatSessionInfo?.chatSessionInfo) return;

  const session = newChatSessionInfo.chatSessionInfo;
  const store = useIMStore.getState();

  store.updateSession(session);
  console.log('新建会话:', session.chatSessionName);
}

function handleFriendRemove(friendRemove: im_server.INotifyFriendRemove | null | undefined) {
  if (!friendRemove?.userId) return;

  const store = useIMStore.getState();
  store.removeFriend(friendRemove.userId);
  console.log('好友已删除:', friendRemove.userId);
}
```

## 关键特性

### 1. 动态 URL

WebSocket URL 根据当前页面协议动态生成：

```typescript
private wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:9001`
```

### 2. 自动心跳

**重要**: 本实现不手动发送 ping 帧，而是依赖浏览器自动响应服务器的 ping。

```typescript
/**
 * 启动连接状态检测
 * 定期检查 WebSocket 连接状态
 *
 * 注意：WebSocket 协议会自动处理服务器的 ping 帧，浏览器会自动响应 pong
 * 不需要前端手动发送心跳，后端发送的 ping 会由浏览器自动响应
 */
private startHeartbeatCheck() {
  // 每 30 秒检查一次连接状态
  this.heartbeatTimer = setInterval(() => {
    // 检查连接是否为 OPEN 状态
    if (this.ws?.readyState !== WebSocket.OPEN) {
      // 触发重连
    }
  }, 30000);
}
```

### 3. 指数退避重连

重连延迟从 1 秒开始，最大 30 秒，每次重连失败后延迟翻倍：

```typescript
this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
```

### 4. 状态码描述

详细的 WebSocket 关闭码日志：

```typescript
private getCloseCodeDescription(code: number): string {
  const descriptions: Record<number, string> = {
    1000: '正常关闭',
    1001: '端点正在离开',
    1002: '协议错误',
    1006: '异常关闭',
    // ...
  };
  return descriptions[code] || '未知';
}
```

## 使用示例

### 连接 WebSocket

```typescript
import { imWebSocket } from '@/services/websocket';
import { useIMStore } from '@/store/useIMStore';

// 登录成功后连接
const sessionId = loginResponse.loginSessionId;
imWebSocket.connect(sessionId);
```

### 断开连接

```typescript
// 退出登录时断开
imWebSocket.disconnect();
useIMStore.getState().logout();
```

### 检查连接状态

```typescript
import { imWebSocket } from '@/services/websocket';

// 检查是否已连接
if (imWebSocket.isConnected()) {
  console.log('WebSocket 已连接');
}

// 获取连接详情
const info = imWebSocket.getConnectionInfo();
console.log('连接状态:', info.readyStateText);
console.log('连接时长:', info.duration, 'ms');
```

### 在组件中使用

```typescript
import { useIMStore } from '@/store/useIMStore';

function ConnectionStatus() {
  const wsConnected = useIMStore((state) => state.wsConnected);
  const wsReconnecting = useIMStore((state) => state.wsReconnecting);

  return (
    <div>
      {wsConnected ? '已连接' : wsReconnecting ? '重连中...' : '未连接'}
    </div>
  );
}
```
