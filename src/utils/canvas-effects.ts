/**
 * 画布通用绘制（模版）。图层 + 可选 ripples（页面变量经 props.ripples 喂入）。
 */
export type CanvasPaintLayer = {
  /** 中心 X，相对宽 0–1 */
  cx: number
  /** 中心 Y，相对高 0–1 */
  cy: number
  /** 半轴相对宽 */
  rx: number
  /** 半轴相对高 */
  ry: number
  /** 主色 */
  color?: string
  /** 外发光 0–1 */
  glow?: number
  /** 有机形变强度，默认 1；0=静止椭圆 */
  warp?: number
  /** 动画速度倍率 */
  speed?: number
}

export type CanvasPaintRipple = {
  x: number
  y: number
  born?: number
  power?: number
}

export type CanvasPaintOptions = {
  layers?: CanvasPaintLayer[]
  /** 扰动点列表（像素坐标，相对 canvas）；由页面变量 / setValue 维护 */
  ripples?: CanvasPaintRipple[]
}

type Rgb = { r: number; g: number; b: number }
type Ripple = { x: number; y: number; born: number; power: number }

type PaintInst = {
  canvas: HTMLCanvasElement
  layers: CanvasPaintLayer[]
  raf: number
  ro: ResizeObserver | null
  cssW: number
  cssH: number
  ripples: Ripple[]
  onVisibility: (() => void) | null
}

const RIPPLE_LIFE = 1.6
const DEFAULT_RGB: Rgb = { r: 78, g: 93, b: 255 }
const instances = new Map<HTMLCanvasElement, PaintInst>()

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function clamp01(n: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(1, n))
}

export function parseCssColor(input: string | undefined | null): Rgb {
  const s = String(input || '').trim()
  if (!s) return { ...DEFAULT_RGB }
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    let h = hex[1]!
    if (h.length === 3) {
      h = h
        .split('')
        .map((c) => c + c)
        .join('')
    }
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }
  const rgb = s.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/i,
  )
  if (rgb) {
    return {
      r: clampByte(Number(rgb[1])),
      g: clampByte(Number(rgb[2])),
      b: clampByte(Number(rgb[3])),
    }
  }
  return { ...DEFAULT_RGB }
}

function rgba(c: Rgb, a: number) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const u = Math.max(0, Math.min(1, t))
  return {
    r: clampByte(a.r + (b.r - a.r) * u),
    g: clampByte(a.g + (b.g - a.g) * u),
    b: clampByte(a.b + (b.b - a.b) * u),
  }
}

