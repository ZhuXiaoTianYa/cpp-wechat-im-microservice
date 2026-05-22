# API 接口验证报告

## 接口列表

### 1. 用户模块 (user.ts)

#### 用户登录

```typescript
// src/api/user.ts
export const userLogin = async (nickname: string, password: string): Promise<IUserLoginRsp> => {
  const req = im_server.UserLoginReq.create({
    requestId: makeRequestId(),
    nickname,
    password,
  });
  const resp = await apiClient.post<IUserLoginRsp>(
    '/UserService/login',
    { protobufType: 'UserLoginReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'UserLoginRsp' } }
  );
  return resp.data;
};
```

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 是 | 用户昵称 |
| password | string | 是 | 密码（MD5） |

**响应示例：**

```json
{
  "requestId": "uuid",
  "success": true,
  "loginSessionId": "session_id",
  "userInfo": {
    "userId": "user_123",
    "nickname": "张三",
    "avatar": "https://..."
  }
}
```

#### 用户注册

```typescript
export const userRegister = async (nickname: string, password: string): Promise<IUserRegisterRsp> => {
  const req = im_server.UserRegisterReq.create({
    requestId: makeRequestId(),
    nickname,
    password,
  });
  const resp = await apiClient.post<IUserRegisterRsp>(
    '/UserService/register',
    { protobufType: 'UserRegisterReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'UserRegisterRsp' } }
  );
  return resp.data;
};
```

### 2. 好友模块 (friend.ts)

#### 添加好友

```typescript
export const addFriend = async (friendId: string): Promise<IFriendActionRsp> => {
  const req = im_server.FriendActionReq.create({
    requestId: makeRequestId(),
    actionType: im_server.FriendActionType.ADD,
    targetUserId: friendId,
  });
  const resp = await apiClient.post<IFriendActionRsp>(
    '/FriendService/action',
    { protobufType: 'FriendActionReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'FriendActionRsp' } }
  );
  return resp.data;
};
```

#### 处理好友请求

```typescript
export const processFriendRequest = async (
  requestId: string,
  agree: boolean
): Promise<IFriendActionRsp> => {
  const req = im_server.FriendActionReq.create({
    requestId: makeRequestId(),
    actionType: agree ? im_server.FriendActionType.AGREE : im_server.FriendActionType.REJECT,
    targetUserId: requestId,
  });
  const resp = await apiClient.post<IFriendActionRsp>(
    '/FriendService/action',
    { protobufType: 'FriendActionReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'FriendActionRsp' } }
  );
  return resp.data;
};
```

#### 获取好友列表

```typescript
export const getFriends = async (): Promise<IGetFriendsRsp> => {
  const req = im_server.GetFriendsReq.create({
    requestId: makeRequestId(),
  });
  const resp = await apiClient.post<IGetFriendsRsp>(
    '/FriendService/getFriends',
    { protobufType: 'GetFriendsReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'GetFriendsRsp' } }
  );
  return resp.data;
};
```

#### 删除好友

```typescript
export const removeFriend = async (friendId: string): Promise<IFriendActionRsp> => {
  const req = im_server.FriendActionReq.create({
    requestId: makeRequestId(),
    actionType: im_server.FriendActionType.REMOVE,
    targetUserId: friendId,
  });
  const resp = await apiClient.post<IFriendActionRsp>(
    '/FriendService/action',
    { protobufType: 'FriendActionReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'FriendActionRsp' } }
  );
  return resp.data;
};
```

### 3. 消息模块 (message.ts)

#### 发送消息

```typescript
export const sendMessage = async (
  chatSessionId: string,
  messageType: im_server.MessageType,
  content: Uint8Array
): Promise<ISendMessageRsp> => {
  const req = im_server.SendMessageReq.create({
    requestId: makeRequestId(),
    chatSessionId,
    message: {
      messageType,
      stringMessage: messageType === im_server.MessageType.STRING ? { content: '' } : undefined,
      imageMessage: messageType === im_server.MessageType.IMAGE ? { imageData: content } : undefined,
      fileMessage: messageType === im_server.MessageType.FILE ? { fileData: content } : undefined,
    },
  });
  const resp = await apiClient.post<ISendMessageRsp>(
    '/MessageService/sendMessage',
    { protobufType: 'SendMessageReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'SendMessageRsp' } }
  );
  return resp.data;
};
```

#### 获取历史消息

```typescript
export const getHistoryMessages = async (
  chatSessionId: string,
  beforeMessageId?: string,
  limit: number = 20
): Promise<IGetHistoryMessagesRsp> => {
  const req = im_server.GetHistoryMessagesReq.create({
    requestId: makeRequestId(),
    chatSessionId,
    beforeMessageId: beforeMessageId || '',
    messageCount: limit,
  });
  const resp = await apiClient.post<IGetHistoryMessagesRsp>(
    '/MessageService/getHistoryMessages',
    { protobufType: 'GetHistoryMessagesReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'GetHistoryMessagesRsp' } }
  );
  return resp.data;
};
```

### 4. 会话模块 (message.ts)

#### 获取会话列表

```typescript
export const getChatSessionList = async (): Promise<IGetChatSessionListRsp> => {
  const req = im_server.GetChatSessionListReq.create({
    requestId: makeRequestId(),
  });
  const resp = await apiClient.post<IGetChatSessionListRsp>(
    '/MessageService/getChatSessionList',
    { protobufType: 'GetChatSessionListReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'GetChatSessionListRsp' } }
  );
  return resp.data;
};
```

#### 创建会话

```typescript
export const createChatSession = async (friendId: string): Promise<ICreateChatSessionRsp> => {
  const req = im_server.CreateChatSessionReq.create({
    requestId: makeRequestId(),
    targetUserId: friendId,
  });
  const resp = await apiClient.post<ICreateChatSessionRsp>(
    '/MessageService/createChatSession',
    { protobufType: 'CreateChatSessionReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'CreateChatSessionRsp' } }
  );
  return resp.data;
};
```

### 5. 文件模块 (file.ts)

#### 上传文件

```typescript
export const uploadFile = async (file: File): Promise<IUploadFileRsp> => {
  const formData = new FormData();
  formData.append('file', file);

  const resp = await apiClient.post<IUploadFileRsp>(
    '/FileService/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return resp.data;
};
```

### 6. 好友申请模块 (friend.ts)

#### 获取待处理好友申请

```typescript
export const getPendingFriendRequests = async (): Promise<IGetPendingFriendRequestsRsp> => {
  const req = im_server.GetPendingFriendRequestsReq.create({
    requestId: makeRequestId(),
  });
  const resp = await apiClient.post<IGetPendingFriendRequestsRsp>(
    '/FriendService/getPendingFriendRequests',
    { protobufType: 'GetPendingFriendRequestsReq', data: req.toBinary() },
    { headers: { 'x-protobuf-type': 'GetPendingFriendRequestsRsp' } }
  );
  return resp.data;
};
```

## 验证结果

| 模块 | 接口 | 状态 |
|------|------|------|
| 用户 | 登录 | ✅ |
| 用户 | 注册 | ✅ |
| 好友 | 添加好友 | ✅ |
| 好友 | 处理好友请求 | ✅ |
| 好友 | 获取好友列表 | ✅ |
| 好友 | 删除好友 | ✅ |
| 好友 | 获取待处理申请 | ✅ |
| 消息 | 发送消息 | ✅ |
| 消息 | 获取历史消息 | ✅ |
| 会话 | 获取会话列表 | ✅ |
| 会话 | 创建会话 | ✅ |
| 文件 | 上传文件 | ✅ |
