import { useState, useEffect } from 'react'
import './Apps.css'
import { teamMembers } from '../../data/team'
import { techStack } from '../../data/techStack'

export function HomeApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// home.exe — SlashDot Club</p>
      <div className="app-divider" />

      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <img src="./slashdot_logo.png" alt="SlashDot" style={{ width: 80, marginBottom: 12, opacity: 0.9 }} />
        <p style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.1em' }}>SLASHDOT</p>
        <p style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 11, margin: 0 }}>The Coding & Designing Club of IISER Kolkata</p>
      </div>

      <div className="app-divider" />
      <p className="app-label yellow">// navigate</p>
      <div className="app-commands">
        {[
          ['open about',     'About the club'],
          ['open team',      'Meet the team'],
          ['open stack',     'Our tech stack'],
          ['open contact',   'Contact us'],
          ['open showcase',  'Club projects (coming soon)'],
          ['open events',    'Club events (coming soon)'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>

      <div className="app-divider" />
      <p className="app-label yellow">// quick links</p>
      <div className="app-commands">
        {[
          ['GitHub',   'github.com/slashdot-iiserk'],
          ['Website',  'slashdot-iiserk.github.io'],
          ['Email',    'slashdot@iiserkol.ac.in'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AboutApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// about.txt — About SlashDot</p>
      <div className="app-divider" />

      <p style={{ color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: 1.8 }}>
        Hola! You've stepped into the cynosure for the perks of cool coding skills.
        SlashDot is the official coding and designing club of the Indian Institute of
        Science Education and Research (IISER) Kolkata.
      </p>

      <p style={{ color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
        Simplicity is the soul of efficiency. Our club loves to explore every nook and
        corner of the modern day coding world — learning how to think out of the box,
        starting from scratch. We cover programming, design, web development, competitive
        coding, open source, and everything in between.
      </p>

      <div className="app-divider" />
      <p className="app-label yellow">// what we do</p>
      <div className="app-commands">
        {[
          ['Workshops',        'Regular coding and design workshops'],
          ['Competitions',     'Inter-batch and external competitions'],
          ['Projects',         'Open source and club projects'],
          ['Showcases',        'Highlighting member projects'],
          ['Events',           'Hackathons, talks, and more'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>

      <div className="app-divider" />
      <p className="app-label yellow">// this website</p>
      <p style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, lineHeight: 1.7 }}>
        SlashDot OS is the official website of the SlashDot Club, built by the 25MS batch
        as an entry for the Inter-Batch Website Development Competition 2026.
        It is designed to serve as the club's future website — browse using the terminal
        or click the desktop icons to explore.
      </p>
    </div>
  )
}

export function TeamApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// team.db — 25MS Batch</p>
      <h2 className="app-heading">The Crew</h2>
      <div className="team-grid">
        {teamMembers.map(function(member, index) {
          return (
            <div key={index} className="team-card">
              
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
              <p
                className="team-github"
                onClick={function() {
                  if (member.github) {
                    window.open('https://github.com/' + member.github, '_blank')
                  }
                }}
                style={{ cursor: member.github ? 'pointer' : 'default' }}
              >
                {member.github ? '@' + member.github : ''}
              </p>
              <p className="team-fact">{'fun fact: ' + member.fun_fact}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TechStackApp() {
  const categories = ['frontend', 'language', 'library', 'tooling'] as const
  return (
    <div className="app-body">
      <p className="app-label cyan">// stack.log</p>
      <h2 className="app-heading">Tech Stack</h2>
      {categories.map(function(cat) {
        const items = techStack.filter(function(t) { return t.category === cat })
        return (
          <div key={cat} className="app-section">
            <p className="app-label yellow">{'// ' + cat}</p>
            <div className="stack-list">
              {items.map(function(t) {
                return (
                  <div key={t.name} className="stack-item">
                    <span className="stack-name">{t.name + (t.version ? ' v' + t.version : '')}</span>
                    <span className="stack-desc">{t.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="app-divider" />
      <p className="app-label cyan">// deployment</p>
      <p className="app-text">
        Pure static frontend — no backend required. Built with Vite, deployed via
        GitHub Pages using GitHub Actions CI/CD. Zero configuration needed to run.
      </p>
    </div>
  )
}

export function ContactApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// contact.sh — Get in Touch</p>
      <div className="app-divider" />
      <p className="app-label yellow">// club contact</p>
      <div className="app-commands">
        {[
          ['Email',     'slashdot@iiserkol.ac.in'],
          ['GitHub',    'github.com/slashdot-iiserk'],
          ['Website',   'slashdot-iiserk.github.io'],
          ['Institute', 'IISER Kolkata, Mohanpur, WB 741246'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>

      <div className="app-divider" />
      <p className="app-label yellow">// developer contact</p>
      <div className="app-commands">
        {[
          ['Sankhadeep Bera', 'sb25ms227@iiserkol.ac.in'],
          ['S. Bari',         'shayan.bari.0001@gmail.com'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function NeofetchApp() {
  const info = [
    ['OS',       'SlashDot OS 2026 — IISER Kolkata'],
    ['Club',     'SlashDot — Coding & Design Club'],
    ['Website',  'slashdot-iiserk.github.io'],
    ['GitHub',   'github.com/slashdot-iiserk'],
    ['Batch', '25MS — IISER Kolkata'],
    ['Club', 'SlashDot Programming & Design Club'],
    ['Shell', 'slashdot-sh 2026'],
    ['Terminal', 'xterm.js v5.5'],
    ['Theme', 'Terminal Green on Void Black'],
    ['CPU', 'Brain @ 3.0GHz (caffeine-cooled)'],
    ['Memory', '8GB (4GB used by browser tabs)'],
    ['Uptime', 'Since March 22, 2026'],
    ['Deadline', 'April 11, 2026'],
  ]
  const colors = ['#1a1a1a', '#ff5050', '#00ff46', '#ffd700', '#00c8ff', '#c864ff', '#00d4d4', '#e0e0e0']
  const asciiLines = [
    '     ___   ___  ',
    '    /  _| /   \\ ',
    '    \\  \\  | . | ',
    '    _\\  \\ |   | ',
    '   /____/ \\___/ ',
    '   SlashDot OS  ',
    '   -------------',
    '   25MS  Batch  ',
  ]
  return (
    <div className="app-body neofetch">
      <div className="neofetch-layout">
        <pre className="neofetch-art green">
          {asciiLines.join('\n')}
        </pre>
        <div className="neofetch-info">
          <p className="neofetch-user cyan">
            {'slashdot'}
            <span className="gray">{'@'}</span>
            <span className="yellow blink">{'25ms-os'}</span>
          </p>
          <p className="neofetch-iiser blink-green">IISER KOLKATA</p>
          <p className="neofetch-sep gray">{'─'.repeat(22)}</p>
          {info.map(function(item) {
            return (
              <p key={item[0]} className="neofetch-row">
                <span className="neofetch-key cyan">{item[0]}</span>
                <span className="gray">{': '}</span>
                <span className="neofetch-val">{item[1]}</span>
              </p>
            )
          })}
          <br />
          <div className="neofetch-colors">
            {colors.map(function(col) {
              return <span key={col} className="color-block" style={{ background: col }} />
            })}
          </div>
        </div>
      </div>
      <div className="app-divider" />
      <div className="app-logos">
        <div className="logo-placeholder">
          <img src="./iiserkol_logo.png" alt="IISER Kolkata" className="logo-img" />
        </div>
        <div className="logo-placeholder">
          <img src="./slashdot_logo.png" alt="SlashDot" className="logo-img" />
        </div>
      </div>
    </div>
  )
}
export function ClockApp() {
  const [time, setTime] = useState(new Date())

  useEffect(function() {
    const t = setInterval(function() { setTime(new Date()) }, 1000)
    return function() { clearInterval(t) }
  }, [])

  const hours   = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  const date    = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const progress = (time.getSeconds() / 60) * 100

  return (
    <div className="app-body clock-app" style={{ background: '#0a0a0a', color: '#d0d0d0' }}>
      <p className="app-label cyan">// clock.app</p>
      <div className="clock-display">
        <span className="clock-hours">{hours}</span>
        <span className="clock-colon">:</span>
        <span className="clock-minutes">{minutes}</span>
        <span className="clock-colon">:</span>
        <span className="clock-seconds">{seconds}</span>
      </div>
      <div className="clock-progress">
        <div className="clock-progress-fill" style={{ width: progress + '%' }} />
      </div>
      <p className="clock-date">{date}</p>
      <div className="app-divider" />
      <div className="clock-stats">
        {[
          ['Timezone',  Intl.DateTimeFormat().resolvedOptions().timeZone],
          ['Unix time', String(Math.floor(time.getTime() / 1000))],
          ['Day of year', String(Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000))],
          ['Week',      String(Math.ceil((time.getDate() + new Date(time.getFullYear(), time.getMonth(), 1).getDay()) / 7))],
          ['Deadline',  'April 11, 2026 — Submit now!'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}