import { useState } from 'react'

interface Entry {
  name: string
  message: string
  time: string
  batch?: string
}

const INITIAL: Entry[] = [
  { name: 'Sankhadeep Bera', message: 'Built this whole thing. Send help.', time: '2026-04-11 03:00', batch: '25MS' },
  { name: 'SlashDot Bot', message: 'Welcome to SlashDot OS! Type help in the terminal.', time: '2026-03-22 00:00', batch: 'System' },
]

export function GuestbookApp() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [batch, setBatch] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!name.trim() || !message.trim()) return
    const entry: Entry = {
      name: name.trim(),
      message: message.trim(),
      batch: batch.trim() || undefined,
      time: new Date().toLocaleString(),
    }
    setEntries(prev => [entry, ...prev])
    setName('')
    setMessage('')
    setBatch('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '7px 10px', background: '#111',
    border: '1px solid #222', borderRadius: 6,
    color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12,
    outline: 'none', marginBottom: 8,
  }

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// guestbook.app — Leave a message</p>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
        <p className="app-label yellow" style={{ marginTop: 0 }}>// sign the guestbook</p>
        <input value={name} onChange={function(e) { setName(e.target.value) }} placeholder="Your name *" style={inputStyle} />
        <input value={batch} onChange={function(e) { setBatch(e.target.value) }} placeholder="Batch (optional, e.g. 25MS)" style={inputStyle} />
        <textarea
          value={message}
          onChange={function(e) { setMessage(e.target.value) }}
          placeholder="Leave a message... *"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !message.trim()}
          style={{
            padding: '7px 20px', background: submitted ? '#00ff4630' : '#00ff4620',
            border: '1px solid #00ff46', borderRadius: 6,
            color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {submitted ? '✓ Signed!' : '✍ Sign Guestbook'}
        </button>
      </div>

      <p className="app-label yellow">// {entries.length} entries</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(function(e, i) {
          return (
            <div key={i} style={{
              background: '#111', border: '1px solid #1e1e1e',
              borderRadius: 8, padding: '10px 14px',
              borderLeft: '3px solid #00ff4640',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>
                  {e.name}
                  {e.batch && <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>[{e.batch}]</span>}
                </span>
                <span style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 10 }}>{e.time}</span>
              </div>
              <p style={{ color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{e.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}