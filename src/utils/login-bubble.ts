/** 登录页 canvas 水珠动画（与 admin 同源） */
import { ref } from 'vue'

export const bubbleRef = ref<HTMLCanvasElement | null>(null)
let bubbleRaf = 0
let bubbleRo: ResizeObserver | null = null
let bubbleCssW = 0
let bubbleCssH = 0
let bubbleOnVisibility: (() => void) | null = null
let bubbleOnPointer: ((e: PointerEvent) => void) | null = null

/** 点击涟漪：局部把表面向外推开后衰减 */
type BubbleRipple = { x: number; y: number; born: number; power: number }
const bubbleRipples: BubbleRipple[] = []
const RIPPLE_LIFE = 1.6

function syncBubbleSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  bubbleCssW = rect.width
  bubbleCssH = rect.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const nextW = Math.max(1, Math.floor(bubbleCssW * dpr))
  const nextH = Math.max(1, Math.floor(bubbleCssH * dpr))
  if (canvas.width !== nextW) canvas.width = nextW
  if (canvas.height !== nextH) canvas.height = nextH
}

function bubbleCenter(w: number, h: number, t: number) {
  const cx = w * 0.1
  const cy = h * 0.44
  const ox =
    Math.sin(t * 0.32) * w * 0.018 + Math.sin(t * 0.19) * w * 0.012
  const oy =
    Math.cos(t * 0.27) * h * 0.022 + Math.sin(t * 0.38) * h * 0.01
  return {
    cx: cx + ox,
    cy: cy + oy,
    baseRx: w * 0.5,
    baseRy: h * 0.62,
  }
}

function ripplePush(px: number, py: number, nowMs: number) {
  let push = 0
  for (let i = bubbleRipples.length - 1; i >= 0; i--) {
    const r = bubbleRipples[i]!
    const age = (nowMs - r.born) / 1000
    if (age > RIPPLE_LIFE) {
      bubbleRipples.splice(i, 1)
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

/** 画布水珠：多频正弦形变 + 点击涟漪 */
function paintBubble(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  nowMs: number,
) {
  ctx.clearRect(0, 0, w, h)
  if (w < 2 || h < 2) return

  const { cx, cy, baseRx, baseRy } = bubbleCenter(w, h, t)

  const segments = 96
  const points: Array<{ x: number; y: number }> = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const wave =
      0.14 * Math.sin(a * 2 + t * 0.85) +
      0.09 * Math.sin(a * 3 - t * 1.05) +
      0.055 * Math.sin(a * 5 + t * 0.55) +
      0.04 * Math.cos(a * 4 + t * 0.72)
    let rx = baseRx * (1 + wave)
    let ry = baseRy * (1 + wave * 0.9 + 0.05 * Math.sin(a * 1.5 + t * 0.48))
    const nx = Math.cos(a)
    const ny = Math.sin(a)
    const roughX = cx + nx * rx
    const roughY = cy + ny * ry
    const push = ripplePush(roughX, roughY, nowMs)
    rx *= 1 + push
    ry *= 1 + push
    points.push({
      x: cx + nx * rx,
      y: cy + ny * ry,
    })
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
  grad.addColorStop(0.28, 'rgba(186, 196, 255, 0.48)')
  grad.addColorStop(0.58, 'rgba(120, 135, 255, 0.28)')
  grad.addColorStop(0.82, 'rgba(155, 168, 255, 0.12)')
  grad.addColorStop(1, 'rgba(155, 168, 255, 0)')

  ctx.save()
  ctx.shadowColor = 'rgba(78, 93, 255, 0.28)'
  ctx.shadowBlur = Math.min(w, h) * 0.06
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()

  // 点击亮环
  for (const r of bubbleRipples) {
    const age = (nowMs - r.born) / 1000
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

export function startBubble(el?: HTMLCanvasElement | null) {
  const canvas = el ?? bubbleRef.value
  if (!canvas) return
  bubbleRef.value = canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  syncBubbleSize(canvas)
  bubbleRo = new ResizeObserver(() => syncBubbleSize(canvas))
  bubbleRo.observe(canvas)

  bubbleOnPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const t = performance.now() / 1000
    const { cx, cy, baseRx, baseRy } = bubbleCenter(bubbleCssW, bubbleCssH, t)
    // 椭圆近似：点在泡附近才响应
    const dx = (x - cx) / (baseRx * 1.15)
    const dy = (y - cy) / (baseRy * 1.15)
    if (dx * dx + dy * dy > 1) return

    bubbleRipples.push({ x, y, born: performance.now(), power: 1 })
    if (bubbleRipples.length > 5) bubbleRipples.shift()
  }
  canvas.addEventListener('pointerdown', bubbleOnPointer)

  const tick = (now: number) => {
    bubbleRaf = 0
    if (document.hidden) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintBubble(ctx, bubbleCssW, bubbleCssH, now / 1000, now)
    bubbleRaf = requestAnimationFrame(tick)
  }

  bubbleOnVisibility = () => {
    if (document.hidden) {
      if (bubbleRaf) cancelAnimationFrame(bubbleRaf)
      bubbleRaf = 0
      return
    }
    if (!bubbleRaf) bubbleRaf = requestAnimationFrame(tick)
  }
  document.addEventListener('visibilitychange', bubbleOnVisibility)
  bubbleRaf = requestAnimationFrame(tick)
}

export function stopBubble() {
  if (bubbleRaf) cancelAnimationFrame(bubbleRaf)
  bubbleRaf = 0
  bubbleRo?.disconnect()
  bubbleRo = null
  if (bubbleOnVisibility) {
    document.removeEventListener('visibilitychange', bubbleOnVisibility)
    bubbleOnVisibility = null
  }
  const canvas = bubbleRef.value
  if (canvas && bubbleOnPointer) {
    canvas.removeEventListener('pointerdown', bubbleOnPointer)
  }
  bubbleOnPointer = null
  bubbleRipples.length = 0
}

