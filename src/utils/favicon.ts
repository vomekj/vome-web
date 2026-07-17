/**
 * 横图 logo → 方 favicon（与 admin setSquareFavicon 同源逻辑）
 * 先裁透明边，再宽度铺满方画布
 */
export function setSquareFavicon(src: string, size = 64) {
  if (typeof document === 'undefined') return
  const img = new Image()
  img.onload = () => {
    const probe = document.createElement('canvas')
    probe.width = img.width
    probe.height = img.height
    const pctx = probe.getContext('2d')
    if (!pctx) return
    pctx.drawImage(img, 0, 0)
    const { data, width, height } = pctx.getImageData(0, 0, img.width, img.height)

    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3]! > 8) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
    if (maxX < minX || maxY < minY) return

    const cw = maxX - minX + 1
    const ch = maxY - minY + 1
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = size / cw
    const drawH = ch * scale
    if (drawH <= size) {
      const drawY = (size - drawH) / 2
      ctx.drawImage(img, minX, minY, cw, ch, 0, drawY, size, drawH)
    } else {
      const srcH = size / scale
      const srcY = minY + (ch - srcH) / 2
      ctx.drawImage(img, minX, srcY, cw, srcH, 0, 0, size, size)
    }

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/png'
    link.href = canvas.toDataURL('image/png')
  }
  img.src = src
}

export function syncDocumentTitle(base: string, routeTitle?: string) {
  if (typeof document === 'undefined') return
  document.title = routeTitle ? `${routeTitle} - ${base}` : base
}
