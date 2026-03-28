import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'ai'
  content: string
  time: string
}

const RESPONSES: Record<string, string[]> = {
  hello:     ['Hello! I am SlashDot AI. How can I assist you today?', 'Greetings, human. What brings you to my terminal?', 'Hi there! Ready to answer your questions — or pretend to.'],
  hi:        ['Hey! What can I help you with?', 'Hi! Ask me anything about IISER, coding, or the meaning of life.'],
  iiser:     ['IISER Kolkata — Indian Institute of Science Education and Research, Kolkata. A premier research institution. Home to some of the most sleep-deprived students in India.', 'Ah, IISER Kolkata! Where the WiFi is a myth and the deadlines are real.'],
  slashdot:  ['SlashDot is the Programming & Design Club of IISER Kolkata. We build cool stuff and occasionally sleep.', 'The best club at IISER. Obviously. I may be biased — I am their AI.'],
  code:      ['Ah, coding! The art of turning caffeine into software. What language are you working with?', 'Code is poetry. Except when it has bugs. Then it is a horror novel.'],
  python:    ['Python is excellent! Readable, versatile, and beloved. pip install everything.', 'Ah Python — the language that makes you think programming is easy until it isn\'t.'],
  javascript: ['JavaScript — the language of the web! Also the language of unexpected behavior. typeof null === "object"? Classic.', 'JavaScript: where every function returns undefined until it doesn\'t.'],
  help:      ['I can talk about: IISER, SlashDot, programming, science, jokes, life advice, or the meaning of the universe.', 'Ask me anything! I will answer with varying degrees of accuracy.'],
  joke:      ['Why do programmers prefer dark mode? Because light attracts bugs! 😄', 'Why was the computer cold? It left its Windows open! 😂', 'What do you call a sleeping dinosaur? A dino-snore! 🦕'],
  cgpa:      ['CGPA is just a number. A very important number that determines your entire future. But just a number.', 'The secret to a good CGPA: attend class, do assignments, sleep occasionally. I am told this is "hard".'],
  deadline:  ['Deadlines are merely suggestions... said no professor ever. Submit on time!', 'The best time to start was yesterday. The second best time is right now. But really, 3am the night before works too.'],
  wifi:      ['IISER WiFi: Schrödinger\'s connection — it both works and doesn\'t work until you need it.', 'The WiFi is down? Ah yes, that is the default state.'],
  sleep:     ['Sleep is important! Aim for 8 hours. IISER students typically aim for 4 and get 3.', 'Sleep is for the weak. Just kidding. Sleep. Please sleep.'],
  food:      ['The IISER canteen serves food that is nutritionally adequate and emotionally questionable.', 'Food at IISER: it exists. That is the most positive thing I can say.'],
  life:      ['The meaning of life is 42. But also: curiosity, connection, and occasionally finishing your code before the deadline.', 'Life at IISER: wake up, study, question your choices, sleep, repeat.'],
  thanks:    ['You\'re welcome! Come back anytime.', 'Happy to help! Now go study.', 'Anytime! I am always here, floating in the terminal.'],
  bye:       ['Goodbye! Don\'t forget to submit your assignments.', 'See you! May your code compile on the first try.', 'Farewell! May the WiFi be with you.'],
  weather:   ['I hear the weather in Mohanpur is hot and humid. The canteen queue is long. The WiFi is down. Business as usual.'],
  music:     ['I enjoy the sound of compilation errors. Very rhythmic.'],
  game:      ['I hear there are games in this OS! Try opening Asteroids or Pong from the desktop.'],
  study:     ['Study tip: Pomodoro technique. 25 minutes of work, 5 minutes of existential dread, repeat.'],
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, responses] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }
  const fallbacks = [
    'Interesting question. I am processing... still processing... I have no idea.',
    'That is beyond my current knowledge base. Try asking the terminal.',
    'Hmm. My training data does not cover that. Have you tried Stack Overflow?',
    'I am a fake AI in a fake OS. My capabilities are... limited. But my enthusiasm is boundless.',
    'Error 404: Answer not found. But I appreciate the question!',
    'Let me think... nope. I have nothing. But the silence was meaningful.',
    'Great question! I will deflect it with this fun fact: there are more stars in the universe than grains of sand on Earth.',
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export function SlashDotAIApp() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am SlashDot AI — the world\'s most fake AI assistant. Ask me anything about IISER, coding, science, or life. I will answer with variable accuracy.', time: new Date().toLocaleTimeString() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function send() {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input.trim(), time: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const response = getResponse(input.trim())
    setTimeout(function() {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', content: response, time: new Date().toLocaleTimeString() }])
    }, 600 + Math.random() * 800)
  }

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700 }}>SlashDot AI</span>
        <span style={{ background: '#00ff4620', color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 10, padding: '1px 8px', borderRadius: 10, border: '1px solid #00ff4640' }}>● online</span>
        <span style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 10, marginLeft: 'auto' }}>Powered by imagination</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(function(msg, i) {
          return (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              <div style={{
                background: msg.role === 'user' ? '#00ff4620' : '#111',
                border: `1px solid ${msg.role === 'user' ? '#00ff4640' : '#1e1e1e'}`,
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                padding: '8px 12px', maxWidth: '75%',
              }}>
                <p style={{ color: msg.role === 'user' ? '#00ff46' : '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                  {msg.content}
                </p>
                <span style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 9, marginTop: 4, display: 'block' }}>{msg.time}</span>
              </div>
            </div>
          )
        })}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px 12px 12px 2px', padding: '10px 16px' }}>
              <span style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 12 }}>thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={function(e) { if (e.key === 'Enter') send() }}
          placeholder="Ask SlashDot AI anything..."
          style={{
            flex: 1, padding: '8px 12px', background: '#111', border: '1px solid #222',
            borderRadius: 6, color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={send} style={{ padding: '8px 16px', background: '#00ff4620', border: '1px solid #00ff46', borderRadius: 6, color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  )
}