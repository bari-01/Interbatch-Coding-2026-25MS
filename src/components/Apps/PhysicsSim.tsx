import { useEffect, useRef, useState } from 'react'

type SimType = 'projectile' | 'shm' | 'wave'

export function PhysicsSimApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [simType, setSimType] = useState<SimType>('projectile')
  const [params, setParams] = useState({ angle: 45, velocity: 50, gravity: 9.8, amplitude: 80, frequency: 1, damping: 0.02 })
  const [running, setRunning] = useState(true)
  const runningRef = useRef(true)
  const simRef = useRef<SimType>('projectile')
  const paramsRef = useRef(params)

  useEffect(() => { paramsRef.current = params }, [params])
  useEffect(() => { simRef.current = simType; timeRef.current = 0 }, [simType])
  useEffect(() => { runningRef.current = running }, [running])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    const projTrail: { x: number; y: number }[] = []

    function drawGrid() {
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(0, H - 60); ctx.lineTo(W, H - 60); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(60, H); ctx.stroke()
    }

    function drawProjectile(t: number) {
      const { angle, velocity, gravity } = paramsRef.current
      const rad = angle * Math.PI / 180
      const vx = velocity * Math.cos(rad)
      const vy = velocity * Math.sin(rad)
      const scale = 4
      const ox = 60; const oy = H - 60

      projTrail.length = 0
      for (let ti = 0; ti <= t; ti += 0.05) {
        const x = ox + vx * ti * scale
        const y = oy - (vy * ti - 0.5 * gravity * ti * ti) * scale
        if (y > oy) break
        projTrail.push({ x, y })
      }

      if (projTrail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(projTrail[0].x, projTrail[0].y)
        projTrail.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.strokeStyle = '#ffd70060'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      const last = projTrail[projTrail.length - 1]
      if (last) {
        ctx.beginPath()
        ctx.arc(last.x, last.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#ffd700'
        ctx.shadowColor = '#ffd700'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      const range = (2 * vx * vy / gravity) * scale
      const maxH = (vy * vy / (2 * gravity)) * scale

      ctx.fillStyle = '#555'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(`Range: ${Math.round(range / scale * 10) / 10}m`, 70, H - 40)
      ctx.fillText(`Max H: ${Math.round(maxH / scale * 10) / 10}m`, 70, H - 26)
      ctx.fillText(`T: ${Math.round(t * 10) / 10}s`, 70, H - 12)

      const totalTime = 2 * vy / gravity
      if (t > totalTime) timeRef.current = 0
    }

    function drawSHM(t: number) {
      const { amplitude, frequency, damping } = paramsRef.current
      const CX = W / 2; const CY = H / 2

      ctx.strokeStyle = '#00c8ff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const ti = (x - CX) / 40
        const y = CY - amplitude * Math.exp(-damping * Math.abs(ti)) * Math.cos(2 * Math.PI * frequency * ti)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      const decay = Math.exp(-damping * t)
      const ballY = CY - amplitude * decay * Math.cos(2 * Math.PI * frequency * t)
      const ballX = CX + t * 40

      if (ballX < W) {
        ctx.beginPath()
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#00c8ff'
        ctx.shadowColor = '#00c8ff'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.moveTo(ballX, CY)
        ctx.lineTo(ballX, ballY)
        ctx.strokeStyle = '#00c8ff40'
        ctx.lineWidth = 1
        ctx.stroke()
      } else {
        timeRef.current = 0
      }

      ctx.fillStyle = '#555'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(`A: ${amplitude}px  f: ${frequency}Hz  γ: ${damping}`, 10, H - 12)
    }

    function drawWave(t: number) {
      const { amplitude, frequency } = paramsRef.current
      const CY = H / 2

      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const y = CY - amplitude * Math.sin(2 * Math.PI * (x / 80 - frequency * t * 0.1))
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#00ff46'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ff46'
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const y = CY - amplitude * Math.sin(2 * Math.PI * (x / 80 - frequency * t * 0.1) + Math.PI / 2)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#ffd70060'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const y1 = CY - amplitude * Math.sin(2 * Math.PI * (x / 80 - frequency * t * 0.1))
        const y2 = CY - amplitude * Math.sin(2 * Math.PI * (x / 80 - frequency * t * 0.1) + Math.PI / 2)
        const sum = CY - ((y1 - CY) + (y2 - CY))
        x === 0 ? ctx.moveTo(x, sum) : ctx.lineTo(x, sum)
      }
      ctx.strokeStyle = '#c864ff'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#555'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText('Green: wave 1  Yellow: wave 2  Purple: superposition', 10, H - 12)
    }

    function loop() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)
      drawGrid()

      const t = timeRef.current
      if (simRef.current === 'projectile') drawProjectile(t)
      else if (simRef.current === 'shm') drawSHM(t)
      else drawWave(t)

      if (runningRef.current) timeRef.current += 0.05
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const sliders: { key: keyof typeof params; label: string; min: number; max: number; step: number; show: SimType[] }[] = [
    { key: 'angle',     label: 'Angle (°)',   min: 1,   max: 89,  step: 1,    show: ['projectile'] },
    { key: 'velocity',  label: 'Velocity',    min: 10,  max: 100, step: 1,    show: ['projectile'] },
    { key: 'gravity',   label: 'Gravity',     min: 1,   max: 20,  step: 0.1,  show: ['projectile'] },
    { key: 'amplitude', label: 'Amplitude',   min: 10,  max: 120, step: 1,    show: ['shm', 'wave'] },
    { key: 'frequency', label: 'Frequency',   min: 0.1, max: 5,   step: 0.1,  show: ['shm', 'wave'] },
    { key: 'damping',   label: 'Damping',     min: 0,   max: 0.2, step: 0.01, show: ['shm'] },
  ]

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {(['projectile', 'shm', 'wave'] as SimType[]).map(function(s) {
          return (
            <button key={s} onClick={function() { setSimType(s); timeRef.current = 0 }}
              style={{ padding: '3px 10px', background: simType === s ? '#00ff4620' : 'transparent', border: `1px solid ${simType === s ? '#00ff46' : '#333'}`, borderRadius: 4, color: simType === s ? '#00ff46' : '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
              {s === 'projectile' ? 'Projectile' : s === 'shm' ? 'SHM' : 'Wave'}
            </button>
          )
        })}
        <button onClick={function() { setRunning(r => !r) }}
          style={{ padding: '3px 10px', background: 'transparent', border: `1px solid ${running ? '#ff5050' : '#00ff46'}`, borderRadius: 4, color: running ? '#ff5050' : '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer', marginLeft: 'auto' }}>
          {running ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>
      <canvas ref={canvasRef} width={680} height={280} style={{ flex: 1, width: '100%' }} />
      <div style={{ padding: '8px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {sliders.filter(s => s.show.includes(simType)).map(function(s) {
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 10, minWidth: 80 }}>{s.label}: {params[s.key]}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={params[s.key]}
                onChange={function(e) { setParams(p => ({ ...p, [s.key]: parseFloat(e.target.value) })); timeRef.current = 0 }}
                style={{ width: 80 }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}