# 微信风格即时通讯系统 (WeChat-Style IM Microservice)

> 基于微服务架构的高性能即时通讯系统，后端采用 C++ brpc 构建，前端使用 React + TypeScript，支持多端接入。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![C++](https://img.shields.io/badge/C++-17-orange.svg)](https://en.cppreference.com/)
[![brpc](https://img.shields.io/badge/brpc-Baidu-blue.svg)](https://github.com/apache/brpc)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 项目概览

本项目是一个**企业级即时通讯系统**，采用微服务架构设计，支持文本、图片、文件、语音等多种消息类型，提供完整的好友管理、会话管理和实时消息推送能力。

### 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web UI    │  │   Qt Client │  │   App (TBD) │            │
│  │  React + TS │  │   Qt 6.x    │  │   Flutter   │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼─────────────────────┐
│                        网关层                                    │
│              ┌───────────────────────────────┐                  │
│              │        Gateway Server         │                  │
│              │  HTTP(9000) + WebSocket(9001) │                  │
│              │  Protobuf 编解码              │                  │
│              │  服务发现 / 负载均衡           │                  │
│              └───────────────┬───────────────┘                  │
└───────────────────────────────┼──────────────────────────────────┘
                               │
┌───────────────────────────────▼──────────────────────────────────┐
│                        微服务层                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │   User    │  │  Friend   │  │  Message  │  │ Transmite │   │
│  │ 用户服务  │  │ 好友服务  │  │ 消息存储  │  │ 消息转发  │   │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘   │
│  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼──────────────────┐      │
│  │   File    │  │  Speech   │  │       etcd            │      │
│  │ 文件服务  │  │ 语音服务  │  │    (服务发现/配置)      │      │
│  └───────────┘  └───────────┘  └────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                               │
┌───────────────────────────────▼──────────────────────────────────┐
│                        数据层                                    │
│        ┌───────────┐  ┌───────────┐  ┌───────────────┐         │
│        │   Redis   │  │  MySQL    │  │ Elasticsearch │         │
│        │ 会话/缓存  │  │ 用户/关系  │  │   消息索引    │         │
│        └───────────┘  └───────────┘  └───────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

### 后端技术栈（重点）

| 技术 | 版本 | 用途 |
|------|------|------|
| **C++** | 17 | 核心开发语言 |
| **brpc** | 1.6.x | 高性能 RPC 框架 |
| **etcd** | 3.5.x | 服务发现与配置管理 |
| **Redis** | 7.x | 分布式会话与缓存 |
| **MySQL** | 8.0 | 用户数据与关系存储 |
| **Elasticsearch** | 8.x | 消息全文检索 |
| **Protobuf** | 3.x | 高效序列化协议 |
| **glog** | - | 日志系统 |
| **gflags** | - | 命令行参数管理 |

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19 | UI 框架 |
| **TypeScript** | 5.x | 类型系统 |
| **Zustand** | 4.x | 状态管理 |
| **Axios** | 1.x | HTTP 请求 |
| **Tailwind CSS** | 4.x | 样式框架 |
| **protobufjs** | 7.x | Protobuf 编解码 |
| **Vite** | 6.x | 构建工具 |

### 客户端

| 平台 | 技术 | 状态 |
|------|------|------|
| **桌面端** | Qt 6.11 | 已实现 |
| **移动端** | Flutter | 待开发 |

---

## 📁 项目结构

```
cpp-wechat-im-microservice/
├── code/                          # 代码目录
│   ├── server/                    # 后端微服务（核心）
│   │   ├── proto/                 # Protobuf 接口定义
│   │   │   ├── base.proto         # 基础消息结构
│   │   │   ├── user.proto         # 用户服务接口
│   │   │   ├── friend.proto       # 好友服务接口
│   │   │   ├── message.proto      # 消息存储接口
│   │   │   ├── transmite.proto    # 消息转发接口
│   │   │   ├── file.proto         # 文件服务接口
│   │   │   ├── speech.proto       # 语音服务接口
│   │   │   ├── notify.proto       # 通知推送接口
│   │   │   └── gateway.proto      # 网关路由定义
│   │   ├── gateway/               # 网关服务
│   │   ├── user/                  # 用户服务
│   │   ├── friend/                # 好友服务
│   │   ├── message/               # 消息存储服务
│   │   ├── transmite/             # 消息转发服务
│   │   ├── file/                  # 文件服务
│   │   ├── speech/                # 语音服务
│   │   ├── third/                 # 第三方依赖
│   │   ├── conf/                  # 服务配置文件
│   │   └── build/                 # 编译输出目录
│   ├── web/                       # 前端 Web
│   │   ├── src/                   # 源代码
│   │   ├── docs/                  # 技术文档
│   │   ├── figma/                 # 设计原型
│   │   └── proto/                 # Protobuf 生成文件
│   └── client/                    # Qt 客户端
│       └── ChatClient/            # 桌面客户端代码
├── doxygen/                       # 后端 API 文档
├── openapi.yaml                   # OpenAPI 接口规范
├── docker-compose.yml             # Docker 部署配置
├── README.md                      # 项目说明
└── README.en.md                   # 英文说明
```

---

## 🚀 快速开始

### 环境要求

- **操作系统**: Linux (推荐 Ubuntu 22.04)
- **编译器**: GCC 11+
- **CMake**: 3.20+
- **Docker**: 20.10+ (可选)

### 方式一：本地编译运行

#### 1. 安装依赖

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y \
    gcc g++ cmake make \
    libprotobuf-dev protobuf-compiler \
    libgflags-dev libgoogle-glog-dev \
    libmysqlclient-dev libhiredis-dev \
    libssl-dev zlib1g-dev

# 安装 brpc（需从源码编译）
git clone https://github.com/apache/brpc.git
cd brpc && sh config_brpc.sh --headers=/usr/include --libs=/usr/lib
make && sudo make install
```

#### 2. 编译后端服务

```bash
cd /path/to/cpp-wechat-im-microservice/code/server
mkdir -p build && cd build
cmake ..
make -j$(nproc)
make install
```

#### 3. 配置服务

编辑 `code/server/conf/` 目录下的配置文件，配置数据库连接等信息：

```bash
# 示例：配置网关服务
vim code/server/conf/gateway_server.conf
```

#### 4. 启动服务

```bash
# 启动顺序：依赖服务 → 核心服务 → 网关
cd code/server/build/bin

# 启动用户服务
./user_server --flagfile=../conf/user_server.conf &

# 启动好友服务
./friend_server --flagfile=../conf/friend_server.conf &

# 启动消息存储服务
./message_server --flagfile=../conf/message_server.conf &

# 启动消息转发服务
./transmite_server --flagfile=../conf/transmite_server.conf &

# 启动文件服务
./file_server --flagfile=../conf/file_server.conf &

# 启动语音服务
./speech_server --flagfile=../conf/speech_server.conf &

# 启动网关服务（最后启动）
./gateway_server --flagfile=../conf/gateway_server.conf &
```

### 方式二：Docker 部署

#### 1. 拉取镜像

```bash
# 拉取所有服务镜像
docker pull zhuxiaotianyaqwq/im-gateway:latest
docker pull zhuxiaotianyaqwq/im-user:latest
docker pull zhuxiaotianyaqwq/im-friend:latest
docker pull zhuxiaotianyaqwq/im-message:latest
docker pull zhuxiaotianyaqwq/im-transmite:latest
docker pull zhuxiaotianyaqwq/im-file:latest
docker pull zhuxiaotianyaqwq/im-speech:latest
```

#### 2. 使用 Docker Compose

```bash
cd /path/to/cpp-wechat-im-microservice
docker-compose up -d
```

### 启动前端

```bash
cd code/web
npm install
npm run dev
```

---

## 🔌 API 接口

### 服务端口

| 服务 | 端口 | 协议 |
|------|------|------|
| Gateway HTTP | 9000 | HTTP |
| Gateway WebSocket | 9001 | WebSocket |

### 接口规范

所有接口采用 **HTTP + Protobuf** 协议：

- **Content-Type**: `application/x-protobuf`
- **请求方法**: POST
- **状态码**: 统一返回 200，业务结果由响应体 `success` 字段判断

### 主要接口路径

| 服务 | 接口 | 路径 |
|------|------|------|
| 用户服务 | 注册 | `/service/user/username_register` |
| 用户服务 | 登录 | `/service/user/username_login` |
| 用户服务 | 获取验证码 | `/service/user/get_phone_verify_code` |
| 好友服务 | 获取好友列表 | `/service/friend/get_friend_list` |
| 好友服务 | 添加好友 | `/service/friend/add_friend_apply` |
| 好友服务 | 创建会话 | `/service/friend/create_chat_session` |
| 消息服务 | 获取历史消息 | `/service/message_storage/get_history` |
| 消息服务 | 搜索消息 | `/service/message_storage/search_history` |
| 转发服务 | 发送消息 | `/service/message_transmit/new_message` |
| 文件服务 | 上传文件 | `/service/file/put_single_file` |
| 语音服务 | 语音识别 | `/service/speech/recognition` |

---

## 📊 核心功能

### 用户管理
- ✅ 用户名密码注册/登录
- ✅ 手机号验证码注册/登录
- ✅ 用户信息管理（昵称、头像、签名）
- ✅ 单点登录限制

### 好友管理
- ✅ 好友申请与审批
- ✅ 好友列表查询
- ✅ 好友搜索
- ✅ 好友删除

### 会话管理
- ✅ 单聊会话创建
- ✅ 群聊会话创建
- ✅ 会话列表查询
- ✅ 会话成员管理

### 消息功能
- ✅ 文本消息
- ✅ 图片消息
- ✅ 文件消息
- ✅ 语音消息
- ✅ 消息历史查询
- ✅ 消息全文搜索
- ✅ 实时消息推送（WebSocket）

---

## 🔧 开发工具

### 后端开发

| 工具 | 用途 |
|------|------|
| **CLion** | C++ 集成开发环境 |
| **Doxygen** | API 文档生成 |
| **gdb/lldb** | 调试工具 |

### 前端开发（AI 辅助）

本项目前端代码主要通过 **Cursor** 和 **Trae AI** 辅助开发，体现了 AI 工具在现代前端开发中的高效应用：

- ✅ 使用 AI 生成 Protobuf TypeScript 类型定义
- ✅ 使用 AI 优化状态管理方案（Zustand）
- ✅ 使用 AI 实现 WebSocket 封装与重连逻辑
- ✅ 使用 Figma 进行 UI 原型设计，参考 WeUI 组件库

---

## 📝 文档

| 文档 | 路径 | 说明 |
|------|------|------|
| API 文档 | `doxygen/docs/` | 后端 Doxygen 文档 |
| 接口规范 | `openapi.yaml` | OpenAPI 3.0 规范 |
| 前端文档 | `code/web/docs/` | 前端技术选型与实现方案 |

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🤝 作者

**ZhuTian** - C++ 后端开发工程师

- Docker Hub: [zhuxiaotianyaqwq](https://hub.docker.com/u/zhuxiaotianyaqwq)
- 项目用途：校招技术展示项目

---

## 📬 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 邮箱：zhuxiaotianya.nya.qwq@gmail.com
- Gitee：[cpp-wechat-im-microservice](https://github.com/ZhuXiaoTianYa/cpp-wechat-im-microservice)

---

*Made with ❤️ for 校招面试*
