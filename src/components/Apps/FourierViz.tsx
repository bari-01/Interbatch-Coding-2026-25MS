import { useEffect, useRef, useState } from 'react'

export function FourierVizApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [harmonics, setHarmonics] = useState(5)
  const [waveType, setWaveType] = useState<'square' | 'sawtooth' | 'triangle'>('square')
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const CX = W * 0.35
    const CY = H / 2

    function getSeries(n: number): { freq: number; amp: number }[] {
      const series = []
      if (waveType === 'square') {
        for (let k = 0; k < n; k++) {
          const harmonic = 2 * k + 1
          series.push({ freq: harmonic, amp: (4 / Math.PI) / harmonic })
        }
      } else if (waveType === 'sawtooth') {
        for (let k = 1; k <= n; k++) {
          series.push({ freq: k, amp: (2 / Math.PI) * (k % 2 === 0 ? -1 : 1) / k })
        }
      } else {
        for (let k = 0; k < n; k++) {
          const harmonic = 2 * k + 1
          const sign = k % 2 === 0 ? 1 : -1
          series.push({ freq: harmonic, amp: sign * (8 / (Math.PI * Math.PI)) / (harmonic * harmonic) })
        }
      }
      return series
    }

    const waveHistory: number[] = []

    function draw() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      const series = getSeries(harmonics)
      const t = timeRef.current
      const baseRadius = 60

      let x = CX
      let y = CY

      series.forEach(function(s, i) {
        const r = baseRadius * Math.abs(s.amp)
        const angle = s.freq * t + (s.amp < 0 ? Math.PI : 0)
        const nx = x + r * Math.cos(angle)
        const ny = y + r * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,200,255,${0.15 + i * 0.03})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = i === 0 ? '#00ff46' : '#00c8ff'
        ctx.lineWidth = i === 0 ? 2 : 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(nx, ny, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#00ff46'
        ctx.fill()

        x = nx
        y = ny
      })

      waveHistory.unshift(y)
      if (waveHistory.length > W - Math.round(CX) - 20) waveHistory.pop()

      ctx.beginPath()
      ctx.moveTo(CX + 20, waveHistory[0])
      waveHistory.forEach(function(wy, i) {
        ctx.lineTo(CX + 20 + i, wy)
      })
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(CX + 20, waveHistory[0])
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(CX + 20, 0)
      ctx.lineTo(CX + 20, H)
      ctx.stroke()

      ctx.fillStyle = '#555'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(`${waveType} wave — ${harmonics} harmonics`, CX + 24, 14)

      timeRef.current += 0.04
      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [harmonics, waveType])

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#00c8ff', fontFamily: 'JetBrains Mono', fontSize: 12 }}>// fourier.app</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['square', 'sawtooth', 'triangle'] as const).map(function(t) {
            return (
              <button key={t} onClick={function() { setWaveType(t) }} style={{
                padding: '3px 10px', background: waveType === t ? '#00c8ff20' : 'transparent',
                border: `1px solid ${waveType === t ? '#00c8ff' : '#333'}`,
                borderRadius: 4, color: waveType === t ? '#00c8ff' : '#666',
                fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer',
              }}>{t}</button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 11 }}>Harmonics: {harmonics}</span>
          <input type="range" min={1} max={20} value={harmonics} onChange={function(e) { setHarmonics(Number(e.target.value)) }} style={{ width: 100 }} />
        </div>
      </div>
      <canvas ref={canvasRef} width={680} height={340} style={{ flex: 1, width: '100%', height: '100%' }} />
      <div style={{ padding: '4px 16px', borderTop: '1px solid #1e1e1e', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#444', display: 'flex', gap: 24 }}>
        <span style={{ color: '#00ff46' }}>● circles = harmonics</span>
        <span style={{ color: '#ffd700' }}>● wave output</span>
      </div>
    </div>
  )
}