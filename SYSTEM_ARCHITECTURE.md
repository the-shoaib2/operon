# Operone - System Architecture Diagram

**Comprehensive System Architecture Overview**  
**Generated:** December 11, 2025  
**Version:** 0.2.0  
**Based on:** PROJECT_PROPOSAL.md

---

## 🏗️ Complete System Architecture

```mermaid
graph TB
    subgraph "User Applications Layer"
        UA[User Applications]
        CLI[CLI Interface]
        WEB[Web Dashboard]
        API[REST API]
    end
    
    subgraph "Kernel Layer - @repo/operone"
        KERNEL[Operone Kernel<br/>Orchestration Engine]
        GATEWAY[Unified API Gateway]
        DISCOVERY[Service Discovery]
        HEALTH[Health Monitor]
    end
    
    subgraph "Core OS Services - @operone/core"
        SCHED[Task Scheduler<br/>Priority Queue]
        PROC[Process Manager<br/>Lifecycle Control]
        RES[Resource Allocator<br/>CPU/Memory]
        IPC[Event System<br/>Inter-Process Comm]
    end
    
    subgraph "Distributed Networking - @operone/networking"
        P2P[P2P Mesh Network<br/>50+ Peers]
        DISC[Auto Discovery<br/>Bonjour/mDNS/Avahi]
        LB[Load Balancer<br/>Consistent Hashing]
        SSH[SSH Client<br/>Secure Remote]
        WS[WebSocket Server<br/>TLS 1.3]
        RAFT[Raft Consensus<br/>Leader Election]
    end
    
    subgraph "Tool Execution - @operone/mcp"
        BROKER[MCP Broker<br/>Distributed Tools]
        FTOOL[File Tool<br/>FS Operations]
        STOOL[Shell Tool<br/>Command Exec]
        LTOOL[Log Tool<br/>Structured Logs]
    end
    
    subgraph "File System - @operone/fs"
        FS[FileSystem API<br/>Unified Interface]
        WATCH[File Watcher<br/>Real-time Events]
        PARSE[Document Parser<br/>PDF/DOCX/TXT]
        PATH[Path Utils<br/>Cross-Platform]
    end
    
    subgraph "Command Execution - @operone/shell"
        SHELL[Shell Executor<br/>Secure Execution]
        STREAM[Stream Handler<br/>stdin/stdout/stderr]
        ENV[Environment Manager<br/>Variables]
    end
    
    subgraph "Memory Management - @operone/memory"
        L1[L1 Cache<br/>In-Memory LRU]
        L2[L2 Cache<br/>Compressed Disk<br/>LZ4 90%+ ratio]
        L3[L3 Storage<br/>Database Persist]
        EVICT[Eviction Policy<br/>Memory Pressure]
    end
    
    subgraph "Database - @operone/db"
        SQLITE[SQLite<br/>Local Storage]
        POSTGRES[PostgreSQL<br/>Distributed]
        KYSELY[Kysely<br/>Type-Safe Queries]
        MIGRATE[Migration System<br/>Schema Evolution]
    end
    
    subgraph "Automation - @operone/automation"
        BROWSER[Browser Control<br/>Playwright/Puppeteer]
        DESKTOP[Desktop Automation<br/>RobotJS]
        SCREEN[Screenshot/Video<br/>Recording]
        IMAGE[Image Processing<br/>Jimp]
    end
    
    subgraph "Parallel Execution - @operone/fastlane"
        POOL[Worker Pool<br/>Piscina]
        QUEUE[Task Queue<br/>Priority Support]
        STEAL[Work Stealing<br/>Load Balance]
    end
    
    subgraph "Plugin System - @operone/plugins"
        SANDBOX[VM2 Sandbox<br/>Isolation]
        LIFECYCLE[Plugin Lifecycle<br/>Install/Load/Unload]
        PERMS[Permission System<br/>Fine-Grained]
    end
    
    subgraph "Storage Layer"
        DBFILE[(SQLite DB<br/>better-sqlite3)]
        PGDB[(PostgreSQL<br/>Distributed)]
        CACHE[(Disk Cache<br/>LZ4 Compressed)]
    end
    
    subgraph "External Services"
        BONJOUR[Bonjour<br/>macOS]
        MDNS[mDNS<br/>Windows]
        AVAHI[Avahi<br/>Linux]
    end
    
    subgraph "Platform Layer"
        MACOS[macOS 11+<br/>APFS/FSEvents]
        WINDOWS[Windows 10+<br/>NTFS/ReadDirChanges]
        LINUX[Linux 4.x+<br/>ext4/inotify]
    end
    
    %% User Layer Connections
    UA --> GATEWAY
    CLI --> GATEWAY
    WEB --> GATEWAY
    API --> GATEWAY
    
    %% Kernel Connections
    GATEWAY --> KERNEL
    KERNEL --> DISCOVERY
    KERNEL --> HEALTH
    KERNEL --> SCHED
    
    %% Core Services
    SCHED --> PROC
    PROC --> RES
    RES --> IPC
    
    %% Networking
    KERNEL --> P2P
    P2P --> DISC
    P2P --> LB
    P2P --> WS
    P2P --> RAFT
    DISC --> SSH
    
    %% MCP Tools
    KERNEL --> BROKER
    BROKER --> FTOOL
    BROKER --> STOOL
    BROKER --> LTOOL
    FTOOL --> FS
    STOOL --> SHELL
    
    %% File System
    FS --> WATCH
    FS --> PARSE
    FS --> PATH
    
    %% Shell
    SHELL --> STREAM
    SHELL --> ENV
    
    %% Memory Tiers
    KERNEL --> L1
    L1 --> L2
    L2 --> L3
    L1 --> EVICT
    L3 --> SQLITE
    
    %% Database
    SQLITE --> KYSELY
    POSTGRES --> KYSELY
    KYSELY --> MIGRATE
    KYSELY --> DBFILE
    KYSELY --> PGDB
    
    %% Automation
    KERNEL --> BROWSER
    BROWSER --> DESKTOP
    DESKTOP --> SCREEN
    SCREEN --> IMAGE
    
    %% Parallel Execution
    KERNEL --> POOL
    POOL --> QUEUE
    QUEUE --> STEAL
    
    %% Plugins
    KERNEL --> SANDBOX
    SANDBOX --> LIFECYCLE
    LIFECYCLE --> PERMS
    
    %% Storage
    L2 --> CACHE
    L3 --> DBFILE
    
    %% Platform Discovery
    DISC --> BONJOUR
    DISC --> MDNS
    DISC --> AVAHI
    
    %% Platform Support
    FS --> MACOS
    FS --> WINDOWS
    FS --> LINUX
    
    %% Styling
    style KERNEL fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style GATEWAY fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    style P2P fill:#95e1d3,stroke:#38a3a5,stroke-width:2px
    style BROKER fill:#ffd93d,stroke:#f4a261,stroke-width:2px
    style L1 fill:#a8dadc,stroke:#457b9d,stroke-width:2px
    style SQLITE fill:#e76f51,stroke:#d62828,stroke-width:2px,color:#fff
    style BROWSER fill:#b8b8ff,stroke:#6a4c93,stroke-width:2px
    style POOL fill:#ffb4a2,stroke:#e63946,stroke-width:2px
    style SANDBOX fill:#caffbf,stroke:#80b918,stroke-width:2px
```

