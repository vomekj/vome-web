<script setup lang="ts">
import { config } from '@/config'
import { request, setTokens, getAccessToken } from '@/api/client'
import {
  authClient,
  syncBetterAuthJwt,
  type SocialProviderPublic,
} from '@/lib/auth-client'
import logoDark from '@/static/image/logo-dark.png'
import { startBubble, stopBubble } from '@/utils/login-bubble'

/** 登录下方常显 SSO 数量；超出部分进「更多」 */
const SSO_PRIMARY_COUNT = 2

type AuthMode = 'login' | 'register'
type AuthMethod = 'password' | 'code'

const router = useRouter()
const route = useRoute()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const authMode = ref<AuthMode>('login')
const authMethod = ref<AuthMethod>('password')
const account = ref('')
const password = ref('')
const password2 = ref('')
const showPassword = ref(false)
const showPassword2 = ref(false)
const otpCode = ref('')
const captchaId = ref('')
const captchaSrc = ref('')
const captchaInput = ref('')
const captchaLoading = ref(false)
const codeSending = ref(false)
const codeCountdown = ref(0)
const error = ref('')
const loading = ref(false)
const ssoLoading = ref('')
const providers = ref<SocialProviderPublic[]>([])
const ssoMoreOpen = ref(false)
const successOpen = ref(false)
const successMsg = ref('登录成功')

let countdownTimer = 0

/** 按接口返回顺序：前 2 个平铺，其余折叠 */
const primaryProviders = computed(() =>
  providers.value.slice(0, SSO_PRIMARY_COUNT),
)
const moreProviders = computed(() =>
  providers.value.slice(SSO_PRIMARY_COUNT),
)

const busy = computed(() => loading.value || !!ssoLoading.value)

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function isPhone(v: string) {
  return /^1\d{10}$/.test(v.trim())
}

function switchMode(mode: AuthMode) {
  if (busy.value) return
  authMode.value = mode
  error.value = ''
  otpCode.value = ''
  if (mode === 'register') {
    authMethod.value = 'password'
    if (!captchaId.value) void refreshCaptcha()
  }
}

function switchMethod(method: AuthMethod) {
  if (busy.value || authMode.value === 'register') return
  authMethod.value = method
  error.value = ''
  if (method === 'code' && !captchaId.value) void refreshCaptcha()
}

async function loadProviders() {
  try {
    providers.value = await request<SocialProviderPublic[]>(
      '/app/user/login/socialProviders',
      {
        toast: false,
      },
    )
  } catch {
    providers.value = []
  }
}

async function refreshCaptcha() {
  captchaLoading.value = true
  captchaSrc.value = ''
  captchaInput.value = ''
  try {
    const data = await request<{ captchaId: string; data: string }>(
      '/app/user/login/captcha?width=150&height=45&color=%232c3142',
      { toast: false },
    )
    captchaId.value = data.captchaId
    captchaSrc.value = data.data
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码获取失败'
  } finally {
    captchaLoading.value = false
  }
}

function startCountdown() {
  codeCountdown.value = 60
  if (countdownTimer) window.clearInterval(countdownTimer)
  countdownTimer = window.setInterval(() => {
    codeCountdown.value -= 1
    if (codeCountdown.value <= 0) {
      window.clearInterval(countdownTimer)
      countdownTimer = 0
    }
  }, 1000)
}

async function sendOtp() {
  if (codeSending.value || codeCountdown.value > 0 || busy.value) return
  error.value = ''
  const acc = account.value.trim()
  if (!acc) {
    error.value = '请输入手机号或邮箱'
    return
  }
  if (!isPhone(acc) && !isEmail(acc)) {
    error.value = '请输入正确的手机号或邮箱'
    return
  }
  if (!captchaInput.value) {
    error.value = '请输入图片验证码'
    return
  }
  if (!captchaId.value) {
    error.value = '请先刷新图片验证码'
    return
  }
  codeSending.value = true
  try {
    await request('/app/user/login/otpCode', {
      method: 'POST',
      body: JSON.stringify({
        account: acc,
        captchaId: captchaId.value,
        code: captchaInput.value,
      }),
    })
    startCountdown()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码发送失败'
    await refreshCaptcha()
  } finally {
    codeSending.value = false
  }
}

