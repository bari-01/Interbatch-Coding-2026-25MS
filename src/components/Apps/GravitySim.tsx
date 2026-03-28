import { useEffect, useRef, useState } from 'react'

interface Body {
  x: number; y: number
  vx: number; vy: number
  mass: number; radius: number
  color: string
  trail: { x: number; y: number }[]
  name: string
}

const COLORS = ['#ffd700', '#00c8ff', '#ff5050', '#00ff46', '#c864ff', '#ff8800']

export function GravitySimApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bodiesRef = useRef<Body[]>([])
  const frameRef = useRef<number>(0)
  const draggingRef = useRef<number | null>(null)
  const dragVelRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 })
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  function initBodies(W: number, H: number) {
    bodiesRef.current = [
      { x: W/2, y: H/2, vx: 0, vy: 0, mass: 8000, radius: 18, color: '#ffd700', trail: [], name: 'Star' },
      { x: W/2+140, y: H/2, vx: 0, vy: 2.2, mass: 100, radius: 7, color: '#00c8ff', trail: [], name: 'Planet 1' },
      { x: W/2+220, y: H/2, vx: 0, vy: 1.8, mass: 60, radius: 5, color: '#00ff46', trail: [], name: 'Planet 2' },
      { x: W/2-170, y: H/2, vx: 0, vy: -2.0, mass: 80, radius: 6, color: '#ff5050', trail: [], name: 'Planet 3' },
    ]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    initBodies(W, H)

    function draw() {
      ctx.fillStyle = 'rgba(10,10,10,0.25)'
      ctx.fillRect(0, 0, W, H)

      const bodies = bodiesRef.current

      if (!pausedRef.current) {
        const G = 500
        const DT = 0.5

        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const dx = bodies[j].x - bodies[i].x
            const dy = bodies[j].y - bodies[i].y
            const dist = Math.max(Math.sqrt(dx*dx + dy*dy), 20)
            const force = G * bodies[i].mass * bodies[j].mass / (dist * dist)
            const ax = force * dx / dist / bodies[i].mass
            const ay = force * dy / dist / bodies[i].mass
            bodies[i].vx += ax * DT
            bodies[i].vy += ay * DT
            bodies[j].vx -= ax * DT * bodies[i].mass / bodies[j].mass
            bodies[j].vy -= ay * DT * bodies[i].mass / bodies[j].mass
          }
        }

        bodies.forEach(function(b, i) {
          if (draggingRef.current === i) return
          b.x += b.vx * DT
          b.y += b.vy * DT
          b.trail.push({ x: b.x, y: b.y })
          if (b.trail.length > 120) b.trail.shift()
        })
      }

      bodies.forEach(function(b) {
        if (b.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(b.trail[0].x, b.trail[0].y)
          b.trail.forEach(function(p, i) {
            const alpha = i / b.trail.length * 0.4
            ctx.strokeStyle = b.color.replace(')', `,${alpha})`).replace('rgb(', 'rgba(')
            ctx.lineTo(p.x, p.y)
          })
          ctx.strokeStyle = b.color + '40'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#888'
        ctx.font = '10px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(b.name, b.x, b.y - b.radius - 4)
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    const onMouseDown = function(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) * (W / rect.width)
      const my = (e.clientY - rect.top) * (H / rect.height)
      bodiesRef.current.forEach(function(b, i) {
        if (Math.hypot(mx - b.x, my - b.y) < b.radius + 10) {
          draggingRef.current = i
          dragVelRef.current = { x: 0, y: 0, lastX: mx, lastY: my }
        }
      })
    }

    const onMouseMove = function(e: MouseEvent) {
      if (draggingRef.current === null) return
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) * (W / rect.width)
      const my = (e.clientY - rect.top) * (H / rect.height)
      const b = bodiesRef.current[draggingRef.current]
      dragVelRef.current.x = mx - dragVelRef.current.lastX
      dragVelRef.current.y = my - dragVelRef.current.lastY
      dragVelRef.current.lastX = mx
      dragVelRef.current.lastY = my
      b.x = mx; b.y = my
    }

    const onMouseUp = function() {
      if (draggingRef.current !== null) {
        const b = bodiesRef.current[draggingRef.current]
        b.vx = dragVelRef.current.x * 2
        b.vy = dragVelRef.current.y * 2
        b.trail = []
      }
      draggingRef.current = null
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(frameRef.current)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function togglePause() {
    pausedRef.current = !pausedRef.current
    setPaused(p => !p)
  }

  function addPlanet() {
    const canvas = canvasRef.current
    if (!canvas) return
    const color = COLORS[bodiesRef.current.length % COLORS.length]
    bodiesRef.current.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      mass: 50 + Math.random() * 100,
      radius: 4 + Math.random() * 6,
      color, trail: [],
      name: 'Body ' + bodiesRef.current.length,
    })
  }

  function reset() {
    const canvas = canvasRef.current
    if (!canvas) return
    initBodies(canvas.width, canvas.height)
  }

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 12 }}>// gravity.app</span>
        <button onClick={togglePause} style={{ padding: '3px 12px', background: paused ? '#00ff4620' : '#ff505020', border: `1px solid ${paused ? '#00ff46' : '#ff5050'}`, borderRadius: 4, color: paused ? '#00ff46' : '#ff5050', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button onClick={addPlanet} style={{ padding: '3px 12px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>+ Body</button>
        <button onClick={reset} style={{ padding: '3px 12px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>↺ Reset</button>
        <span style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 10, marginLeft: 'auto' }}>Drag bodies to reposition</span>
      </div>
      <canvas ref={canvasRef} width={680} height={380} style={{ flex: 1, width: '100%', height: '100%', cursor: 'grab' }} />
    </div>
  )
}