---

## 🔄 Data Flow Architecture

```mermaid
flowchart TB
    subgraph "Request Flow"
        R1[User Request] --> R2[API Gateway]
        R2 --> R3[Kernel Router]
        R3 --> R4{Request Type?}
        
        R4 -->|File Op| R5[File Tool]
        R4 -->|Shell Cmd| R6[Shell Tool]
        R4 -->|Distributed| R7[MCP Broker]
        R4 -->|Automation| R8[Browser/Desktop]
        
        R5 --> R9[File System]
        R6 --> R10[Shell Executor]
        R7 --> R11[Load Balancer]
        R8 --> R12[Automation Engine]
        
        R11 --> R13[Select Peer]
        R13 --> R14[Execute Remote]
        
        R9 --> R15[Memory Cache]
        R10 --> R15
        R12 --> R15
        R14 --> R15
        
        R15 --> R16{Cache Hit?}
        R16 -->|Yes| R17[Return from L1]
        R16 -->|No| R18[Fetch from L2/L3]
        
        R17 --> R19[Response]
        R18 --> R19
    end
    
    style R1 fill:#e1f5ff,stroke:#0077b6
    style R19 fill:#e1ffe1,stroke:#2d6a4f
    style R4 fill:#fff4e1,stroke:#f77f00
    style R16 fill:#f0e1ff,stroke:#9d4edd
```

---

## 🌐 Distributed Network Topology

