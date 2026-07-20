<template>
  <div class="vm-home">
    <section class="vm-home__top">
      <div class="vm-home__hero">
        <div class="vm-home__hero-text">
          <p class="vm-home__eyebrow">Overview</p>
          <h2 class="vm-home__hello">你好，{{ helloName }}</h2>
          <p class="vm-home__desc">
            欢迎使用 {{ config.app.name }}。账号与权限由服务端下发，支持密码登录与社交单点登录。
          </p>
        </div>
        <div class="vm-home__hero-art" aria-hidden="true" />
      </div>

      <aside class="vm-home__session">
        <div class="vm-home__session-head">
          <div class="vm-home__card-icon is-violet">
            <i class="ri-user-smile-line" />
          </div>
          <div>
            <p class="vm-home__session-label">会话摘要</p>
            <h3 class="vm-home__session-name">{{ helloName }}</h3>
          </div>
        </div>
        <ul class="vm-home__stats">
          <li>
            <span>手机号</span>
            <strong>{{ userStore.info?.phone || '—' }}</strong>
          </li>
          <li>
            <span>邮箱</span>
            <strong>{{ userStore.info?.email || '—' }}</strong>
          </li>
          <li>
            <span>状态</span>
            <strong>{{ userStore.info ? '已登录' : '游客' }}</strong>
          </li>
        </ul>
      </aside>
    </section>

    <section class="vm-home__grid">
      <article class="vm-home__card">
        <div class="vm-home__card-icon is-blue">
          <i class="ri-apps-line" />
        </div>
        <h3>{{ config.app.name }}</h3>
        <p>Web 端工作台，接口经 EPS 生成类型化 service。</p>
      </article>
      <article class="vm-home__card">
        <div class="vm-home__card-icon is-cyan">
          <i class="ri-shield-keyhole-line" />
        </div>
        <h3>双端鉴权</h3>
        <p>密码登录与 Better Auth 社交 SSO 共用 Web JWT。</p>
      </article>
      <article class="vm-home__card">
        <div class="vm-home__card-icon is-peach">
          <i class="ri-smartphone-line" />
        </div>
        <h3>多端一致</h3>
        <p>与 uniapp 共享 App 用户体系与品牌视觉。</p>
      </article>
    </section>

    <section class="vm-home__bottom">
      <article class="vm-home__panel">
        <header class="vm-home__panel-head">
          <div class="vm-home__card-icon is-blue">
            <i class="ri-flashlight-line" />
          </div>
          <div>
            <h3>快捷入口</h3>
            <p>常用操作</p>
          </div>
        </header>
        <div class="vm-home__shortcuts">
          <RouterLink to="/mine" class="vm-home__shortcut">
            <i class="ri-user-3-line" />
            <span>我的</span>
          </RouterLink>
          <RouterLink to="/login" class="vm-home__shortcut">
            <i class="ri-login-box-line" />
            <span>登录</span>
          </RouterLink>
          <button type="button" class="vm-home__shortcut" :disabled="loggingOut" @click="onLogout">
            <i class="ri-logout-box-r-line" />
            <span>{{ loggingOut ? '退出中…' : '退出登录' }}</span>
          </button>
        </div>
      </article>

      <article class="vm-home__panel">
        <header class="vm-home__panel-head">
          <div class="vm-home__card-icon is-mint">
            <i class="ri-stack-line" />
          </div>
          <div>
            <h3>框架能力</h3>
            <p>与本端运行时对齐</p>
          </div>
        </header>
        <ul class="vm-home__caps">
          <li v-for="cap in capabilities" :key="cap.title">
            <i :class="cap.icon" />
            <div>
              <strong>{{ cap.title }}</strong>
              <span>{{ cap.desc }}</span>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { config } from '@/config'

const router = useRouter()
const loggingOut = ref(false)

const helloName = computed(() => userStore.displayName)

const capabilities = [
  {
    title: 'Better Auth SSO',
    desc: 'GitHub / Google / 微信等按服务端配置动态展示',
    icon: 'ri-lock-password-line',
  },
  {
    title: 'EPS 实体描述',
    desc: '前端按侧生成 service，与接口契约同源',
    icon: 'ri-database-2-line',
  },
  {
    title: 'App JWT',
    desc: 'Bearer 访问令牌，与 uniapp 共用用户表',
    icon: 'ri-key-2-line',
  },
] as const

