import { useState, useEffect, useRef } from 'react'

const PASSAGES = [
  'the quick brown fox jumps over the lazy dog',
  'code is like humor when you have to explain it it is bad',
  'first solve the problem then write the code',
  'any fool can write code that a computer can understand good programmers write code that humans can understand',
  'talk is cheap show me the code',
  'in iiser kolkata we do not sleep we compile',
  'debugging is twice as hard as writing the code in the first place',
  'the best error message is the one that never shows up',
  'slashdot is the coolest club at iiser kolkata',
  'it works on my machine is not a valid deployment strategy',
]

export function TypingTestApp() {
  const [passage, setPassage] = useState(PASSAGES[0])
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(function() {
    if (started && !finished) {
      timerRef.current = setInterval(function() {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 500)
    }
    return function() { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, finished, startTime])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (!started && val.length === 1) {
      setStarted(true)
      setStartTime(Date.now())
    }
    setTyped(val)

    const correct = val.split('').filter((c, i) => c === passage[i]).length
    setAccuracy(val.length > 0 ? Math.round(correct / val.length * 100) : 100)

    if (val === passage) {
      setFinished(true)
      if (timerRef.current) clearInterval(timerRef.current)
      const mins = (Date.now() - startTime) / 60000
      setWpm(Math.round(passage.split(' ').length / mins))
    }
  }

  function reset() {
    const next = PASSAGES[Math.floor(Math.random() * PASSAGES.length)]
    setPassage(next)
    setTyped('')
    setStarted(false)
    setFinished(false)
    setElapsed(0)
    setWpm(0)
    setAccuracy(100)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(function() { inputRef.current?.focus() }, 50)
  }

  return (
    <div className="app-body" style={{ padding: '20px 24px' }}>
      <p className="app-label cyan">// typing.exe — Typing Speed Test</p>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        {[
          { label: 'WPM', value: finished ? wpm : started ? Math.round((typed.split(' ').length / Math.max(elapsed / 60, 0.01))) : 0, color: '#00ff46' },
          { label: 'Accuracy', value: accuracy + '%', color: '#00c8ff' },
          { label: 'Time', value: elapsed + 's', color: '#ffd700' },
          { label: 'Progress', value: Math.round(typed.length / passage.length * 100) + '%', color: '#c864ff' },
        ].map(function(stat) {
          return (
            <div key={stat.label} style={{ textAlign: 'center', flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px' }}>
              <div style={{ color: stat.color, fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 10 }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '16px', marginBottom: 16, lineHeight: 2, fontFamily: 'JetBrains Mono', fontSize: 14 }}>
        {passage.split('').map(function(char, i) {
          let color = '#444'
          if (i < typed.length) color = typed[i] === char ? '#00ff46' : '#ff5050'
          else if (i === typed.length) color = '#fff'
          return (
            <span key={i} style={{ color, borderBottom: i === typed.length ? '2px solid #fff' : 'none' }}>{char}</span>
          )
        })}
      </div>

      {!finished ? (
        <input
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          placeholder="Start typing..."
          autoFocus
          style={{
            width: '100%', padding: '10px 14px', background: '#111',
            border: '1px solid #333', borderRadius: 8,
            color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 14,
            outline: 'none', marginBottom: 10,
          }}
        />
      ) : (
        <div style={{ background: '#00ff4615', border: '1px solid #00ff4640', borderRadius: 8, padding: '16px', textAlign: 'center', marginBottom: 10 }}>
          <p style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>✓ Complete!</p>
          <p style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 12, margin: 0 }}>{wpm} WPM at {accuracy}% accuracy in {elapsed}s</p>
        </div>
      )}

      <button onClick={reset}
        style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #333', borderRadius: 6, color: '#888', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
        ↺ New passage
      </button>
    </div>
  )
}