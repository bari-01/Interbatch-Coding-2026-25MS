import { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: 'sin(x)', fn: 'Math.sin(x)' },
  { label: 'cos(x)', fn: 'Math.cos(x)' },
  { label: 'x²',     fn: 'x*x' },
  { label: 'x³',     fn: 'x*x*x' },
  { label: 'tan(x)', fn: 'Math.tan(x)' },
  { label: '1/x',    fn: '1/x' },
  { label: 'e^x',    fn: 'Math.exp(x)' },
  { label: '√x',     fn: 'Math.sqrt(x)' },
]

export function GraphPlotterApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fnStr, setFnStr] = useState('Math.sin(x)')
  const [input, setInput] = useState('Math.sin(x)')
  const [error, setError] = useState('')
  const [xRange, setXRange] = useState(10)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const CX = W / 2
    const CY = H / 2
    const scaleX = W / (xRange * 2)
    const scaleY = H / 8

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += scaleX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(W - x, 0); ctx.lineTo(W - x, H); ctx.stroke()
    }
    for (let y = 0; y < H; y += scaleY) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, H - y); ctx.lineTo(W, H - y); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(W, CY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, H); ctx.stroke()

    // Axis labels
    ctx.fillStyle = '#444'
    ctx.font = '9px JetBrains Mono'
    ctx.textAlign = 'center'
    for (let i = -Math.floor(xRange); i <= Math.floor(xRange); i += 2) {
      if (i === 0) continue
      const px = CX + i * scaleX
      ctx.fillText(String(i), px, CY + 12)
    }

    // Plot function
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('x', 'Math', `return ${fnStr}`)
      ctx.beginPath()
      ctx.strokeStyle = '#00ff46'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ff46'
      ctx.shadowBlur = 4
      let first = true
      for (let px = 0; px < W; px++) {
        const x = (px - CX) / scaleX
        const y = fn(x, Math)
        if (!isFinite(y)) { first = true; continue }
        const py = CY - y * scaleY
        if (Math.abs(py - CY) > H) { first = true; continue }
        if (first) { ctx.moveTo(px, py); first = false }
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      setError('')
    } catch (e) {
      setError('Invalid expression')
    }
  }, [fnStr, xRange])

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// grapher.app — Function Plotter</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <input
          value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={function(e) { if (e.key === 'Enter') setFnStr(input) }}
          placeholder="f(x) = ..."
          style={{
            flex: 1, padding: '6px 10px', background: '#111',
            border: `1px solid ${error ? '#ff5050' : '#222'}`,
            borderRadius: 6, color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={function() { setFnStr(input) }}
          style={{ padding: '6px 14px', background: '#00ff4620', border: '1px solid #00ff46', borderRadius: 6, color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
          Plot
        </button>
      </div>

      {error && <p style={{ color: '#ff5050', fontFamily: 'JetBrains Mono', fontSize: 11, marginBottom: 8 }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {PRESETS.map(function(p) {
          return (
            <button key={p.label} onClick={function() { setInput(p.fn); setFnStr(p.fn) }}
              style={{
                padding: '2px 8px', background: fnStr === p.fn ? '#00ff4620' : 'transparent',
                border: `1px solid ${fnStr === p.fn ? '#00ff46' : '#333'}`,
                borderRadius: 4, color: fnStr === p.fn ? '#00ff46' : '#666',
                fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer',
              }}>
              {p.label}
            </button>
          )
        })}
      </div>

      <canvas ref={canvasRef} width={640} height={280} style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 11 }}>X range: ±{xRange}</span>
        <input type="range" min={2} max={30} value={xRange} onChange={function(e) { setXRange(Number(e.target.value)) }} style={{ flex: 1 }} />
      </div>
    </div>
  )
}