async function onLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await userStore.logout()
    await router.replace('/login')
  } finally {
    loggingOut.value = false
  }
}

onMounted(() => {
  appStore.setActive('home')
  void userStore.get()
})
</script>

<style lang="scss" scoped>
.vm-home {
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  box-sizing: border-box;
  background: var(--vm-page-bg, #f4f6fc);
  overflow: auto;

  @media (min-width: 768px) {
    padding: 20px 24px;
  }
}

.vm-home__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 1fr) 300px;
    align-items: stretch;
  }
}

.vm-home__hero {
  position: relative;
  display: flex;
  min-height: 124px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 20px 26px;
  border-radius: 26px;
  background: linear-gradient(135deg, #4e5dff 0%, #6b7bff 55%, #8b9bff 100%);
  color: #fff;
  box-shadow: 0 14px 36px rgba(78, 93, 255, 0.26);
}

.vm-home__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.vm-home__hello {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 24px;
  }
}

.vm-home__desc {
  max-width: 560px;
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  opacity: 0.88;
}

.vm-home__hero-art {
  position: absolute;
  right: -56px;
  top: -72px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 68%);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    right: 72px;
    bottom: -28px;
    width: 160px;
    height: 160px;
    border-radius: 40% 60% 55% 45%;
    background: rgba(255, 255, 255, 0.14);
  }

  &::before {
    content: '';
    position: absolute;
    right: 28px;
    top: 96px;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
}

.vm-home__session {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 26px;
  background: var(--vm-card, #fff);
  box-shadow: var(--shadow-soft);
}

.vm-home__session-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vm-home__session-label {
  margin: 0 0 2px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.vm-home__session-name {
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  color: var(--foreground);
}

.vm-home__stats {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 7px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 12px;
    border-radius: 14px;
    background: var(--vm-inset, #f4f6fc);

    span {
      font-size: 13px;
      color: var(--muted-foreground);
      font-weight: 500;
    }

    strong {
      font-size: 14px;
      font-weight: 700;
      color: var(--foreground);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 60%;
    }
  }
}

.vm-home__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 14px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.vm-home__card {
  padding: 16px 18px;
  border-radius: 22px;
  background: var(--vm-card, #fff);
  box-shadow: var(--shadow-soft);

  h3 {
    margin: 10px 0 5px;
    font-size: 15px;
    font-weight: 650;
    color: var(--foreground);
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--muted-foreground);
    font-weight: 500;
  }
}

.vm-home__card-icon {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 18px;

  &.is-blue {
    background: var(--brand, #4e5dff);
  }
  &.is-cyan {
    background: #22b8cf;
  }
  &.is-peach {
    background: #ff8a5b;
  }
  &.is-violet {
    background: #845ef7;
  }
  &.is-mint {
    background: #20c997;
  }
}

.vm-home__bottom {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  }
}

.vm-home__panel {
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  border-radius: 22px;
  background: var(--vm-card, #fff);
  box-shadow: var(--shadow-soft);
}

.vm-home__panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  h3 {
    margin: 0 0 2px;
    font-size: 15px;
    font-weight: 650;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: var(--muted-foreground);
  }
}

.vm-home__shortcuts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.vm-home__shortcut {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border: 0;
  border-radius: 14px;
  background: var(--vm-inset, #f4f6fc);
  color: var(--foreground);
  font-size: 13px;
  font-weight: 550;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  i {
    font-size: 16px;
    color: var(--brand, #4e5dff);
  }

  &:hover:not(:disabled) {
    background: var(--brand-soft, #eef0ff);
    color: var(--brand, #4e5dff);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

.vm-home__caps {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 10px;

  li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 14px;
    background: var(--vm-inset, #f4f6fc);

    > i {
      margin-top: 2px;
      font-size: 18px;
      color: var(--brand, #4e5dff);
    }

    strong {
      display: block;
      font-size: 13px;
      font-weight: 650;
      color: var(--foreground);
    }

    span {
      font-size: 12px;
      color: var(--muted-foreground);
      line-height: 1.45;
    }
  }
}
</style>
