/** 登录 / 刷新接口下发的 token 包 */
export type UserTokenPayload = {
  token: string
  expire: number
  refreshToken: string
  refreshExpire: number
}

export type AppUser = {
  id?: string
  name?: string | null
  phone?: string | null
  email?: string | null
  image?: string | null
  [key: string]: unknown
}
