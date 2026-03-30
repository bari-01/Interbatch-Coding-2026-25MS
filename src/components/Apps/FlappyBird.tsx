import { useEffect, useRef, useState } from 'react'

const W = 640
const H = 420
const BIRD_X = 120
const BIRD_R = 14
const GRAVITY = 0.5
const JUMP = -9
const PIPE_W = 52
const GAP = 140
const PIPE_SPEED = 3
const PIPE_INTERVAL = 180

interface Pipe {
  x: number
  top: number
  scored: boolean
}

export function FlappyBirdApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const stateRef = useRef({
    bird: { y: H / 2, vy: 0 },
    pipes: [] as Pipe[],
    score: 0,
    best: 0,
    frame: 0,
    started: false,
    dead: false,
  })
  const [display, setDisplay] = useState({ score: 0, best: 0, dead: false, started: false })

  function jump() {
    const s = stateRef.current
    if (s.dead) {
      s.bird = { y: H / 2, vy: 0 }
      s.pipes = []
      s.score = 0
      s.frame = 0
      s.dead = false
      s.started = true
      setDisplay(d => ({ ...d, score: 0, dead: false, started: true }))
      return
    }
    if (!s.started) {
      s.started = true
      setDisplay(d => ({ ...d, started: true }))
    }
    s.bird.vy = JUMP
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump() }
    }
    const onClick = () => jump()

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onClick)

    function drawBird(y: number, dead: boolean) {
      ctx.save()
      ctx.translate(BIRD_X, y)

      ctx.fillStyle = dead ? '#ff5050' : '#ffd700'
      ctx.shadowColor = dead ? '#ff5050' : '#ffd700'
      ctx.shadowBlur = 10
      ctx.font = 'bold 14px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText('{', -8, 5)
      ctx.fillText('}', 8, 5)

      ctx.shadowBlur = 0
      ctx.restore()
    }

    function drawPipe(pipe: Pipe) {
      const btm = pipe.top + GAP

      ctx.fillStyle = '#00ff4620'
      ctx.strokeStyle = '#00ff46'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ff46'
      ctx.shadowBlur = 6

      ctx.fillRect(pipe.x, 0, PIPE_W, pipe.top)
      ctx.strokeRect(pipe.x, 0, PIPE_W, pipe.top)

      ctx.fillRect(pipe.x, btm, PIPE_W, H - btm)
      ctx.strokeRect(pipe.x, btm, PIPE_W, H - btm)

      ctx.fillStyle = '#00ff4640'
      ctx.fillRect(pipe.x - 4, pipe.top - 16, PIPE_W + 8, 16)
      ctx.fillRect(pipe.x - 4, btm, PIPE_W + 8, 16)
      ctx.strokeRect(pipe.x - 4, pipe.top - 16, PIPE_W + 8, 16)
      ctx.strokeRect(pipe.x - 4, btm, PIPE_W + 8, 16)

      ctx.shadowBlur = 0
    }

    function loop() {
      const s = stateRef.current
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = '#111'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      if (!s.started) {
        ctx.fillStyle = '#00ff46'
        ctx.font = 'bold 28px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText('FLAPPY { }', W / 2, H / 2 - 40)
        ctx.fillStyle = '#aaa'
        ctx.font = '13px JetBrains Mono'
        ctx.fillText('Press Space or Click to start', W / 2, H / 2)
        ctx.fillText('Navigate { } through the pipes!', W / 2, H / 2 + 24)
        drawBird(H / 2, false)
        frameRef.current = requestAnimationFrame(loop)
        return
      }

      if (!s.dead) {
        s.bird.vy += GRAVITY
        s.bird.y += s.bird.vy
        s.frame++

        if (s.frame % PIPE_INTERVAL === 0) {
          const top = 60 + Math.random() * (H - GAP - 120)
          s.pipes.push({ x: W, top, scored: false })
        }

        s.pipes = s.pipes.filter(p => p.x + PIPE_W > 0)
        s.pipes.forEach(p => {
          p.x -= PIPE_SPEED
          if (!p.scored && p.x + PIPE_W < BIRD_X) {
            p.scored = true
            s.score++
            if (s.score > s.best) s.best = s.score
            setDisplay(d => ({ ...d, score: s.score, best: s.best }))
          }

          const bx = BIRD_X
          const by = s.bird.y
          const inX = bx + BIRD_R > p.x + 4 && bx - BIRD_R < p.x + PIPE_W - 4
          const inY = by - BIRD_R < p.top || by + BIRD_R > p.top + GAP
          if (inX && inY) { s.dead = true; setDisplay(d => ({ ...d, dead: true })) }
        })

        if (s.bird.y + BIRD_R > H || s.bird.y - BIRD_R < 0) {
          s.dead = true
          setDisplay(d => ({ ...d, dead: true }))
        }
      }

      s.pipes.forEach(p => drawPipe(p))
      drawBird(s.bird.y, s.dead)

      ctx.fillStyle = '#ffd700'
      ctx.font = 'bold 20px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(`Score: ${s.score}`, 16, 30)
      ctx.fillStyle = '#555'
      ctx.font = '12px JetBrains Mono'
      ctx.fillText(`Best: ${s.best}`, 16, 50)

      if (s.dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#ff5050'
        ctx.font = 'bold 28px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', W / 2, H / 2 - 30)
        ctx.fillStyle = '#ffd700'
        ctx.font = '16px JetBrains Mono'
        ctx.fillText(`Score: ${s.score}   Best: ${s.best}`, W / 2, H / 2 + 10)
        ctx.fillStyle = '#aaa'
        ctx.font = '13px JetBrains Mono'
        ctx.fillText('Press Space or Click to restart', W / 2, H / 2 + 44)
      }

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700 }}>Flappy {'{'} {'}'} — Navigate the brackets!</span>
        <span style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 11 }}>Space / Click to flap</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ flex: 1, width: '100%', cursor: 'pointer' }} tabIndex={0} />
    </div>
  )
}