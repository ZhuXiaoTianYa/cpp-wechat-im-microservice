# React 19 新特性应用

## 当前项目使用的 React 特性

### 1. React 19 + TypeScript 5.x

本项目使用 React 19 配合 TypeScript 5.x，提供完整的类型安全。

### 2. Vite 6.x 构建

使用 Vite 6.x 作为构建工具，享受快速热更新和优化的生产构建。

### 3. 状态管理：Zustand

使用 Zustand 4.x 进行状态管理，配合 Immer 和 Persist 中间件。

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

interface IMStore {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}

export const useIMStore = create<IMStore>()(
  persist(
    immer((set) => ({
      user: null,
      setUser: (user) => set({ user }),
    })),
    { name: 'im-storage' }
  )
);
```

### 4. 路由：React Router 7

使用 React Router 7 (react-router-dom 7.x) 进行路由管理。

```typescript
import { Routes, Route, Navigate } from 'react-router';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<MainLayout />}>
        <Route path="chat" element={<ChatPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}
```

### 5. WebSocket 即时通讯

使用原生 WebSocket API 进行实时消息推送。

```typescript
const ws = new WebSocket(wsUrl);
ws.onmessage = async (event) => {
  const blob = await event.data.blob();
  const notify = im_server.NotifyMessage.decode(new Uint8Array(buffer));
  handleNotifyMessage(notify);
};
```

### 6. Tailwind CSS v4

使用 Tailwind CSS v4 进行样式开发。

```typescript
<div className="flex items-center p-4 bg-wechat-bg-gray">
  <span className="text-wechat-text-primary">消息</span>
</div>
```

## 推荐的 React 19 未来升级

### 1. React Compiler (Babel 插件)

当 React Compiler 稳定后，可以添加：

```typescript
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '19'
    }]
  ]
};
```

### 2. use() Hook

React 19 引入了 `use()` Hook，可以直接在组件中读取 Promise 或 Context：

```typescript
// 未来可以使用
import { use } from 'react';

function MessageList({ messagesPromise }) {
  const messages = use(messagesPromise);
  return messages.map(msg => <MessageBubble key={msg.id} msg={msg} />);
}
```

### 3. Actions 和 useFormStatus

表单处理可以使用新的 Actions 特性：

```typescript
// 未来可以使用
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>提交</button>;
}
```

## TypeScript 5.x 特性使用

### 1. 装饰器支持

项目配置了实验性装饰器支持：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 2. 路径别名

TypeScript 配置了路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. 严格模式

启用了严格的类型检查：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```
