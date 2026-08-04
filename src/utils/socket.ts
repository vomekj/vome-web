import { io, type Socket } from 'socket.io-client'
import { config } from '@/config'
import { getAccessToken } from '@/api/client'

/** Web Socket.IO 客户端（auth.token + data 事件） */
export const socket: Socket = io(config.host, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  auth: {
    token: getAccessToken() || '',
  },
})

socket.on('data', (msg) => {
  console.info('[Socket]', msg)
})

socket.on('connect_error', (err) => {
  console.warn('[Socket] connect_error', err.message)
})

/** 登录后 / 刷新 token 后重连 */
export async function reconnectWs() {
  try {
    const token = getAccessToken()
    if (!token) {
      if (socket.connected) socket.disconnect()
      return
    }
    if (socket.connected) socket.disconnect()
    socket.auth = { token }
    socket.connect()
  } catch (error) {
    console.error('[Socket] 重连失败', error)
  }
}

export function disconnectWs() {
  if (socket.connected) socket.disconnect()
}

/** 有 token 时建立连接（应用启动调用） */
export function connectWs() {
  if (!getAccessToken()) return
  void reconnectWs()
}