/** 从单层样式字段推导图层（子节点 style / 已求值） */
export function layerFromStyle(
  style?: Record<string, unknown> | null,
): CanvasPaintLayer | null {
  const s = style || {}
  const color = String(
    s.gradientColor1 || s.backgroundColor || s.color || '',
  ).trim()
  const left = String(s.left ?? '').trim()
  const top = String(s.top ?? '').trim()
  const width = String(s.width ?? '').trim()
  const height = String(s.height ?? '').trim()
  const blurAmt = Number(s.blurAmount)
  const dur = String(s.animationDuration || '').trim()
  const shadow = String(s.boxShadow || '').trim()
  const radius = String(s.borderRadius ?? '').trim()

  const pct = (raw: string) => {
    const m = raw.match(/^(-?[\d.]+)\s*%$/)
    return m ? Number(m[1]) / 100 : NaN
  }
  const leftN = pct(left)
  const topN = pct(top)
  const wN = pct(width)
  const hN = pct(height)

  let cx = 0.5
  let cy = 0.5
  let rx = 0.2
  let ry = 0.2
  if (Number.isFinite(wN) && wN > 0) {
    rx = Math.max(0.04, Math.min(0.9, wN / 2))
    if (Number.isFinite(leftN)) cx = Math.max(0, Math.min(1, leftN + wN / 2))
  }
  if (Number.isFinite(hN) && hN > 0) {
    ry = Math.max(0.04, Math.min(0.9, hN / 2))
    if (Number.isFinite(topN)) cy = Math.max(0, Math.min(1, topN + hN / 2))
  }

  let glow = 0.45
  if (Number.isFinite(blurAmt) && blurAmt >= 0) {
    glow = Math.max(0.15, Math.min(1, blurAmt / 18))
  } else if (shadow) {
    const blurM = shadow.match(/(\d+(?:\.\d+)?)\s*px/g)
    if (blurM?.length) {
      const last = Number(String(blurM[blurM.length - 1]).replace(/px/i, ''))
      if (Number.isFinite(last)) glow = Math.max(0.2, Math.min(1, last / 90))
    }
  }

  let speed = 1
  const sec = dur.match(/^([\d.]+)\s*s$/i)
  const ms = dur.match(/^([\d.]+)\s*ms$/i)
  if (sec) {
    const n = Number(sec[1])
    if (n > 0) speed = Math.max(0.35, Math.min(2.5, 2.8 / n))
  } else if (ms) {
    const n = Number(ms[1]) / 1000
    if (n > 0) speed = Math.max(0.35, Math.min(2.5, 2.8 / n))
  }

  const soft =
    radius === '50%' ||
    radius === '999px' ||
    radius === '9999px' ||
    /^50%/.test(radius)
  const warp = soft ? 1 : 0.15
  const animName = String(s.animationName || '').trim()
  const motion =
    animName && animName !== 'none' ? speed : soft ? speed * 0.85 : 0.2

  return {
    cx: clamp01(cx, 0.5),
    cy: clamp01(cy, 0.5),
    rx,
    ry,
    color: color || undefined,
    glow,
    warp,
    speed: motion,
  }
}

function syncSize(inst: PaintInst) {
  const canvas = inst.canvas
  const rect = canvas.getBoundingClientRect()
  inst.cssW = rect.width
  inst.cssH = rect.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const nextW = Math.max(1, Math.floor(inst.cssW * dpr))
  const nextH = Math.max(1, Math.floor(inst.cssH * dpr))
  if (canvas.width !== nextW) canvas.width = nextW
  if (canvas.height !== nextH) canvas.height = nextH
}

function ripplePush(inst: PaintInst, px: number, py: number, nowMs: number) {
  let push = 0
  for (let i = inst.ripples.length - 1; i >= 0; i--) {
    const r = inst.ripples[i]!
    const age = (nowMs - r.born) / 1000
    if (age > RIPPLE_LIFE) {
      inst.ripples.splice(i, 1)
      continue
    }
    const life = 1 - age / RIPPLE_LIFE
    const dist = Math.hypot(px - r.x, py - r.y)
    const envelope = Math.exp(-dist * 0.0038) * life * life
    const wave = Math.sin(dist * 0.028 - age * 9.5)
    push += wave * envelope * r.power * 0.22
  }
  return push
}

