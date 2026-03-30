import { useEffect, useRef } from 'react'

interface Props {
  intensity?: number
}

interface Drop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

export function DesktopRain({ intensity = 60 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drops: Drop[] = Array.from({ length: intensity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 6,
      length: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3,
    }))

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach(function(d) {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - 1, d.y + d.length)
        ctx.strokeStyle = `rgba(0,200,255,${d.opacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        d.y += d.speed
        if (d.y > canvas.height) {
          d.y = -d.length
          d.x = Math.random() * canvas.width
        }
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}