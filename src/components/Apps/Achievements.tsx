import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const ACHIEVEMENT_DEFS = [
  { id: 'first_boot',    title: 'First Boot',         description: 'Welcome to SlashDot OS!',                    icon: '🚀' },
  { id: 'help',         title: 'RTFM',               description: "Typed 'help' — a good start.",               icon: '📖' },
  { id: 'neofetch',     title: 'Flex Mode',           description: "Ran neofetch. Very aesthetic.",              icon: '🖥' },
  { id: 'sudo_party',   title: 'Party Animal',        description: "sudo party — you know how to celebrate.",    icon: '🎉' },
  { id: 'matrix',       title: 'Chosen One',          description: 'Entered the Matrix.',                        icon: '🟩' },
  { id: 'ssh',          title: 'Network Wizard',      description: 'SSH-ed into IISER. Impressive.',             icon: '🔐' },
  { id: 'apt',          title: 'Package Manager',     description: 'apt install something.',                     icon: '📦' },
  { id: 'vim',          title: 'Vim Survivor',        description: 'Opened vim. Did you exit?',                  icon: '✍' },
  { id: 'git',          title: 'Version Control',     description: 'Used a git command.',                        icon: '🌿' },
  { id: 'panic',        title: 'Blue Screen',         description: 'Triggered a kernel panic.',                  icon: '💙' },
  { id: 'sandwich',     title: 'xkcd Fan',            description: 'sudo make me a sandwich.',                   icon: '🥪' },
  { id: 'marks',        title: 'Academic Weapon',     description: 'Gave yourself perfect marks.',               icon: '📊' },
  { id: 'weather',      title: 'Meteorologist',       description: 'Checked the campus weather.',                icon: '🌤' },
  { id: 'top',          title: 'System Monitor',      description: "Ran top — noticed exam-stress.exe.",         icon: '📈' },
  { id: 'asteroids',    title: 'Space Cadet',         description: 'Opened Asteroids.',                          icon: '🚀' },
  { id: 'pong',         title: 'Ping Pong',           description: 'Opened Pong.',                               icon: '🏓' },
  { id: 'periodic',     title: 'Chemist',             description: 'Opened the periodic table.',                 icon: '⚗' },
  { id: 'gravity',      title: 'Astrophysicist',      description: 'Simulated gravity.',                         icon: '🪐' },
  { id: 'dna',          title: 'Biologist',           description: 'Viewed a DNA sequence.',                     icon: '🧬' },
  { id: 'slashdotai',   title: 'AI Whisperer',        description: 'Chatted with SlashDot AI.',                  icon: '🤖' },
  { id: 'guestbook',    title: 'Signed In',           description: 'Signed the guestbook.',                      icon: '📖' },
  { id: 'typing',       title: 'Speed Typist',        description: 'Took the typing speed test.',                icon: '⌨' },
  { id: 'gameoflife',   title: 'Game of Life',        description: "Conway would be proud.",                     icon: '🔲' },
  { id: 'all_science',  title: 'IISER Student',       description: 'Opened all science apps.',                   icon: '🎓' },
  { id: 'dark_side',    title: 'Dark Mode Forever',   description: 'SlashDot OS is always dark. As it should be.',icon: '🌑' },
]

function loadAchievements(): Achievement[] {
  const saved = (window as any).__slashdotAchievements ?? {}
  return ACHIEVEMENT_DEFS.map(function(def) {
    return {
      ...def,
      unlocked: !!saved[def.id],
      unlockedAt: saved[def.id] || undefined,
    }
  })
}

export function AchievementsApp() {
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements)
  const unlocked = achievements.filter(a => a.unlocked)
  const locked = achievements.filter(a => !a.unlocked)

  useEffect(function() {
    const handler = function() { setAchievements(loadAchievements()) }
    window.addEventListener('slashdot-achievement', handler)
    return function() { window.removeEventListener('slashdot-achievement', handler) }
  }, [])

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// achievements.app</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700 }}>{unlocked.length}</div>
          <div style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 10 }}>Unlocked</div>
        </div>
        <div style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700 }}>{locked.length}</div>
          <div style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 10 }}>Locked</div>
        </div>
        <div style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700 }}>
            {Math.round(unlocked.length / achievements.length * 100)}%
          </div>
          <div style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 10 }}>Complete</div>
        </div>
      </div>

      <div style={{ height: 6, background: '#111', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: '100%', width: `${unlocked.length / achievements.length * 100}%`, background: '#ffd700', borderRadius: 3, transition: 'width 0.4s' }} />
      </div>

      <p className="app-label yellow">// unlocked ({unlocked.length})</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {unlocked.map(function(a) {
          return (
            <div key={a.id} style={{ background: '#111', border: '1px solid #ffd70030', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <div>
                <p style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, margin: '0 0 2px' }}>{a.title}</p>
                <p style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 10, margin: 0 }}>{a.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="app-label yellow">// locked ({locked.length})</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {locked.map(function(a) {
          return (
            <div key={a.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start', opacity: 0.5 }}>
              <span style={{ fontSize: 20, filter: 'grayscale(1)' }}>{a.icon}</span>
              <div>
                <p style={{ color: '#444', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, margin: '0 0 2px' }}>???</p>
                <p style={{ color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10, margin: 0 }}>Keep exploring...</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}