import { useState } from 'react'

interface PollOption {
  label: string
  votes: number
}

interface PollData {
  question: string
  options: PollOption[]
}

const POLLS: PollData[] = [
  {
    question: 'Which is the best programming language?',
    options: [
      { label: 'Python', votes: 42 },
      { label: 'JavaScript', votes: 38 },
      { label: 'C++', votes: 21 },
      { label: 'Rust', votes: 15 },
      { label: 'Java', votes: 8 },
    ],
  },
  {
    question: 'Favourite part of IISER?',
    options: [
      { label: 'The research', votes: 55 },
      { label: 'The friends', votes: 89 },
      { label: 'The canteen food', votes: 12 },
      { label: 'The WiFi', votes: 3 },
      { label: 'Nothing lol', votes: 44 },
    ],
  },
  {
    question: 'Best time to code?',
    options: [
      { label: '12am - 3am', votes: 67 },
      { label: '3am - 6am', votes: 23 },
      { label: 'Morning', votes: 11 },
      { label: 'Afternoon', votes: 8 },
      { label: 'Whenever deadline hits', votes: 99 },
    ],
  },
]

export function PollApp() {
  const [polls, setPolls] = useState<PollData[]>(POLLS)
  const [voted, setVoted] = useState<Record<string, number>>({})
  const [activePoll, setActivePoll] = useState(0)

  const poll = polls[activePoll]
  const totalVotes = poll.options.reduce(function(a, o) { return a + o.votes }, 0)
  const hasVoted = voted[String(activePoll)] !== undefined

  function vote(optIdx: number) {
    if (hasVoted) return
    setPolls(prev => prev.map(function(p, pi) {
      if (pi !== activePoll) return p
      return {
        ...p,
        options: p.options.map(function(o, oi) {
          return oi === optIdx ? { ...o, votes: o.votes + 1 } : o
        }),
      }
    }))
    setVoted(prev => ({ ...prev, [String(activePoll)]: optIdx }))
  }

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// poll.app — Community Voting</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {polls.map(function(p, i) {
          return (
            <button key={i} onClick={function() { setActivePoll(i) }}
              style={{
                padding: '4px 12px', background: activePoll === i ? '#00c8ff20' : 'transparent',
                border: `1px solid ${activePoll === i ? '#00c8ff' : '#333'}`,
                borderRadius: 4, color: activePoll === i ? '#00c8ff' : '#666',
                fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer',
              }}>
              Poll {i + 1}
            </button>
          )
        })}
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '16px' }}>
        <p style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
          {poll.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {poll.options.map(function(opt, i) {
            const pct = totalVotes > 0 ? Math.round(opt.votes / totalVotes * 100) : 0
            const isVoted = voted[String(activePoll)] === i
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <button
                    onClick={function() { vote(i) }}
                    disabled={hasVoted}
                    style={{
                      background: 'transparent', border: 'none', cursor: hasVoted ? 'default' : 'pointer',
                      color: isVoted ? '#00ff46' : '#aaa', fontFamily: 'JetBrains Mono', fontSize: 12,
                      textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <span style={{ color: isVoted ? '#00ff46' : '#333', fontSize: 14 }}>{isVoted ? '●' : '○'}</span>
                    {opt.label}
                  </button>
                  {hasVoted && <span style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{opt.votes} ({pct}%)</span>}
                </div>
                {hasVoted && (
                  <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pct + '%', background: isVoted ? '#00ff46' : '#00c8ff', borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!hasVoted && <p style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 11, marginTop: 12 }}>Click an option to vote</p>}
        {hasVoted && <p style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 11, marginTop: 12 }}>Total votes: {totalVotes + 1}</p>}
      </div>
    </div>
  )
}