async function finishLogin(access: string, refresh: string, msg = '登录成功') {
  setTokens(access, refresh)
  void import('@/utils/socket').then(({ reconnectWs }) => reconnectWs())
  await userStore.get()
  successMsg.value = msg
  successOpen.value = true
  await new Promise((r) => setTimeout(r, 900))
  const redirect =
    typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/pages/home/index'
  await openPage(redirect || '/pages/home/index', { replace: true })
}

async function trySsoSession() {
  if (getAccessToken()) return
  const token = await syncBetterAuthJwt()
  if (token) await finishLogin(token, '')
}

async function submit() {
  if (busy.value) return
  error.value = ''
  const acc = account.value.trim()
  if (!acc) {
    error.value = '请输入手机号或邮箱'
    return
  }
  if (!isPhone(acc) && !isEmail(acc)) {
    error.value = '请输入正确的手机号或邮箱'
    return
  }

  loading.value = true
  try {
    if (authMode.value === 'register') {
      if (!otpCode.value.trim()) {
        error.value = '请输入验证码'
        return
      }
      if (!password.value) {
        error.value = '请输入密码'
        return
      }
      if (password.value.length < 6) {
        error.value = '密码至少 6 位'
        return
      }
      if (password.value !== password2.value) {
        error.value = '两次密码不一致'
        return
      }
      const data = await request<{
        token: string
        refreshToken: string
      }>('/app/user/login/register', {
        method: 'POST',
        body: JSON.stringify({
          account: acc,
          password: password.value,
          code: otpCode.value.trim(),
        }),
      })
      await finishLogin(data.token, data.refreshToken, '注册成功')
      return
    }

    if (authMethod.value === 'password') {
      if (!password.value) {
        error.value = '请输入密码'
        return
      }
      const data = await request<{
        token: string
        refreshToken: string
      }>('/app/user/login/password', {
        method: 'POST',
        body: JSON.stringify({ account: acc, password: password.value }),
      })
      await finishLogin(data.token, data.refreshToken)
      return
    }

    if (!otpCode.value) {
      error.value = '请输入验证码'
      return
    }
    const data = await request<{
      token: string
      refreshToken: string
    }>('/app/user/login/otp', {
      method: 'POST',
      body: JSON.stringify({ account: acc, code: otpCode.value }),
    })
    await finishLogin(data.token, data.refreshToken)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
    if (authMethod.value === 'code' || authMode.value === 'register') {
      await refreshCaptcha()
    }
  } finally {
    loading.value = false
  }
}

