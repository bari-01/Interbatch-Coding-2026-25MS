import { useState } from 'react'

interface Joke {
  setup: string
  punchline: string
  category: string
}

const JOKES: Joke[] = [
  { category: 'Programming', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' },
  { category: 'Programming', setup: 'How many programmers does it take to change a light bulb?', punchline: 'None. It\'s a hardware problem.' },
  { category: 'Programming', setup: 'Why do Java developers wear glasses?', punchline: 'Because they can\'t C#!' },
  { category: 'Programming', setup: 'What did the programmer say to his date?', punchline: 'You\'re looking array-geous tonight!' },
  { category: 'Programming', setup: 'Why don\'t programmers like nature?', punchline: 'It has too many bugs.' },
  { category: 'Programming', setup: 'What\'s a programmer\'s favorite hangout spot?', punchline: 'Foo Bar.' },
  { category: 'Science', setup: 'Why can\'t you trust an atom?', punchline: 'Because they make up everything!' },
  { category: 'Science', setup: 'What did one photon say to the other?', punchline: '"I\'m traveling light."' },
  { category: 'Science', setup: 'Why did the physics teacher break up with the biology teacher?', punchline: 'There was no chemistry.' },
  { category: 'Science', setup: 'What do you call an acid with attitude?', punchline: 'A-mean-o acid!' },
  { category: 'Science', setup: 'Why did the student eat his homework?', punchline: 'The teacher told him it was a piece of cake.' },
  { category: 'IISER', setup: 'What\'s an IISER student\'s favorite song?', punchline: '"Another One Bites the Dust" — the WiFi edition.' },
  { category: 'IISER', setup: 'Why did the IISER student cross the road?', punchline: 'To submit their assignment before the deadline. They didn\'t make it.' },
  { category: 'IISER', setup: 'What do IISER students and WiFi have in common?', punchline: 'Both disappear when you need them most.' },
  { category: 'IISER', setup: 'How many IISER students does it take to finish a project?', punchline: 'One. The night before the deadline.' },
  { category: 'Math', setup: 'Why was the equal sign so humble?', punchline: 'Because it knew it wasn\'t less than or greater than anyone else.' },
  { category: 'Math', setup: 'What do you call a snake that is 3.14 meters long?', punchline: 'A πthon.' },
  { category: 'Math', setup: 'Why was the math book sad?', punchline: 'Because it had too many problems.' },
]

export function JokeGeneratorApp() {
  const [current, setCurrent] = useState<Joke>(JOKES[0])
  const [revealed, setRevealed] = useState(false)
  const [category, setCategory] = useState<string | null>(null)
  const [history, setHistory] = useState<Joke[]>([])

  const categories = Array.from(new Set(JOKES.map(j => j.category)))

  function nextJoke() {
    const pool = category ? JOKES.filter(j => j.category === category) : JOKES
    const available = pool.filter(j => j.setup !== current.setup)
    const next = available[Math.floor(Math.random() * available.length)]
    setHistory(prev => [current, ...prev.slice(0, 4)])
    setCurrent(next)
    setRevealed(false)
  }

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// jokes.app — Random Joke Generator</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={function() { setCategory(null) }}
          style={{ padding: '3px 10px', background: !category ? '#ffd70020' : 'transparent', border: `1px solid ${!category ? '#ffd700' : '#333'}`, borderRadius: 4, color: !category ? '#ffd700' : '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
          All
        </button>
        {categories.map(function(cat) {
          return (
            <button key={cat} onClick={function() { setCategory(cat) }}
              style={{ padding: '3px 10px', background: category === cat ? '#ffd70020' : 'transparent', border: `1px solid ${category === cat ? '#ffd700' : '#333'}`, borderRadius: 4, color: category === cat ? '#ffd700' : '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
              {cat}
            </button>
          )
        })}
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '20px', marginBottom: 12, minHeight: 140 }}>
        <span style={{ background: '#ffd70020', color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 10, padding: '2px 8px', borderRadius: 10, border: '1px solid #ffd70040' }}>{current.category}</span>
        <p style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 14, lineHeight: 1.7, margin: '12px 0 16px' }}>{current.setup}</p>
        {!revealed ? (
          <button onClick={function() { setRevealed(true) }}
            style={{ padding: '7px 20px', background: '#ffd70020', border: '1px solid #ffd700', borderRadius: 6, color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
            Reveal punchline 🥁
          </button>
        ) : (
          <p style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: 1.7, borderTop: '1px solid #1e1e1e', paddingTop: 12 }}>
            😄 {current.punchline}
          </p>
        )}
      </div>

      <button onClick={nextJoke}
        style={{ width: '100%', padding: '8px', background: '#00ff4610', border: '1px solid #00ff4640', borderRadius: 6, color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer', marginBottom: 16 }}>
        Next Joke →
      </button>

      {history.length > 0 && (
        <>
          <p className="app-label yellow">// recent jokes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(function(j, i) {
              return (
                <div key={i} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '8px 12px' }}>
                  <p style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, margin: '0 0 4px' }}>{j.setup}</p>
                  <p style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 11, margin: 0 }}>{j.punchline}</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}