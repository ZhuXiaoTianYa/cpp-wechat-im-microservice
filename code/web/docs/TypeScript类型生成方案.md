# TypeScript 类型生成方案

## 从 .proto 生成 .d.ts 的完整流程

### 步骤 1: 安装依赖

```bash
npm install -D protobufjs-cli
npm install protobufjs
```

### 步骤 2: 创建生成脚本

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "proto:gen": "npm run proto:js && npm run proto:ts",
    "proto:js": "pbjs -t static-module -w es6 --es6 -o src/proto/generated.js ../repositories/gitee/cpp-wechat-im-microservice/code/server/proto/*.proto",
    "proto:ts": "pbts -o src/proto/generated.d.ts src/proto/generated.js",
    "proto:watch": "nodemon --watch ../repositories/gitee/cpp-wechat-im-microservice/code/server/proto -e proto -x 'npm run proto:gen'"
  }
}
```

### 步骤 3: 执行生成

```bash
pnpm run proto:gen
```

### 步骤 4: 生成的类型定义示例

```typescript
export namespace im_server {
  interface IUserInfo {
    user_id?: string | null;
    nickname?: string | null;
    description?: string | null;
    phone?: string | null;
    avatar?: Uint8Array | null;
  }

  class UserInfo implements IUserInfo {
    constructor(properties?: im_server.IUserInfo);
    user_id: string;
    nickname: string;
    description: string;
    phone: string;
    avatar: Uint8Array;
    static create(properties?: im_server.IUserInfo): UserInfo;
    static encode(message: UserInfo, writer?: protobuf.Writer): protobuf.Writer;
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): UserInfo;
  }

  interface IMessageContent {
    message_type?: MessageType | null;
    string_message?: IStringMessageInfo | null;
    image_message?: IImageMessageInfo | null;
    file_message?: IFileMessageInfo | null;
    speech_message?: ISpeechMessageInfo | null;
  }

  class MessageContent implements IMessageContent {
    message_type: MessageType;
    string_message?: StringMessageInfo | null;
    image_message?: ImageMessageInfo | null;
    file_message?: FileMessageInfo | null;
    speech_message?: SpeechMessageInfo | null;
    msg_content?: ("string_message" | "image_message" | "file_message" | "speech_message");
  }

  enum MessageType {
    STRING = 0,
    IMAGE = 1,
    FILE = 2,
    SPEECH = 3
  }

  enum NotifyType {
    FRIEND_ADD_APPLY_NOTIFY = 0,
    FRIEND_ADD_PROCESS_NOTIFY = 1,
    CHAT_SESSION_CREATE_NOTIFY = 2,
    CHAT_MESSAGE_NOTIFY = 3,
    FRIEND_REMOVE_NOTIFY = 4
  }
}
```

### 步骤 5: 在代码中使用

```typescript
import { im_server } from '@/proto/generated';

const message: im_server.IMessageContent = {
  message_type: im_server.MessageType.STRING,
  string_message: {
    content: 'Hello World',
  },
};

const encoded = im_server.MessageContent.encode(
  im_server.MessageContent.create(message)
).finish();

const decoded = im_server.MessageContent.decode(buffer);
if (decoded.msg_content === 'string_message') {
  console.log(decoded.string_message?.content);
}
```

## 处理 oneof 字段的类型守卫

创建 `src/utils/proto-helpers.ts`：

```typescript
import { im_server } from '@/proto/generated';

export function isTextMessage(
  content: im_server.MessageContent
): content is im_server.MessageContent & { string_message: im_server.StringMessageInfo } {
  return content.msg_content === 'string_message' && !!content.string_message;
}

export function isImageMessage(
  content: im_server.MessageContent
): content is im_server.MessageContent & { image_message: im_server.ImageMessageInfo } {
  return content.msg_content === 'image_message' && !!content.image_message;
}

export function isFileMessage(
  content: im_server.MessageContent
): content is im_server.MessageContent & { file_message: im_server.FileMessageInfo } {
  return content.msg_content === 'file_message' && !!content.file_message;
}

export function isSpeechMessage(
  content: im_server.MessageContent
): content is im_server.MessageContent & { speech_message: im_server.SpeechMessageInfo } {
  return content.msg_content === 'speech_message' && !!content.speech_message;
}
```

使用示例：

```typescript
import { isTextMessage, isImageMessage } from '@/utils/proto-helpers';

if (isTextMessage(message.message)) {
  console.log(message.message.string_message.content);
} else if (isImageMessage(message.message)) {
  console.log(message.message.image_message.image_content);
}
```

## 处理 bytes 类型

Protobuf 的 `bytes` 类型在 JavaScript 中会被转换为 `Uint8Array`，需要进行转换：

```typescript
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function uint8ArrayToBlobURL(bytes: Uint8Array, mimeType: string): string {
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
```

使用示例：

```typescript
const avatarURL = uint8ArrayToBlobURL(userInfo.avatar, 'image/jpeg');

<img src={avatarURL} alt="Avatar" />

const file = event.target.files[0];
const bytes = await fileToUint8Array(file);
const req = im_server.SetUserAvatarReq.create({
  request_id: crypto.randomUUID(),
  session_id: sessionId,
  avatar: bytes,
});
```

## 动态加载 Proto（开发环境）

如果需要在开发环境中动态加载 proto 文件：

```typescript
import protobuf from 'protobufjs';

export async function loadProtoDefinitions() {
  const root = await protobuf.load([
    '/proto/base.proto',
    '/proto/user.proto',
    '/proto/friend.proto',
    '/proto/message.proto',
    '/proto/notify.proto',
  ]);
  
  return {
    UserLoginReq: root.lookupType('im_server.UserLoginReq'),
    UserLoginRsp: root.lookupType('im_server.UserLoginRsp'),
    MessageInfo: root.lookupType('im_server.MessageInfo'),
    NotifyMessage: root.lookupType('im_server.NotifyMessage'),
  };
}
```

## TypeScript 配置

确保 `tsconfig.json` 包含以下配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "@proto/*": ["./src/proto/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```
