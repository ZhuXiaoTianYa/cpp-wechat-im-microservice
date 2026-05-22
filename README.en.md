# WeChat-Style IM Microservice System

> A high-performance instant messaging system based on microservice architecture, built with C++ brpc for backend and React + TypeScript for frontend, supporting multi-platform access.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![C++](https://img.shields.io/badge/C++-17-orange.svg)](https://en.cppreference.com/)
[![brpc](https://img.shields.io/badge/brpc-Baidu-blue.svg)](https://github.com/apache/brpc)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Project Overview

This is an **enterprise-grade instant messaging system** designed with microservice architecture. It supports multiple message types including text, image, file, and speech, providing comprehensive friend management, session management, and real-time message push capabilities.

### 🏗️ Architecture Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web UI    │  │   Qt Client │  │   App (TBD) │            │
│  │  React + TS │  │   Qt 6.x    │  │   Flutter   │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼─────────────────────┐
│                        Gateway Layer                            │
│              ┌───────────────────────────────┐                  │
│              │        Gateway Server         │                  │
│              │  HTTP(9000) + WebSocket(9001) │                  │
│              │  Protobuf Serialization       │                  │
│              │  Service Discovery / LB       │                  │
│              └───────────────┬───────────────┘                  │
└───────────────────────────────┼──────────────────────────────────┘
                               │
┌───────────────────────────────▼──────────────────────────────────┐
│                        Microservices Layer                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │   User    │  │  Friend   │  │  Message  │  │ Transmite │   │
│  │  Service  │  │  Service  │  │  Service  │  │  Service  │   │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘   │
│  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼──────────────────┐      │
│  │   File    │  │  Speech   │  │       etcd            │      │
│  │  Service  │  │  Service  │  │   (Service Discovery) │      │
│  └───────────┘  └───────────┘  └────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                               │
┌───────────────────────────────▼──────────────────────────────────┐
│                        Data Layer                               │
│        ┌───────────┐  ┌───────────┐  ┌───────────────┐         │
│        │   Redis   │  │  MySQL    │  │ Elasticsearch │         │
│        │Session/Cache│ │User/Relation││ Message Index │         │
│        └───────────┘  └───────────┘  └───────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend Tech Stack (Core)

| Technology | Version | Purpose |
|------------|---------|---------|
| **C++** | 17 | Core development language |
| **brpc** | 1.6.x | High-performance RPC framework |
| **etcd** | 3.5.x | Service discovery & configuration |
| **Redis** | 7.x | Distributed session & cache |
| **MySQL** | 8.0 | User data & relationship storage |
| **Elasticsearch** | 8.x | Full-text message search |
| **Protobuf** | 3.x | Efficient serialization protocol |
| **glog** | - | Logging system |
| **gflags** | - | Command-line argument management |

### Frontend Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **TypeScript** | 5.x | Type system |
| **Zustand** | 4.x | State management |
| **Axios** | 1.x | HTTP client |
| **Tailwind CSS** | 4.x | Styling framework |
| **protobufjs** | 7.x | Protobuf encoding/decoding |
| **Vite** | 6.x | Build tool |

### Client Platforms

| Platform | Technology | Status |
|----------|------------|--------|
| **Desktop** | Qt 6.11 | Implemented |
| **Mobile** | Flutter | TBD |

---

## 📁 Project Structure

```
cpp-wechat-im-microservice/
├── code/                          # Code directory
│   ├── server/                    # Backend microservices (Core)
│   │   ├── proto/                 # Protobuf interface definitions
│   │   │   ├── base.proto         # Basic message structures
│   │   │   ├── user.proto         # User service interface
│   │   │   ├── friend.proto       # Friend service interface
│   │   │   ├── message.proto      # Message storage interface
│   │   │   ├── transmite.proto    # Message transmit interface
│   │   │   ├── file.proto         # File service interface
│   │   │   ├── speech.proto       # Speech service interface
│   │   │   ├── notify.proto       # Notification interface
│   │   │   └── gateway.proto      # Gateway routing
│   │   ├── gateway/               # Gateway service
│   │   ├── user/                  # User service
│   │   ├── friend/                # Friend service
│   │   ├── message/               # Message storage service
│   │   ├── transmite/             # Message transmit service
│   │   ├── file/                  # File service
│   │   ├── speech/                # Speech service
│   │   ├── third/                 # Third-party dependencies
│   │   ├── conf/                  # Configuration files
│   │   └── build/                 # Build output
│   ├── web/                       # Frontend Web
│   │   ├── src/                   # Source code
│   │   ├── docs/                  # Technical documentation
│   │   ├── figma/                 # Design prototypes
│   │   └── proto/                 # Generated protobuf files
│   └── client/                    # Qt Client
│       └── ChatClient/            # Desktop client code
├── doxygen/                       # Backend API documentation
├── openapi.yaml                   # OpenAPI specification
├── docker-compose.yml             # Docker deployment config
├── README.md                      # Chinese documentation
└── README.en.md                   # English documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **OS**: Linux (Ubuntu 22.04 recommended)
- **Compiler**: GCC 11+
- **CMake**: 3.20+
- **Docker**: 20.10+ (optional)

### Method 1: Local Build & Run

#### 1. Install Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y \
    gcc g++ cmake make \
    libprotobuf-dev protobuf-compiler \
    libgflags-dev libgoogle-glog-dev \
    libmysqlclient-dev libhiredis-dev \
    libssl-dev zlib1g-dev

# Install brpc (from source)
git clone https://github.com/apache/brpc.git
cd brpc && sh config_brpc.sh --headers=/usr/include --libs=/usr/lib
make && sudo make install
```

#### 2. Build Backend Services

```bash
cd /path/to/cpp-wechat-im-microservice/code/server
mkdir -p build && cd build
cmake ..
make -j$(nproc)
make install
```

#### 3. Configure Services

Edit configuration files in `code/server/conf/` directory:

```bash
vim code/server/conf/gateway_server.conf
```

#### 4. Start Services

```bash
cd code/server/build/bin

# Start user service
./user_server --flagfile=../conf/user_server.conf &

# Start friend service
./friend_server --flagfile=../conf/friend_server.conf &

# Start message storage service
./message_server --flagfile=../conf/message_server.conf &

# Start message transmit service
./transmite_server --flagfile=../conf/transmite_server.conf &

# Start file service
./file_server --flagfile=../conf/file_server.conf &

# Start speech service
./speech_server --flagfile=../conf/speech_server.conf &

# Start gateway service (last)
./gateway_server --flagfile=../conf/gateway_server.conf &
```

### Method 2: Docker Deployment

#### 1. Pull Images

```bash
docker pull zhuxiaotianyaqwq/im-gateway:latest
docker pull zhuxiaotianyaqwq/im-user:latest
docker pull zhuxiaotianyaqwq/im-friend:latest
docker pull zhuxiaotianyaqwq/im-message:latest
docker pull zhuxiaotianyaqwq/im-transmite:latest
docker pull zhuxiaotianyaqwq/im-file:latest
docker pull zhuxiaotianyaqwq/im-speech:latest
```

#### 2. Run with Docker Compose

```bash
cd /path/to/cpp-wechat-im-microservice
docker-compose up -d
```

### Start Frontend

```bash
cd code/web
npm install
npm run dev
```

---

## 🔌 API Interface

### Service Ports

| Service | Port | Protocol |
|---------|------|----------|
| Gateway HTTP | 9000 | HTTP |
| Gateway WebSocket | 9001 | WebSocket |

### Protocol Specification

All interfaces use **HTTP + Protobuf**:

- **Content-Type**: `application/x-protobuf`
- **Method**: POST
- **Status Code**: Always 200, check `success` field for result

### Main API Endpoints

| Service | Interface | Path |
|---------|-----------|------|
| User | Register | `/service/user/username_register` |
| User | Login | `/service/user/username_login` |
| User | Get SMS Code | `/service/user/get_phone_verify_code` |
| Friend | Get Friend List | `/service/friend/get_friend_list` |
| Friend | Add Friend | `/service/friend/add_friend_apply` |
| Friend | Create Session | `/service/friend/create_chat_session` |
| Message | Get History | `/service/message_storage/get_history` |
| Message | Search | `/service/message_storage/search_history` |
| Transmit | Send Message | `/service/message_transmit/new_message` |
| File | Upload File | `/service/file/put_single_file` |
| Speech | Recognition | `/service/speech/recognition` |

---

## 📊 Core Features

### User Management
- ✅ Username/password registration/login
- ✅ Phone verification registration/login
- ✅ User profile management
- ✅ Single sign-on restriction

### Friend Management
- ✅ Friend request and approval
- ✅ Friend list query
- ✅ Friend search
- ✅ Friend deletion

### Session Management
- ✅ Single chat session creation
- ✅ Group chat session creation
- ✅ Session list query
- ✅ Session member management

### Messaging Features
- ✅ Text messages
- ✅ Image messages
- ✅ File messages
- ✅ Speech messages
- ✅ Message history query
- ✅ Full-text search
- ✅ Real-time push (WebSocket)

---

## 🔧 Development Tools

### Backend Development

| Tool | Purpose |
|------|---------|
| **CLion** | C++ IDE |
| **Doxygen** | API documentation |
| **gdb/lldb** | Debugging |

### Frontend Development (AI-Assisted)

Frontend code was developed with the assistance of **Cursor** and **Trae AI**:

- ✅ AI-generated Protobuf TypeScript definitions
- ✅ AI-optimized Zustand state management
- ✅ AI-implemented WebSocket wrapper with reconnection
- ✅ Figma UI prototyping with WeUI reference

---

## 📝 Documentation

| Document | Path | Description |
|----------|------|-------------|
| API Docs | `doxygen/docs/` | Backend Doxygen documentation |
| API Spec | `openapi.yaml` | OpenAPI 3.0 specification |
| Frontend Docs | `code/web/docs/` | Frontend tech documentation |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Author

**ZhuTian** - C++ Backend Developer

- Docker Hub: [zhuxiaotianyaqwq](https://hub.docker.com/u/zhuxiaotianyaqwq)
- Purpose: Technical showcase for campus recruitment

---

## 📬 Contact

For questions or suggestions:
- Email: zhuxiaotianya.nya.qwq@gmail.com
- Gitee: [cpp-wechat-im-microservice](https://github.com/ZhuXiaoTianYa/cpp-wechat-im-microservice)

---

*Made with ❤️ for campus recruitment*
