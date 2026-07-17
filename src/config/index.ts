import { proxy } from './proxy'
import dev from './dev'
import prod from './prod'

export const isDev = import.meta.env.DEV
const env = isDev ? dev : prod

export const config = {
  app: {
    name: '微茫科技',
    desc: '高性能快速开发平台',
  },
  ignore: {
    token: ['/login'],
  },
  host: env.host,
  baseUrl: env.baseUrl,
}

export { proxy }
export default config