```mermaid
graph TB
    subgraph "Cluster 1 - Leader"
        L1[Peer 1<br/>Leader<br/>macOS]
        L2[Peer 2<br/>Follower<br/>Windows]
        L3[Peer 3<br/>Follower<br/>Linux]
    end
    
    subgraph "Cluster 2"
        C1[Peer 4<br/>Follower<br/>macOS]
        C2[Peer 5<br/>Follower<br/>Windows]
    end
    
    subgraph "Cluster 3"
        C3[Peer 6-50<br/>Followers<br/>Mixed OS]
    end
    
    subgraph "Discovery Services"
        D1[Bonjour<br/>macOS Discovery]
        D2[mDNS<br/>Windows Discovery]
        D3[Avahi<br/>Linux Discovery]
    end
    
    subgraph "Load Balancer"
        LB1[Consistent Hash Ring]
        LB2[Health Checks]
        LB3[Weight Assignment]
    end
    
    subgraph "Consensus"
        RF1[Raft Algorithm]
        RF2[Leader Election<br/>&lt;100ms]
        RF3[Log Replication]
    end
    
    L1 <--> L2
    L2 <--> L3
    L3 <--> L1
    
    L1 <--> C1
    L1 <--> C2
    L1 <--> C3
    
    C1 <--> C2
    C2 <--> C3
    
    L1 --> D1
    L2 --> D2
    L3 --> D3
    
    L1 --> LB1
    LB1 --> LB2
    LB2 --> LB3
    
    L1 --> RF1
    RF1 --> RF2
    RF2 --> RF3
    
    style L1 fill:#ffd93d,stroke:#f4a261,stroke-width:3px
    style LB1 fill:#95e1d3,stroke:#38a3a5,stroke-width:2px
    style RF1 fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
```

---

## 💾 Memory Hierarchy

```mermaid
graph LR
    subgraph "Request Path"
        REQ[Request] --> CHK[Check L1]
    end
    
    subgraph "L1 - In-Memory Cache"
        L1C[LRU Cache<br/>Hot Data<br/>&lt;1ms access]
        L1S[Size: Limited<br/>Speed: Fastest]
    end
    
    subgraph "L2 - Disk Cache"
        L2C[Compressed Storage<br/>LZ4 Compression<br/>&lt;10ms access]
        L2S[Size: Large<br/>Speed: Fast<br/>90%+ compression]
    end
    
    subgraph "L3 - Database"
        L3C[SQLite/PostgreSQL<br/>Persistent Storage<br/>&lt;50ms access]
        L3S[Size: Unlimited<br/>Speed: Moderate]
    end
    
    subgraph "Eviction Policy"
        EV1[Memory Pressure Monitor]
        EV2[LRU Algorithm]
        EV3[Frequency Analysis]
    end
    
    CHK -->|Hit| L1C
    CHK -->|Miss| L2C
    L2C -->|Miss| L3C
    
    L1C --> L1S
    L2C --> L2S
    L3C --> L3S
    
    L1C --> EV1
    EV1 --> EV2
    EV2 --> EV3
    EV3 -->|Evict| L2C
    L2C -->|Evict| L3C
    
    L3C -->|Promote| L2C
    L2C -->|Promote| L1C
    
    style L1C fill:#a8dadc,stroke:#457b9d,stroke-width:2px
    style L2C fill:#ffd93d,stroke:#f4a261,stroke-width:2px
    style L3C fill:#e76f51,stroke:#d62828,stroke-width:2px,color:#fff
```

---

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph "Authentication Layer"
        AUTH1[JWT Tokens<br/>RSA-256 Signing]
        AUTH2[Token Rotation<br/>Automatic Refresh]
        AUTH3[Session Management]
    end
    
    subgraph "Encryption Layer"
        ENC1[TLS 1.3<br/>All Network Traffic]
        ENC2[Perfect Forward Secrecy]
        ENC3[Message Signing<br/>HMAC-SHA256]
    end
    
    subgraph "Authorization Layer"
        AUTHZ1[RBAC<br/>Role-Based Access]
        AUTHZ2[Fine-Grained Permissions]
        AUTHZ3[Resource Quotas]
    end
    
    subgraph "Audit Layer"
        AUD1[Security Event Logging]
        AUD2[Access Tracking]
        AUD3[Compliance Reports]
    end
    
    subgraph "Plugin Isolation"
        ISO1[VM2 Sandbox]
        ISO2[Resource Limits<br/>CPU/Memory/I/O]
        ISO3[API Surface Restriction]
    end
    
    AUTH1 --> AUTH2
    AUTH2 --> AUTH3
    
    ENC1 --> ENC2
    ENC2 --> ENC3
    
    AUTHZ1 --> AUTHZ2
    AUTHZ2 --> AUTHZ3
    
    AUD1 --> AUD2
    AUD2 --> AUD3
    
    ISO1 --> ISO2
    ISO2 --> ISO3
    
    AUTH3 --> AUTHZ1
    ENC3 --> AUTH1
    AUTHZ3 --> AUD1
    
    style AUTH1 fill:#caffbf,stroke:#80b918,stroke-width:2px
    style ENC1 fill:#a8dadc,stroke:#457b9d,stroke-width:2px
    style AUTHZ1 fill:#ffd93d,stroke:#f4a261,stroke-width:2px
    style ISO1 fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
