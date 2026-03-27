import { useEffect, useRef, useState } from 'react'

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    ball: { x: 320, y: 210, vx: 4, vy: 3 },
    p1: { y: 160, score: 0 },
    p2: { y: 160, score: 0 },
    keys: {} as Record<string, boolean>,
    gameOver: false,
    started: false,
    winner: '',
  })
  const animRef = useRef<number>(0)
  const [display, setDisplay] = useState({ p1: 0, p2: 0, gameOver: false, winner: '', started: false })

  const PH = 80
  const PW = 10
  const BALL_R = 7
  const W = 640
  const H = 420
  const WIN_SCORE = 7

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const onKey = (e: KeyboardEvent, down: boolean) => {
      stateRef.current.keys[e.key] = down
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault()
      if (down && e.key === 'Enter') {
        const s = stateRef.current
        s.ball = { x: W / 2, y: H / 2, vx: 4 * (Math.random() > 0.5 ? 1 : -1), vy: 3 * (Math.random() > 0.5 ? 1 : -1) }
        s.p1 = { y: H / 2 - PH / 2, score: 0 }
        s.p2 = { y: H / 2 - PH / 2, score: 0 }
        s.gameOver = false
        s.started = true
        s.winner = ''
        setDisplay({ p1: 0, p2: 0, gameOver: false, winner: '', started: true })
      }
    }

    window.addEventListener('keydown', e => onKey(e, true))
    window.addEventListener('keyup', e => onKey(e, false))

    function drawRect(x: number, y: number, w: number, h: number, color: string) {
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.fillRect(x, y, w, h)
      ctx.shadowBlur = 0
    }

    function drawBall(x: number, y: number) {
      ctx.beginPath()
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 12
      ctx.fill()
      ctx.shadowBlur = 0
    }

    function drawNet() {
      ctx.setLineDash([10, 10])
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])
    }

    function loop() {
      const s = stateRef.current
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)
      drawNet()

      if (!s.started) {
        ctx.fillStyle = '#00ff46'
        ctx.font = 'bold 28px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText('PONG', W / 2, H / 2 - 50)
        ctx.fillStyle = '#aaa'
        ctx.font = '13px JetBrains Mono'
        ctx.fillText('Player 1: W / S keys', W / 2, H / 2 - 10)
        ctx.fillText('Player 2: ↑ / ↓ keys', W / 2, H / 2 + 14)
        ctx.fillStyle = '#00ff46'
        ctx.fillText('Press ENTER to start', W / 2, H / 2 + 50)
        animRef.current = requestAnimationFrame(loop)
        return
      }

      if (s.gameOver) {
        ctx.fillStyle = '#ffd700'
        ctx.font = 'bold 24px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(s.winner + ' WINS!', W / 2, H / 2 - 20)
        ctx.fillStyle = '#aaa'
        ctx.font = '13px JetBrains Mono'
        ctx.fillText('Press ENTER to restart', W / 2, H / 2 + 20)
        animRef.current = requestAnimationFrame(loop)
        return
      }

      const SPEED = 5
      if (s.keys['w'] && s.p1.y > 0)          s.p1.y -= SPEED
      if (s.keys['s'] && s.p1.y < H - PH)     s.p1.y += SPEED
      if (s.keys['ArrowUp'] && s.p2.y > 0)    s.p2.y -= SPEED
      if (s.keys['ArrowDown'] && s.p2.y < H - PH) s.p2.y += SPEED

      s.ball.x += s.ball.vx
      s.ball.y += s.ball.vy

      if (s.ball.y - BALL_R < 0 || s.ball.y + BALL_R > H) s.ball.vy *= -1

      // P1 paddle collision
      if (
        s.ball.x - BALL_R < PW + 20 &&
        s.ball.y > s.p1.y &&
        s.ball.y < s.p1.y + PH
      ) {
        s.ball.vx = Math.abs(s.ball.vx) * 1.05
        const hitPos = (s.ball.y - s.p1.y) / PH - 0.5
        s.ball.vy = hitPos * 8
      }

      // P2 paddle collision
      if (
        s.ball.x + BALL_R > W - PW - 20 &&
        s.ball.y > s.p2.y &&
        s.ball.y < s.p2.y + PH
      ) {
        s.ball.vx = -Math.abs(s.ball.vx) * 1.05
        const hitPos = (s.ball.y - s.p2.y) / PH - 0.5
        s.ball.vy = hitPos * 8
      }

      // Cap speed
      s.ball.vx = Math.max(-12, Math.min(12, s.ball.vx))
      s.ball.vy = Math.max(-10, Math.min(10, s.ball.vy))

      // Scoring
      if (s.ball.x < 0) {
        s.p2.score++
        s.ball = { x: W / 2, y: H / 2, vx: -4, vy: 3 * (Math.random() > 0.5 ? 1 : -1) }
        setDisplay(d => ({ ...d, p2: s.p2.score }))
        if (s.p2.score >= WIN_SCORE) {
          s.gameOver = true
          s.winner = 'Player 2'
          setDisplay(d => ({ ...d, gameOver: true, winner: 'Player 2' }))
        }
      }
      if (s.ball.x > W) {
        s.p1.score++
        s.ball = { x: W / 2, y: H / 2, vx: 4, vy: 3 * (Math.random() > 0.5 ? 1 : -1) }
        setDisplay(d => ({ ...d, p1: s.p1.score }))
        if (s.p1.score >= WIN_SCORE) {
          s.gameOver = true
          s.winner = 'Player 1'
          setDisplay(d => ({ ...d, gameOver: true, winner: 'Player 1' }))
        }
      }

      // Draw paddles and ball
      drawRect(20, s.p1.y, PW, PH, '#00ff46')
      drawRect(W - PW - 20, s.p2.y, PW, PH, '#00c8ff')
      drawBall(s.ball.x, s.ball.y)

      // Scores
      ctx.fillStyle = '#00ff46'
      ctx.font = 'bold 32px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText(String(s.p1.score), W / 4, 48)
      ctx.fillStyle = '#00c8ff'
      ctx.fillText(String(s.p2.score), (W * 3) / 4, 48)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('keydown', e => onKey(e, true))
      window.removeEventListener('keyup', e => onKey(e, false))
    }
  }, [])

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 16px', borderBottom: '1px solid #1e1e1e',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      }}>
        <span style={{ color: '#00ff46' }}>P1 — W/S keys</span>
        <span style={{ color: '#ffd700' }}>First to {WIN_SCORE} wins</span>
        <span style={{ color: '#00c8ff' }}>P2 — ↑/↓ keys</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ flex: 1, display: 'block', width: '100%', height: '100%' }}
        tabIndex={0}
      />
      <div style={{
        padding: '4px 16px', borderTop: '1px solid #1e1e1e',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#555',
      }}>
        Press Enter to start/restart
      </div>
    </div>
  )
}