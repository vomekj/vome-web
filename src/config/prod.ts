import { proxy } from './proxy'

export default {
  host: proxy['/prod/'].target,
  baseUrl: '/prod',
}
