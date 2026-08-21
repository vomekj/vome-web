/** 模版登录页水珠：页面自用，走通用 startCanvasPaint + 点击 addCanvasPaintRipple */
import { ref } from 'vue'
import {
  startCanvasPaint,
  stopCanvasPaint,
  addCanvasPaintRipple,
  type CanvasPaintOptions,
} from './canvas-effects'

export const bubbleRef = ref<HTMLCanvasElement | null>(null)

const DEFAULT_OPTS: CanvasPaintOptions = {
  layers: [
    {
      cx: 0.1,
      cy: 0.44,
      rx: 0.25,
      ry: 0.31,
      glow: 0.55,
      warp: 1,
      speed: 1,
    },
  ],
}

const unbindRipple = new WeakMap<HTMLCanvasElement, () => void>()

export function startBubble(
  el?: HTMLCanvasElement | null,
  opts?: CanvasPaintOptions,
) {
  const canvas = el ?? bubbleRef.value
  startCanvasPaint(canvas, opts ?? DEFAULT_OPTS)
  if (!canvas) return
  unbindRipple.get(canvas)?.()
  const onDown = (e: PointerEvent) => addCanvasPaintRipple(canvas, e)
  canvas.addEventListener('pointerdown', onDown)
  unbindRipple.set(canvas, () => canvas.removeEventListener('pointerdown', onDown))
}

export function stopBubble(el?: HTMLCanvasElement | null) {
  const canvas = el ?? bubbleRef.value
  if (canvas) unbindRipple.get(canvas)?.()
  if (el) {
    stopCanvasPaint(el)
    return
  }
  if (bubbleRef.value) {
    stopCanvasPaint(bubbleRef.value)
    return
  }
  stopCanvasPaint()
}
