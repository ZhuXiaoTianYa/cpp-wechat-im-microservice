# Vite 配置方案

## vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/service': {
        target: 'http://211.159.146.107:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

## 环境变量配置

### .env.development

```env
VITE_API_BASE_URL=http://211.159.146.107:9000
VITE_WS_URL=ws://211.159.146.107:9001
VITE_APP_TITLE=IM 即时通讯
```

### 使用环境变量

```typescript
const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
const wsURL = import.meta.env.VITE_WS_URL;
```

## Tailwind CSS 配置

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wechat-primary': '#07C160',
        'wechat-bg-gray': '#EDEDED',
        'wechat-bubble-self': '#95EC69',
        'wechat-bubble-other': '#FFFFFF',
        'wechat-border': '#D9D9D9',
        'wechat-text-primary': '#191919',
        'wechat-text-secondary': '#ABABAB',
        'wechat-hover': '#E0DEDE',
        'wechat-active': '#C9C7C7',
      },
    },
  },
  plugins: [],
}
```

## PostCSS 配置

### postcss.config.mjs

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

## 全局样式

### src/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* WeUI 主题色 */
  --wechat-primary: #07C160;
  --wechat-primary-light: rgba(7, 193, 96, 0.18);

  /* 背景色 */
  --wechat-bg-gray: #EDEDED;
  --wechat-bg-sidebar: #2C2C2C;
  --wechat-bg-list: #EBE9E9;
  --wechat-bg-page: #F5F5F5;
  --wechat-bg-card: #FFFFFF;

  /* 消息气泡 */
  --wechat-bubble-self: #95EC69;
  --wechat-bubble-other: #FFFFFF;

  /* 边框 */
  --wechat-border: #D9D9D9;
  --wechat-border-light: #F0F0F0;

  /* 文字颜色 */
  --wechat-text-primary: #191919;
  --wechat-text-secondary: #ABABAB;
  --wechat-text-hint: #888;
  --wechat-text-disabled: #BBB;

  /* 状态颜色 */
  --wechat-danger: #F5222D;
  --wechat-warning: #FFA500;
  --wechat-success: #07C160;
  --wechat-info: #1890FF;

  /* 交互 */
  --wechat-hover: #E0DEDE;
  --wechat-active: #C9C7C7;

  /* 尺寸 */
  --wechat-header-height: 54px;
  --wechat-list-item-height: 64px;
}
```

## 微信配色方案

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| `--wechat-primary` | #07C160 | 主题绿 |
| `--wechat-primary-light` | rgba(7, 193, 96, 0.18) | 主题绿浅色 |
| `--wechat-bg-gray` | #EDEDED | 背景灰 |
| `--wechat-bg-sidebar` | #2C2C2C | 侧边栏背景 |
| `--wechat-bubble-self` | #95EC69 | 自己消息气泡 |
| `--wechat-bubble-other` | #FFFFFF | 对方消息气泡 |
| `--wechat-border` | #D9D9D9 | 边框 |
| `--wechat-text-primary` | #191919 | 主要文字 |
| `--wechat-text-secondary` | #ABABAB | 次要文字 |
