# Axios HTTP 请求配置方案

## 核心配置

### src/api/client.ts

```typescript
/**
 * API 客户端配置
 * 基于 Axios 封装，支持 Protobuf 二进制传输
 */
import axios, { AxiosError } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      responseType: any;
    };
  }
}

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/x-protobuf'
  },
  responseType: 'arraybuffer',
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === 'object') {
      const MessageType = config.data.constructor;
      if (MessageType.encode) {
        const uint8Array = MessageType.encode(config.data).finish();
        config.data = uint8Array.buffer.slice(
          uint8Array.byteOffset,
          uint8Array.byteOffset + uint8Array.byteLength
        );
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const ResponseType = response.config.metadata?.responseType;
    if (!ResponseType) {
      throw new Error('Response type not specified in metadata');
    }

    const decoded = ResponseType.decode(new Uint8Array(response.data));

    if (!decoded.success) {
      const error = new Error(decoded.errmsg || '请求失败');
      (error as any).businessError = true;
      (error as any).errorMessage = decoded.errmsg;
      throw error;
    }

    return decoded;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## API 模块封装

### src/api/user.ts

```typescript
/**
 * 用户 API 模块
 * 包含用户注册、登录、信息管理等接口
 */
import apiClient from './client';
import { im_server } from '@/proto/generated';
import { makeRequestId } from '@/utils/id-generator';

/**
 * 获取手机验证码
 */
export async function getPhoneVerifyCode(
  phoneNumber: string
): Promise<im_server.PhoneVerifyCodeRsp> {
  const req = im_server.PhoneVerifyCodeReq.create({
    requestId: makeRequestId(),
    phoneNumber: phoneNumber,
  });

  return apiClient.post('/service/user/get_phone_verify_code', req, {
    metadata: { responseType: im_server.PhoneVerifyCodeRsp },
  });
}

/**
 * 用户名密码注册
 */
export async function usernameRegister(
  nickname: string,
  password: string,
  verifyCodeId?: string,
  verifyCode?: string
): Promise<im_server.UserRegisterRsp> {
  const reqData: im_server.IUserRegisterReq = {
    requestId: makeRequestId(),
    nickname,
    password,
  };

  if (verifyCodeId) reqData.verifyCodeId = verifyCodeId;
  if (verifyCode) reqData.verifyCode = verifyCode;

  const req = im_server.UserRegisterReq.create(reqData);

  return apiClient.post('/service/user/username_register', req, {
    metadata: { responseType: im_server.UserRegisterRsp },
  });
}

/**
 * 用户名密码登录
 */
export async function usernameLogin(
  nickname: string,
  password: string,
  verifyCodeId?: string,
  verifyCode?: string
): Promise<im_server.UserLoginRsp> {
  const reqData: im_server.IUserLoginReq = {
    requestId: makeRequestId(),
    nickname,
    password,
  };

  if (verifyCodeId) reqData.verifyCodeId = verifyCodeId;
  if (verifyCode) reqData.verifyCode = verifyCode;

  const req = im_server.UserLoginReq.create(reqData);

  return apiClient.post('/service/user/username_login', req, {
    metadata: { responseType: im_server.UserLoginRsp },
  });
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo(
  sessionId: string
): Promise<im_server.GetUserInfoRsp> {
  const req = im_server.GetUserInfoReq.create({
    requestId: makeRequestId(),
    sessionId,
  });

  return apiClient.post('/service/user/get_user_info', req, {
    metadata: { responseType: im_server.GetUserInfoRsp },
  });
}

/**
 * 设置用户头像
 */
export async function setUserAvatar(
  sessionId: string,
  avatar: Uint8Array
): Promise<im_server.SetUserAvatarRsp> {
  const req = im_server.SetUserAvatarReq.create({
    requestId: makeRequestId(),
    sessionId,
    avatar,
  });

  return apiClient.post('/service/user/set_avatar', req, {
    metadata: { responseType: im_server.SetUserAvatarRsp },
  });
}
```

### src/api/friend.ts

```typescript
/**
 * 好友 API 模块
 * 包含好友管理、会话管理等接口
 */
import apiClient from './client';
import { im_server } from '@/proto/generated';
import { makeRequestId } from '@/utils/id-generator';

/**
 * 获取好友列表
 */
export async function getFriendList(
  sessionId: string,
  userId: string
): Promise<im_server.GetFriendListRsp> {
  const req = im_server.GetFriendListReq.create({
    requestId: makeRequestId(),
    sessionId,
    userId,
  });

  return apiClient.post('/service/friend/get_friend_list', req, {
    metadata: { responseType: im_server.GetFriendListRsp },
  });
}

/**
 * 发送好友申请
 */
export async function friendAdd(
  sessionId: string,
  respondentId: string,
  userId: string
): Promise<im_server.FriendAddRsp> {
  const req = im_server.FriendAddReq.create({
    requestId: makeRequestId(),
    sessionId,
    respondentId,
    userId,
  });

  return apiClient.post('/service/friend/add_friend_apply', req, {
    metadata: { responseType: im_server.FriendAddRsp },
  });
}

/**
 * 获取会话列表
 */
export async function getChatSessionList(
  sessionId: string
): Promise<im_server.GetChatSessionListRsp> {
  const req = im_server.GetChatSessionListReq.create({
    requestId: makeRequestId(),
    sessionId,
  });

  return apiClient.post('/service/friend/get_chat_session_list', req, {
    metadata: { responseType: im_server.GetChatSessionListRsp },
  });
}

/**
 * 创建会话
 */
export async function chatSessionCreate(
  sessionId: string,
  memberIds: string[],
  groupName?: string
): Promise<im_server.CreateChatSessionRsp> {
  const req = im_server.CreateChatSessionReq.create({
    requestId: makeRequestId(),
    sessionId,
    memberIds,
    groupName,
  });

  return apiClient.post('/service/friend/create_chat_session', req, {
    metadata: { responseType: im_server.CreateChatSessionRsp },
  });
}
```

## ID 生成工具

### src/utils/id-generator.ts

```typescript
/**
 * ID 生成工具
 */
export function makeRequestId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `R${id}`;
}

export function makeMessageId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `M${id}`;
}

export function makeEventId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `E${id}`;
}
```

## 请求流程

1. **创建请求对象**: 使用 Protobuf 的 `create()` 方法创建请求消息
2. **设置请求ID**: 使用 `makeRequestId()` 生成唯一请求ID
3. **发送请求**: 通过 `apiClient.post()` 发送二进制数据
4. **指定响应类型**: 在 `metadata.responseType` 中指定 Protobuf 响应类型
5. **自动解码**: 响应拦截器自动将二进制响应解码为 Protobuf 对象

## 错误处理

### src/utils/error-handler.ts

```typescript
/**
 * 错误处理工具
 */
export function handleAPIError(error: any): string {
  if (error.businessError) {
    return error.errorMessage || '操作失败';
  }

  if (error.code === 'ECONNABORTED') {
    return '请求超时，请检查网络连接';
  }

  if (error.response) {
    switch (error.response.status) {
      case 401:
        return '登录已过期，请重新登录';
      case 403:
        return '没有权限执行此操作';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return `请求失败 (${error.response.status})`;
    }
  }

  if (error.request) {
    return '网络连接失败，请检查网络';
  }

  return error.message || '未知错误';
}
```

## 使用示例

```typescript
import { getUserInfo } from '@/api/user';
import { handleAPIError } from '@/utils/error-handler';
import { toast } from 'sonner';

try {
  const response = await getUserInfo(sessionId);
  console.log('用户信息:', response.userInfo);
} catch (error) {
  toast.error(handleAPIError(error));
}
```