function paintLayer(
  ctx: CanvasRenderingContext2D,
  inst: PaintInst,
  layer: CanvasPaintLayer,
  t: number,
  nowMs: number,
) {
  const w = inst.cssW
  const h = inst.cssH
  const speed = Number(layer.speed) > 0 ? Number(layer.speed) : 1
  const warp = Number.isFinite(Number(layer.warp)) ? Number(layer.warp) : 1
  const glow = Number.isFinite(Number(layer.glow))
    ? Math.max(0, Math.min(1, Number(layer.glow)))
    : 0.45
  const brand = parseCssColor(layer.color)
  const mid = mixRgb(brand, { r: 255, g: 255, b: 255 }, 0.42)
  const soft = mixRgb(brand, { r: 255, g: 255, b: 255 }, 0.22)

  const cx =
    w * clamp01(Number(layer.cx), 0.5) +
    Math.sin(t * 0.32 * speed) * w * 0.012 * warp
  const cy =
    h * clamp01(Number(layer.cy), 0.5) +
    Math.cos(t * 0.27 * speed) * h * 0.014 * warp
  const baseRx = w * Math.max(0.02, Number(layer.rx) || 0.2)
  const baseRy = h * Math.max(0.02, Number(layer.ry) || 0.2)

  const segments = 72
  const points: Array<{ x: number; y: number }> = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const wave =
      warp *
      (0.14 * Math.sin(a * 2 + t * 0.85 * speed) +
        0.09 * Math.sin(a * 3 - t * 1.05 * speed) +
        0.055 * Math.sin(a * 5 + t * 0.55 * speed))
    let rx = baseRx * (1 + wave)
    let ry = baseRy * (1 + wave * 0.9)
    const nx = Math.cos(a)
    const ny = Math.sin(a)
    const roughX = cx + nx * rx
    const roughY = cy + ny * ry
    const push = ripplePush(inst, roughX, roughY, nowMs)
    rx *= 1 + push
    ry *= 1 + push
    points.push({ x: cx + nx * rx, y: cy + ny * ry })
  }

  ctx.beginPath()
  const last = points[points.length - 1]!
  const first = points[0]!
  ctx.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2)
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!
    const n = points[(i + 1) % points.length]!
    ctx.quadraticCurveTo(p.x, p.y, (p.x + n.x) / 2, (p.y + n.y) / 2)
  }
  ctx.closePath()

  const gx = cx - baseRx * 0.18
  const gy = cy - baseRy * 0.22
  const grad = ctx.createRadialGradient(
    gx,
    gy,
    0,
    cx,
    cy,
    Math.max(baseRx, baseRy) * 1.05,
  )
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.78)')
  grad.addColorStop(0.28, rgba(mid, 0.48))
  grad.addColorStop(0.58, rgba(soft, 0.28))
  grad.addColorStop(0.82, rgba(brand, 0.12))
  grad.addColorStop(1, rgba(brand, 0))

  ctx.save()
  ctx.shadowColor = rgba(brand, 0.2 + glow * 0.35)
  ctx.shadowBlur = Math.min(w, h) * (0.035 + glow * 0.08)
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  inst: PaintInst,
  now: number,
) {
  const w = inst.cssW
  const h = inst.cssH
  ctx.clearRect(0, 0, w, h)
  if (w < 2 || h < 2) return
  const t = now / 1000
  for (const layer of inst.layers) {
    paintLayer(ctx, inst, layer, t, now)
  }
  for (const r of inst.ripples) {
    const age = (now - r.born) / 1000
    if (age > RIPPLE_LIFE) continue
    const life = 1 - age / RIPPLE_LIFE
    const radius = 18 + age * 120
    ctx.beginPath()
    ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * life * life})`
    ctx.lineWidth = 2.5 * life
    ctx.stroke()
  }
}

function disposeInst(inst: PaintInst) {
  if (inst.raf) cancelAnimationFrame(inst.raf)
  inst.raf = 0
  inst.ro?.disconnect()
  inst.ro = null
  if (inst.onVisibility) {
    document.removeEventListener('visibilitychange', inst.onVisibility)
    inst.onVisibility = null
  }
  inst.ripples.length = 0
  instances.delete(inst.canvas)
}

function normalizeOpts(opts?: CanvasPaintOptions): {
  layers: CanvasPaintLayer[]
  ripples: Ripple[]
} {
  const layers = Array.isArray(opts?.layers)
    ? opts!.layers.filter((l) => l && Number(l.rx) > 0 && Number(l.ry) > 0)
    : []
  const ripples: Ripple[] = []
  if (Array.isArray(opts?.ripples)) {
    const now = performance.now()
    for (const r of opts!.ripples) {
      if (!r) continue
      const x = Number(r.x)
      const y = Number(r.y)
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      const born = Number(r.born)
      ripples.push({
        x,
        y,
        born: Number.isFinite(born) ? born : now,
        power: Number(r.power) > 0 ? Number(r.power) : 1,
      })
    }
  }
  return { layers, ripples: ripples.slice(-5) }
}

function hitPaintLayer(
  inst: PaintInst,
  x: number,
  y: number,
): boolean {
  for (const layer of inst.layers) {
    const cx = inst.cssW * clamp01(Number(layer.cx), 0.5)
    const cy = inst.cssH * clamp01(Number(layer.cy), 0.5)
    const rx = inst.cssW * Math.max(0.02, Number(layer.rx) || 0.2) * 1.15
    const ry = inst.cssH * Math.max(0.02, Number(layer.ry) || 0.2) * 1.15
    const dx = (x - cx) / rx
    const dy = (y - cy) / ry
    if (dx * dx + dy * dy <= 1) return true
  }
  return false
}

/** 热更新图层 / 涟漪列表 */
export function updateCanvasPaint(
  el: HTMLCanvasElement | null | undefined,
  opts?: CanvasPaintOptions,
) {
  if (!el) return
  const inst = instances.get(el)
  if (!inst) return
  const norm = normalizeOpts(opts)
  inst.layers = norm.layers
  if (opts && 'ripples' in opts) {
    inst.ripples = norm.ripples
  }
}

/**
 * 向已启动的画布追加一记涟漪（像素坐标或 Pointer/Mouse 事件）。
 * 模版手写页可用；零代码侧优先用变量 `ripples` + setValue。
 */
export function addCanvasPaintRipple(
  el?: HTMLCanvasElement | null,
  xOrEvent?: number | Event | null,
  y?: number,
) {
  if (!el) return
  const inst = instances.get(el)
  if (!inst) return
  let x = 0
  let py = 0
  if (xOrEvent && typeof xOrEvent === 'object' && 'clientX' in xOrEvent) {
    const e = xOrEvent as MouseEvent
    const rect = el.getBoundingClientRect()
    x = e.clientX - rect.left
    py = e.clientY - rect.top
  } else {
    x = Number(xOrEvent) || 0
    py = Number(y) || 0
  }
  if (!hitPaintLayer(inst, x, py)) return
  inst.ripples.push({ x, y: py, born: performance.now(), power: 1 })
  if (inst.ripples.length > 5) inst.ripples.shift()
}

/** 启动画布绘制（同元素重复调用会先停再开） */
export function startCanvasPaint(
  el?: HTMLCanvasElement | null,
  opts?: CanvasPaintOptions,
) {
  const canvas = el ?? null
  if (!canvas) return
  stopCanvasPaint(canvas)

  const norm = normalizeOpts(opts)
  if (!norm.layers.length) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const inst: PaintInst = {
    canvas,
    layers: norm.layers,
    raf: 0,
    ro: null,
    cssW: 0,
    cssH: 0,
    ripples: norm.ripples,
    onVisibility: null,
  }
  instances.set(canvas, inst)

  syncSize(inst)
  inst.ro = new ResizeObserver(() => syncSize(inst))
  inst.ro.observe(canvas)

  const tick = (now: number) => {
    inst.raf = 0
    if (document.hidden) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintFrame(ctx, inst, now)
    inst.raf = requestAnimationFrame(tick)
  }

  inst.onVisibility = () => {
    if (document.hidden) {
      if (inst.raf) cancelAnimationFrame(inst.raf)
      inst.raf = 0
      return
    }
    if (!inst.raf) inst.raf = requestAnimationFrame(tick)
  }
  document.addEventListener('visibilitychange', inst.onVisibility)
  inst.raf = requestAnimationFrame(tick)
}

export function stopCanvasPaint(el?: HTMLCanvasElement | null) {
  if (el) {
    const inst = instances.get(el)
    if (inst) disposeInst(inst)
    return
  }
  for (const inst of [...instances.values()]) {
    disposeInst(inst)
  }
}