async function socialLogin(provider: string) {
  if (busy.value) return
  ssoMoreOpen.value = false
  ssoLoading.value = provider
  error.value = ''
  try {
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/pages/home/index'
    const callbackURL = `${window.location.origin}/pages/login/index?sso=1&redirect=${encodeURIComponent(redirect || '/pages/home/index')}`
    await authClient.signIn.social({
      provider: provider as never,
      callbackURL,
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '单点登录失败'
    ssoLoading.value = ''
  }
}

onMounted(() => {
  nextTick(() => startBubble(canvasRef.value))
  void loadProviders()
  if (route.query.sso === '1' || !getAccessToken()) {
    void trySsoSession()
  }
})

onUnmounted(() => {
  stopBubble()
  if (countdownTimer) window.clearInterval(countdownTimer)
})
</script>

<template>
  <div class="vm-login">
    <canvas ref="canvasRef" class="vm-login__bubble" aria-hidden="true" />

    <div class="vm-login__panel">
      <form class="vm-login__box" @submit.prevent="submit">
        <div class="vm-login__brand">
          <div class="vm-login__logo">
            <img :src="logoDark" alt="" />
          </div>
          <span class="vm-login__name">{{ config.app.name }}</span>
        </div>
        <p class="vm-login__desc">{{ config.app.desc }}</p>

        <div class="vm-login__tabs">
          <button
            type="button"
            class="vm-login__tab"
            :class="{ 'is-active': authMode === 'login' }"
            :disabled="busy"
            @click="switchMode('login')"
          >
            登录
          </button>
          <button
            type="button"
            class="vm-login__tab"
            :class="{ 'is-active': authMode === 'register' }"
            :disabled="busy"
            @click="switchMode('register')"
          >
            注册
          </button>
        </div>

        <div class="vm-login__field">
          <label for="account">账号</label>
          <input
            id="account"
            v-model="account"
            type="text"
            maxlength="64"
            autocomplete="username"
            placeholder="手机号或邮箱"
            :disabled="busy"
          />
        </div>

        <!-- 注册：图片验证码 + 短信/邮箱验证码 + 密码 -->
        <template v-if="authMode === 'register'">
          <div class="vm-login__field">
            <label for="captchaInput">图片验证码</label>
            <div class="vm-login__captcha-row">
              <input
                id="captchaInput"
                v-model="captchaInput"
                type="text"
                maxlength="4"
                inputmode="numeric"
                autocomplete="off"
                placeholder="计算结果"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__captcha"
                title="点击刷新"
                :disabled="captchaLoading || busy"
                @click="refreshCaptcha"
              >
                <img v-if="captchaSrc" :src="captchaSrc" alt="验证码" />
                <span v-else class="vm-login__captcha-loading">…</span>
              </button>
            </div>
          </div>

          <div class="vm-login__field">
            <label for="otpCode">验证码</label>
            <div class="vm-login__code-row">
              <input
                id="otpCode"
                v-model="otpCode"
                type="text"
                maxlength="6"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="短信/邮箱验证码"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__code-btn"
                :disabled="
                  codeSending || codeCountdown > 0 || busy || captchaLoading
                "
                @click="sendOtp"
              >
                {{
                  codeSending
                    ? '发送中…'
                    : codeCountdown > 0
                      ? `${codeCountdown}s`
                      : '获取验证码'
                }}
              </button>
            </div>
          </div>

          <div class="vm-login__field">
            <label for="password">密码</label>
            <div class="vm-login__password-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                maxlength="32"
                autocomplete="new-password"
                placeholder="至少 6 位密码"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__password-toggle"
                tabindex="-1"
                :title="showPassword ? '隐藏密码' : '显示密码'"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                :disabled="busy"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'" />
              </button>
            </div>
          </div>
          <div class="vm-login__field">
            <label for="password2">确认密码</label>
            <div class="vm-login__password-wrap">
              <input
                id="password2"
                v-model="password2"
                :type="showPassword2 ? 'text' : 'password'"
                maxlength="32"
                autocomplete="new-password"
                placeholder="再次输入密码"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__password-toggle"
                tabindex="-1"
                :title="showPassword2 ? '隐藏密码' : '显示密码'"
                :aria-label="showPassword2 ? '隐藏密码' : '显示密码'"
                :disabled="busy"
                @click="showPassword2 = !showPassword2"
              >
                <i :class="showPassword2 ? 'ri-eye-line' : 'ri-eye-off-line'" />
              </button>
            </div>
          </div>
        </template>

        <!-- 登录 · 密码 -->
        <template v-else-if="authMethod === 'password'">
          <div class="vm-login__field">
            <label for="password">密码</label>
            <div class="vm-login__password-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                maxlength="32"
                autocomplete="current-password"
                placeholder="请输入密码"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__password-toggle"
                tabindex="-1"
                :title="showPassword ? '隐藏密码' : '显示密码'"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                :disabled="busy"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'" />
              </button>
            </div>
          </div>
        </template>

        <!-- 登录 · 验证码 -->
        <template v-else>
          <div class="vm-login__field">
            <label for="captchaInput">图片验证码</label>
            <div class="vm-login__captcha-row">
              <input
                id="captchaInput"
                v-model="captchaInput"
                type="text"
                maxlength="4"
                inputmode="numeric"
                autocomplete="off"
                placeholder="计算结果"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__captcha"
                title="点击刷新"
                :disabled="captchaLoading || busy"
                @click="refreshCaptcha"
              >
                <img v-if="captchaSrc" :src="captchaSrc" alt="验证码" />
                <span v-else class="vm-login__captcha-loading">…</span>
              </button>
            </div>
          </div>

          <div class="vm-login__field">
            <label for="otpCode">验证码</label>
            <div class="vm-login__code-row">
              <input
                id="otpCode"
                v-model="otpCode"
                type="text"
                maxlength="6"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="短信/邮箱验证码"
                :disabled="busy"
              />
              <button
                type="button"
                class="vm-login__code-btn"
                :disabled="
                  codeSending || codeCountdown > 0 || busy || captchaLoading
                "
                @click="sendOtp"
              >
                {{
                  codeSending
                    ? '发送中…'
                    : codeCountdown > 0
                      ? `${codeCountdown}s`
                      : '获取验证码'
                }}
              </button>
            </div>
          </div>
        </template>

        <p v-if="error" class="vm-login__error">{{ error }}</p>

        <div v-if="authMode === 'login'" class="vm-login__method-switch">
          <button
            type="button"
            class="vm-login__method-link"
            :disabled="busy"
            @click="
              switchMethod(authMethod === 'password' ? 'code' : 'password')
            "
          >
            {{
              authMethod === 'password' ? '使用验证码登录' : '使用密码登录'
            }}
          </button>
        </div>

        <button type="submit" class="vm-login__submit" :disabled="busy">
          {{
            loading
              ? authMode === 'register'
                ? '注册中…'
                : '登录中…'
              : authMode === 'register'
                ? '注册'
                : '登录'
          }}
        </button>

        <div v-if="providers.length && authMode === 'login'" class="vm-login__sso">
          <div class="vm-login__sso-row">
            <button
              v-for="p in primaryProviders"
              :key="p.key"
              type="button"
              class="vm-login__sso-chip"
              :class="`is-${p.key}`"
              :disabled="busy"
              @click="socialLogin(p.key)"
            >
              <i
                :class="p.icon || 'ri-login-circle-line'"
                :style="{ color: p.color || '#4e5dff' }"
              />
              <span>{{
                ssoLoading === p.key ? '…' : p.label || p.key
              }}</span>
            </button>
            <button
              v-if="moreProviders.length"
              type="button"
              class="vm-login__sso-chip is-more"
              :disabled="busy"
              @click="ssoMoreOpen = true"
            >
              <i class="ri-more-fill" />
              <span>更多</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <Teleport to="body">
      <div
        v-if="ssoMoreOpen"
        class="vm-login__sso-mask"
        @click.self="ssoMoreOpen = false"
      >
        <div class="vm-login__sso-sheet" role="dialog" aria-modal="true">
          <div class="vm-login__sso-sheet-head">
            <span>更多登录方式</span>
            <button
              type="button"
              class="vm-login__sso-sheet-close"
              aria-label="关闭"
              @click="ssoMoreOpen = false"
            >
              <i class="ri-close-line" />
            </button>
          </div>
          <div class="vm-login__sso-sheet-list">
            <button
              v-for="p in moreProviders"
              :key="p.key"
              type="button"
              class="vm-login__sso-chip"
              :class="`is-${p.key}`"
              :disabled="busy"
              @click="socialLogin(p.key)"
            >
              <i
                :class="p.icon || 'ri-login-circle-line'"
                :style="{ color: p.color || '#4e5dff' }"
              />
              <span>{{
                ssoLoading === p.key ? '跳转中…' : p.label || p.key
              }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="successOpen" class="vm-toaster-mask" aria-live="polite">
        <div class="vm-toaster is-success">
          <i class="vm-toaster__icon ri-checkbox-circle-fill" aria-hidden="true" />
          <span class="vm-toaster__text">{{ successMsg }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.vm-login {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #fff;
  color: #2c3142;
}

.vm-login__bubble {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  cursor: pointer;
}

.vm-login__panel {
  position: relative;
  z-index: 2;
  display: flex;
  width: 50%;
  margin-left: auto;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;

  @media (max-width: 1024px) {
    width: 100%;
  }
}

.vm-login__box {
  display: flex;
  width: 100%;
  max-width: 320px;
  flex-direction: column;
  align-items: center;
}

.vm-login__brand {
  --login-brand: #3b4456;
  display: flex;
  align-items: center;
  user-select: none;
  margin-bottom: 16px;
}

.vm-login__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  padding: 5px;
  border-radius: 9px;
  background: var(--login-brand);

  img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }
}

.vm-login__name {
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  color: var(--login-brand);

  @media (max-width: 480px) {
    font-size: 30px;
  }
}

.vm-login__desc {
  margin: 0 0 28px;
  font-size: 15px;
  letter-spacing: 0.06em;
  color: #8a90a0;
  text-align: center;
  user-select: none;
  max-width: 90%;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
}

.vm-login__tabs {
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  border-radius: 8px;
  background: #f4f5f8;
  padding: 3px;
  box-sizing: border-box;
}

.vm-login__tab {
  flex: 1;
  height: 34px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #8a90a0;
  font-size: 14px;
  cursor: pointer;

  &.is-active {
    background: #fff;
    color: #2c3142;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(40, 50, 80, 0.08);
  }

  &:disabled {
    cursor: wait;
  }
}

.vm-login__method-switch {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin: 4px 0 10px;
}

.vm-login__method-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--brand, #4e5dff);
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 0.02em;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
}

.vm-login__field {
  width: 100%;
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 8px;
    padding-left: 4px;
    font-size: 13px;
    color: #8a90a0;
    user-select: none;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 45px;
    padding: 0 14px;
    border: 0;
    border-radius: 8px;
    background: #f8f8f8;
    color: #333;
    font-size: 15px;
    outline: none;

    &::placeholder {
      color: #b0b4bf;
    }

    &:disabled {
      opacity: 0.7;
    }

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset;
      box-shadow: 0 0 0 1000px #f8f8f8 inset;
    }
  }
}

