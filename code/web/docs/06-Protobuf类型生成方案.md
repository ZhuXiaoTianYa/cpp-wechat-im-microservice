# Protobuf 类型生成方案

## 生成脚本配置

### package.json 脚本

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

## 执行生成

```bash
cd /home/zhutian/client/web

pnpm run proto:gen
```

## 生成的类型定义示例

生成后的 `src/proto/generated.d.ts` 包含完整的 TypeScript 类型定义：

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

  enum MessageType {
    STRING = 0,
    IMAGE = 1,
    FILE = 2,
    SPEECH = 3
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
}
```

## 类型守卫工具

### src/utils/proto-helpers.ts

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

## bytes 类型处理工具

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

## 使用示例

### 创建消息

```typescript
import { im_server } from '@/proto/generated';

const textMessage = im_server.MessageContent.create({
  message_type: im_server.MessageType.STRING,
  string_message: {
    content: 'Hello World',
  },
});

const encoded = im_server.MessageContent.encode(textMessage).finish();
```

### 解码消息

```typescript
const decoded = im_server.MessageContent.decode(buffer);

if (isTextMessage(decoded)) {
  console.log(decoded.string_message.content);
}
```

### 处理头像

```typescript
import { uint8ArrayToBlobURL, fileToUint8Array } from '@/utils/proto-helpers';

const avatarURL = uint8ArrayToBlobURL(userInfo.avatar, 'image/jpeg');

const file = event.target.files[0];
const bytes = await fileToUint8Array(file);
await setUserAvatar(sessionId, bytes);
```

## TypeScript 配置

确保 `tsconfig.json` 包含正确的路径映射：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@proto/*": ["./src/proto/*"]
    }
  }
}
```
