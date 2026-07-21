# Vome Web

[English](./README.en.md) | 简体中文

面向 C 端的 **Vue 3 + Vite** SPA 脚手架。与 [vome-service](https://gitee.com/vomekj/vome-service) 共用同一后端，走 **App 侧** API（`/app/...`）与 EPS（`service.user.*` 等）；**不含** Admin 的 `vm-crud` 体系。

> 微茫科技开源项目。需先启动 Vome Service。

## 特性

| 能力 | 说明 |
| --- | --- |
| **App EPS** | `createEps({ side: 'app' })` 生成类型化 `service` 客户端 |
| **登录体系** | 密码 / 注册 / 短信邮箱验证码；Better Auth 社交 SSO → JWT |
| **同源代理** | 开发态 `/dev` 转发到 Service，避免跨域 |
| **Socket.IO** | 登录后可选连接，实时消息通道 |
| **底部 Tab 壳** | 首页 / 发现 / 消息 / 我的；登录页独立 |
| **主题** | 亮暗切换 + CSS 变量；Remix Icon |
| **组件基座** | shadcn-vue + 自有 `vm-*`（header / tabbar 等） |
| **自动导入** | unplugin-auto-import，业务页少写 import |

## 技术栈

- [Vue 3](https://vuejs.org) + [Vite](https://vitejs.dev) + [TypeScript](https://www.typescriptlang.org)
- [Pinia](https://pinia.vuejs.org) / [Vue Router](https://router.vuejs.org)
- [Better Auth](https://www.better-auth.com)（会话 / 社交）
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn-vue](https://www.shadcn-vue.com)
- [socket.io-client](https://socket.io)
- [vome-core](https://www.npmjs.com/package/vome-core)（EPS / 请求客户端）
- 推荐包管理器：[Bun](https://bun.sh)

## 环境要求

| 依赖 | 说明 |
| --- | --- |
| **Node / Bun** | 建议 Bun；Node 见 `package.json` → `engines` |
| **Vome Service** | 必须先启动（默认 `http://127.0.0.1:3000`） |

## 快速开始

```bash
git clone https://gitee.com/vomekj/vome-web.git
cd vome-web
bun install
```

### 1. 确认后端代理

`src/config/proxy.ts` 默认：

```ts
'/dev/': {
  target: 'http://127.0.0.1:3000',
  // …
}
```

Service 端口不是 `3000` 时改 `target`。

### 2. 启动

先启动 [vome-service](https://gitee.com/vomekj/vome-service)，再：

```bash
bun run dev
```

| 项 | 说明 |
| --- | --- |
| 地址 | [http://localhost:9900](http://localhost:9900) |
| API 前缀 | `/dev` → Service |
| 登录页 | `/login` |

### 3. 与后端的对应关系

| Web | Service |
| --- | --- |
| 密码登录 / 注册 | `POST /app/user/login/password`、`/register` |
| 验证码 | `/app/user/login/otpCode`、`/otp` |
| 社交列表 / SSO | `/app/user/login/socialProviders` + Better Auth |
| 用户资料 | `service.user.*`（EPS） |
| Socket | Service Socket.IO（可选 Redis Adapter） |

社交登录需在 Service `src/config` 中配置对应 OAuth 密钥。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `bun run dev` | 开发（端口 **9900**） |
| `bun run build` | 类型检查 + 生产构建 |
| `bun run preview` | 预览 `dist` |
| `bun run type-check` | 仅 `vue-tsc` |
| `bun run format` | 格式化 `src/` |

## 端口对照

| 端 | 端口 |
| --- | --- |
| Service | 3000 |
| Admin | 9000 |
| **Web** | **9900** |
| UniApp H5 | 6600 |

## 目录结构

```text
vome-web/
├── src/
│   ├── pages/                 # 页面（glob 生成路由）
│   │   ├── home/              # → /home
│   │   ├── discover/
│   │   ├── message/
│   │   ├── mine/
│   │   └── login/             # → /login（免登录）
│   ├── components/
│   │   ├── ui/                # shadcn-vue
│   │   ├── vm-app-header.vue
│   │   ├── vm-app-tabbar.vue
│   │   └── vm-ri-icon.vue
│   ├── api/client.ts          # request、Token、bootEps、service
│   ├── lib/
│   │   ├── auth-client.ts     # Better Auth + syncBetterAuthJwt
│   │   └── socket.ts
│   ├── stores/                # app / user / theme
│   ├── router/
│   ├── config/                # index / dev / prod / proxy
│   ├── styles/theme.css
│   └── utils/
├── typings/
├── vite.config.ts
└── package.json
```

## 启动流程（简述）

1. `bootEps()` → App 侧 EPS  
2. 挂载 Vue + Pinia + Router  
3. 有 token 时 `connectWs()`  
4. 主题与用户信息按需拉取  

`/` 重定向到 `/home`。底部 Tab：`home` / `discover` / `message` / `mine`。

## 新增页面

1. 在 `src/pages/<name>/index.vue` 建页（路由自动扫描）  
2. 需要登录的页走路由守卫；免登录路径写在 `config.ignore.token`  
3. 调后端优先用 EPS：`const { service } = useVome()` 或 `api/client` 导出的 `service`  

## 配置说明

配置在 `src/config/`：

| 文件 | 用途 |
| --- | --- |
| `index.ts` | 应用名、免登录路径、合并 host / baseUrl |
| `proxy.ts` | Vite 代理到 Service |
| `dev.ts` / `prod.ts` | 环境 host、baseUrl |

## 相关项目

| 项目 | 说明 |
| --- | --- |
| [vome-service](https://gitee.com/vomekj/vome-service) | Bun + Elysia 后端（必配） |
| [vome-admin](https://gitee.com/vomekj/vome-admin) | 管理后台（Admin 侧） |
| UniApp / Docs | 移动端与文档站（同组织按需克隆） |
| [vome-core](https://www.npmjs.com/package/vome-core) | EPS 与共享客户端 |

## 贡献

1. Fork 本仓库  
2. 新建分支 `feat/xxx`  
3. 提交并推送  
4. 发起 Pull Request / Merge Request  

Issue / PR 欢迎中英文。

## 许可证

[MIT](./LICENSE) © VomeShop / 微茫科技

---

若本仓库对你有帮助，欢迎 Star ⭐