.vm-login__password-wrap {
  position: relative;

  input {
    padding-right: 44px;
  }
}

.vm-login__password-toggle {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 45px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #8a90a0;
  cursor: pointer;

  i {
    font-size: 18px;
    line-height: 1;
  }

  &:hover:not(:disabled) {
    color: var(--brand, #4e5dff);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.vm-login__captcha-row,
.vm-login__code-row {
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    flex: 1;
    min-width: 0;
  }
}

.vm-login__captcha {
  display: flex;
  flex-shrink: 0;
  width: 120px;
  height: 45px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: #f8f8f8;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:disabled {
    cursor: wait;
  }
}

.vm-login__captcha-loading {
  color: #8a90a0;
  font-size: 18px;
}

.vm-login__code-btn {
  flex-shrink: 0;
  height: 45px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: #eef0ff;
  color: var(--brand, #4e5dff);
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
}

.vm-login__error {
  width: 100%;
  margin: 0 0 12px;
  font-size: 13px;
  color: #e11d48;
}

.vm-login__submit {
  width: 100%;
  height: 45px;
  margin-top: 0;
  border: 0;
  border-radius: 8px;
  background: var(--brand, #4e5dff);
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
}

.vm-login__sso {
  width: 100%;
  margin-top: 20px;
}

.vm-login__sso-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 8px;
}

.vm-login__sso-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 92px;
  height: 36px;
  padding: 0 8px;
  border: 0;
  border-radius: 999px;
  background: #f4f5f8;
  color: #2c3142;
  font-size: 12px;
  font-weight: 550;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 0.15s ease,
    transform 0.1s ease;

  i {
    font-size: 15px;
    line-height: 1;
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover:not(:disabled) {
    background: #ebeef5;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  &.is-github i {
    color: #24292f;
  }

  &.is-wechat i {
    color: #07c160;
  }

  &.is-google i {
    color: #ea4335;
  }

  &.is-gitee i {
    color: #c71d23;
  }

  &.is-steam i {
    color: #171a21;
  }

  &.is-more {
    background: #fff;
    color: #8a90a0;
    box-shadow: inset 0 0 0 1px #e6e8ef;

    i {
      color: #8a90a0;
    }

    &:hover:not(:disabled) {
      background: #f4f5f8;
      color: #4e5dff;

      i {
        color: #4e5dff;
      }
    }
  }
}
</style>

<style lang="scss">
.vm-login__sso-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: rgba(20, 24, 40, 0.36);
  box-sizing: border-box;
}

.vm-login__sso-sheet {
  width: 100%;
  max-width: 360px;
  padding: 18px 18px 20px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 48px rgba(40, 50, 120, 0.18);
  box-sizing: border-box;
}

.vm-login__sso-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 650;
  color: #2c3142;
}

.vm-login__sso-sheet-close {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: #f4f5f8;
  color: #8a90a0;
  cursor: pointer;

  i {
    font-size: 18px;
  }

  &:hover {
    color: #2c3142;
  }
}

.vm-login__sso-sheet-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.vm-toaster-mask {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: min(120px, 18vh);
  pointer-events: none;
}

.vm-toaster {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: min(400px, calc(100vw - 32px));
  min-height: 40px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);

  &.is-success {
    background: #e8f7ef;
    border-color: color-mix(in srgb, #3d9a6a 22%, transparent);
    color: #3d9a6a;
  }
}

.vm-toaster__icon {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
}

.vm-toaster__text {
  min-width: 0;
  word-break: break-word;
}
</style>
