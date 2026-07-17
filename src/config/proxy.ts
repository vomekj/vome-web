export const proxy = {
  '/dev/': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    xfwd: true,
    rewrite: (path: string) => path.replace(/^\/dev/, ''),
  },
  '/prod/': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    xfwd: true,
    rewrite: (path: string) => path.replace(/^\/prod/, ''),
  },
} as const
