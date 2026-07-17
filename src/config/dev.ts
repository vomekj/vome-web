import { proxy } from './proxy'

export default {
  host: proxy['/dev/'].target,
  baseUrl: '/dev',
}