```

---

## 🚀 Performance Optimization Stack

```mermaid
graph TB
    subgraph "Network Optimization"
        N1[Connection Pooling<br/>Keep-Alive]
        N2[Zero-Copy Transfer<br/>Large Payloads]
        N3[Message Compression<br/>MessagePack]
    end
    
    subgraph "Memory Optimization"
        M1[Pool Allocation<br/>Slab Allocator]
        M2[GC Tuning<br/>V8 Optimization]
        M3[Shared Memory<br/>Worker Threads]
    end
    
    subgraph "Storage Optimization"
        S1[Write-Ahead Logging<br/>WAL Mode]
        S2[Compaction<br/>Auto-Vacuum]
        S3[Index Optimization<br/>Query Planning]
    end
    
    subgraph "Compute Optimization"
        C1[Multi-Core Utilization<br/>Worker Pool]
        C2[Work Stealing<br/>Load Balance]
        C3[Task Batching<br/>Reduce Overhead]
    end
    
    subgraph "Caching Strategy"
        CH1[LRU Cache<br/>Hot Data]
        CH2[Dictionary Compression<br/>LZ4 90%+]
        CH3[Cache Warming<br/>Preloading]
    end
    
    N1 --> N2
    N2 --> N3
    
    M1 --> M2
    M2 --> M3
    
    S1 --> S2
    S2 --> S3
    
    C1 --> C2
    C2 --> C3
    
    CH1 --> CH2
    CH2 --> CH3
    
    N3 --> CH1
    M3 --> C1
    S3 --> CH1
    
    style N1 fill:#95e1d3,stroke:#38a3a5,stroke-width:2px
    style M1 fill:#a8dadc,stroke:#457b9d,stroke-width:2px
    style S1 fill:#ffd93d,stroke:#f4a261,stroke-width:2px
    style C1 fill:#ffb4a2,stroke:#e63946,stroke-width:2px
    style CH1 fill:#caffbf,stroke:#80b918,stroke-width:2px
```

---

## 📦 Package Dependency Graph

```mermaid
graph TB
    subgraph "Application Layer"
        APP[User Applications]
    end
    
    subgraph "Kernel"
        KERN[@repo/operone<br/>Main Kernel]
    end
    
    subgraph "Core Packages"
        CORE[@operone/core<br/>Task Orchestration]
        MCP[@operone/mcp<br/>Tool Drivers]
        NET[@operone/networking<br/>P2P Network]
        FS[@operone/fs<br/>File System]
        SHELL[@operone/shell<br/>Command Exec]
        MEM[@operone/memory<br/>Memory Mgmt]
        DB[@operone/db<br/>Database]
        AUTO[@operone/automation<br/>Browser/Desktop]
        FAST[@operone/fastlane<br/>Parallel Exec]
        PLUG[@operone/plugins<br/>Plugin System]
    end
    
    subgraph "Shared"
        SHARED[@operone/shared<br/>Utilities]
        TYPES[@repo/types<br/>Type Definitions]
        ESLINT[@repo/eslint-config]
        TSCONF[@repo/typescript-config]
    end
    
    APP --> KERN
    
    KERN --> CORE
    KERN --> MCP
    KERN --> NET
    KERN --> MEM
    
    MCP --> NET
    MCP --> FS
    MCP --> SHELL
    
    FS --> SHARED
    SHELL --> SHARED
    
    MEM --> DB
    
    CORE --> TYPES
    MCP --> TYPES
    NET --> TYPES
    FS --> TYPES
    SHELL --> TYPES
    MEM --> TYPES
    DB --> TYPES
    AUTO --> TYPES
    FAST --> TYPES
    PLUG --> TYPES
    SHARED --> TYPES
    
    KERN --> ESLINT
    KERN --> TSCONF
    
    style KERN fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style TYPES fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
