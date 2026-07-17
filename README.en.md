# Vome Web

[简体中文](./README.md) | English

A consumer-facing **Vue 3 + Vite** SPA scaffold. It shares the same backend as [vome-service](https://gitee.com/vomekj/vome-service), calling **App-side** APIs (`/app/...`) via EPS (`service.user.*`, etc.). It does **not** include Admin’s `vm-crud` stack.

> Open-sourced by Vome / 微茫科技. Start Vome Service first.

## Features

| Capability | Description |
| --- | --- |
| **App EPS** | `createEps({ side: 'app' })` for typed `service` clients |
| **Auth** | Password / register / OTP; Better Auth social SSO → JWT |
| **Same-origin proxy** | Dev `/dev` → Service (no CORS pain) |
| **Socket.IO** | Optional realtime channel after login |
| **Tab shell** | Home / Discover / Messages / Me; standalone login page |
| **Theming** | Light / dark + CSS variables; Remix Icon |
| **UI base** | shadcn-vue + local `vm-*` (header / tabbar, …) |
| **Auto-import** | unplugin-auto-import for lean page code |

## Stack

- [Vue 3](https://vuejs.org) + [Vite](https://vitejs.dev) + [TypeScript](https://www.typescriptlang.org)
- [Pinia](https://pinia.vuejs.org) / [Vue Router](https://router.vuejs.org)
- [Better Auth](https://www.better-auth.com) (session / social)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn-vue](https://www.shadcn-vue.com)
- [socket.io-client](https://socket.io)
- [vome-core](https://www.npmjs.com/package/vome-core) (EPS / HTTP client)
- Package manager: [Bun](https://bun.sh) recommended

## Requirements

| Dependency | Notes |
| --- | --- |
| **Node / Bun** | Bun preferred; see `package.json` → `engines` for Node |
| **Vome Service** | Must be running (default `http://127.0.0.1:3000`) |

## Quick start

```bash
git clone https://gitee.com/vomekj/vome-web.git
cd vome-web
bun install
```

### 1. Proxy to Service

`src/config/proxy.ts` defaults to:

```ts
'/dev/': {
  target: 'http://127.0.0.1:3000',
  // …
}
```

Change `target` if Service is not on port `3000`.

### 2. Run

Start [vome-service](https://gitee.com/vomekj/vome-service) first, then:

```bash
bun run dev
```

| Item | Notes |
| --- | --- |
| URL | [http://localhost:9900](http://localhost:9900) |
| API prefix | `/dev` → Service |
| Login | `/login` |

### 3. Mapping to the backend

| Web | Service |
| --- | --- |
| Password login / register | `POST /app/user/login/password`, `/register` |
| OTP | `/app/user/login/otpCode`, `/otp` |
| Social list / SSO | `/app/user/login/socialProviders` + Better Auth |
| Profile | `service.user.*` (EPS) |
| Socket | Service Socket.IO (optional Redis adapter) |

Configure OAuth secrets in Service `src/config` for social login.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Dev server on port **9900** |
| `bun run build` | Type-check + production build |
| `bun run preview` | Preview `dist` |
| `bun run type-check` | `vue-tsc` only |
| `bun run format` | Format `src/` |

## Port map

| App | Port |
| --- | --- |
| Service | 3000 |
| Admin | 9000 |
| **Web** | **9900** |
| UniApp H5 | 6600 |

## Project layout

```text
vome-web/
├── src/
│   ├── pages/                 # Pages (glob → routes)
│   │   ├── home/              # → /home
│   │   ├── discover/
│   │   ├── message/
│   │   ├── mine/
│   │   └── login/             # → /login (public)
│   ├── components/
│   │   ├── ui/                # shadcn-vue
│   │   ├── vm-app-header.vue
│   │   ├── vm-app-tabbar.vue
│   │   └── vm-ri-icon.vue
│   ├── api/client.ts          # request, tokens, bootEps, service
│   ├── lib/
│   │   ├── auth-client.ts     # Better Auth + syncBetterAuthJwt
│   │   └── socket.ts
│   ├── stores/                # app / user / theme
│   ├── router/
│   ├── config/                # index / dev / prod / proxy (no .env)
│   ├── styles/theme.css
│   └── utils/
├── typings/
├── vite.config.ts
└── package.json
```

## Boot flow (sketch)

1. `bootEps()` → App-side EPS  
2. Mount Vue + Pinia + Router  
3. `connectWs()` when a token exists  
4. Theme + user info as needed  

`/` redirects to `/home`. Tabs: `home` / `discover` / `message` / `mine`.

## Adding a page

1. Create `src/pages/<name>/index.vue` (auto-scanned routes)  
2. Public paths go in `config.ignore.token`  
3. Prefer EPS for APIs: exported `service` from `api/client`  

## Configuration

All config lives under `src/config/` (**no `.env`**):

| File | Purpose |
| --- | --- |
| `index.ts` | App name, public routes, host / baseUrl |
| `proxy.ts` | Vite proxy to Service |
| `dev.ts` / `prod.ts` | Env host & baseUrl |

## Related projects

| Project | Role |
| --- | --- |
| [vome-service](https://gitee.com/vomekj/vome-service) | Bun + Elysia backend (required) |
| [vome-admin](https://gitee.com/vomekj/vome-admin) | Admin console |
| UniApp / Docs | Mobile & docs site |
| [vome-core](https://www.npmjs.com/package/vome-core) | EPS & shared client |

## Contributing

1. Fork this repo  
2. Create `feat/xxx`  
3. Commit and push  
4. Open a Pull / Merge Request  

Issues and PRs in Chinese or English are welcome.

## License

[MIT](./LICENSE) © VomeShop / 微茫科技

---

If this project helps you, a Star ⭐ is appreciated.
