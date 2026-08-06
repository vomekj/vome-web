export const proxy = {
  '/dev/': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    xfwd: true,
    rewrite: (path: string) => path.replace(/^\/dev/, ''),
  },
  '/api/': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    xfwd: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
} as const