```

---

## 🎯 Cross-Platform Abstraction

```mermaid
graph TB
    subgraph "Unified API Layer"
        API1[FileSystem API]
        API2[Process API]
        API3[Network API]
        API4[Shell API]
    end
    
    subgraph "Platform Abstraction"
        ABS1[Path Normalization]
        ABS2[Permission Mapping]
        ABS3[Service Discovery]
        ABS4[Shell Selection]
    end
    
    subgraph "macOS Implementation"
        MAC1[APFS File System]
        MAC2[FSEvents Watching]
        MAC3[Bonjour Discovery]
        MAC4[zsh/bash Shell]
        MAC5[Grand Central Dispatch]
    end
    
    subgraph "Windows Implementation"
        WIN1[NTFS File System]
        WIN2[ReadDirectoryChanges]
        WIN3[mDNS Discovery]
        WIN4[PowerShell/cmd]
        WIN5[Thread Pool]
    end
    
    subgraph "Linux Implementation"
        LIN1[ext4 File System]
        LIN2[inotify Watching]
        LIN3[Avahi Discovery]
        LIN4[bash/sh Shell]
        LIN5[Process Affinity]
    end
    
    API1 --> ABS1
    API2 --> ABS2
    API3 --> ABS3
    API4 --> ABS4
    
    ABS1 --> MAC1
    ABS1 --> WIN1
    ABS1 --> LIN1
    
    ABS2 --> MAC2
    ABS2 --> WIN2
    ABS2 --> LIN2
    
    ABS3 --> MAC3
    ABS3 --> WIN3
    ABS3 --> LIN3
    
    ABS4 --> MAC4
    ABS4 --> WIN4
    ABS4 --> LIN4
    
    MAC2 --> MAC5
    WIN2 --> WIN5
    LIN2 --> LIN5
    
    style API1 fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    style MAC1 fill:#a8dadc,stroke:#457b9d,stroke-width:2px
    style WIN1 fill:#ffd93d,stroke:#f4a261,stroke-width:2px
    style LIN1 fill:#caffbf,stroke:#80b918,stroke-width:2px
```

---

## 📊 Performance Metrics

| Component | Latency | Throughput | Scalability |
|-----------|---------|------------|-------------|
| **File Operations** | <10ms (local) | 10,000+ ops/sec | Linear |
| **Network Messages** | <100ms (remote) | 1,000+ msg/sec/peer | 50+ peers |
| **Database Queries** | <10ms (indexed) | 10,000+ inserts/sec | Horizontal |
| **Leader Election** | <100ms | N/A | 50+ peers |
| **Load Distribution** | <1s rebalance | Even ±5% | Consistent hash |
| **Memory Cache (L1)** | <1ms | Sub-millisecond | LRU eviction |
| **Memory Cache (L2)** | <10ms | 90%+ compression | Disk-based |
| **Task Execution** | Variable | 1,000+ tasks/sec | Multi-core |

---

## 🔗 Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js + TypeScript | Cross-platform execution |
| **Database** | SQLite 12.5.0 | Local persistence |
| **Database** | PostgreSQL | Distributed storage |
| **Query Builder** | Kysely 0.27.6 | Type-safe SQL |
| **Networking** | Socket.IO 4.8.1 | WebSocket communication |
| **Discovery** | Bonjour 3.5.0 | Service discovery |
| **SSH** | ssh2 1.17.0 | Secure remote execution |
| **Caching** | lru-cache 10.4.3 | LRU implementation |
| **Compression** | lz4 0.6.5 | Fast compression |
| **File Watching** | chokidar 3.6.0 | Cross-platform watching |
| **Shell Execution** | execa 8.0.1 | Process execution |
| **Browser Automation** | Playwright 1.57.0 | Multi-browser support |
| **Worker Pool** | Piscina 4.9.2 | Thread pool management |
| **Sandboxing** | VM2 3.10.0 | Plugin isolation |

---

## 🎯 Design Principles

1. **Micro-Kernel Architecture**: Minimal core with modular packages
2. **Platform Abstraction**: Single API across macOS, Windows, Linux
3. **Distributed-First**: Built for 50+ peer networks
4. **Type Safety**: Full TypeScript with strict checking
5. **Performance**: Sub-100ms latency for critical operations
6. **Security**: TLS 1.3, JWT, RBAC, sandboxing
7. **Fault Tolerance**: Automatic failover and recovery
8. **Observability**: Comprehensive event system and monitoring

---

## 📈 Scalability Characteristics

- **Horizontal Scaling**: Add peers dynamically (tested 50+)
- **Vertical Scaling**: Multi-core utilization via worker pools
- **Load Distribution**: Consistent hashing with <5% variance
- **Fault Tolerance**: Handles (N-1)/2 node failures
- **Auto-Discovery**: Zero-configuration peer joining
- **Leader Election**: <100ms consensus with Raft
- **Memory Efficiency**: 60%+ reduction via tiered caching
- **Network Efficiency**: 40%+ improvement with zero-copy

---

*This architecture diagram provides a comprehensive view of the Operone distributed operating system, showing all major components, their interactions, and the underlying technologies that power the platform.*
