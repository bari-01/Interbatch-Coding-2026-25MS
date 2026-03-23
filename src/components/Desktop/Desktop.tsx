import { useState, useEffect } from 'react'
import { AppId, WindowState } from '../../types'
import './Desktop.css'

interface DesktopIcon {
  appId: AppId
  title: string
  label: string
  icon: string
}

const ICONS: DesktopIcon[] = [
  { appId: 'terminal', title: 'terminal.sh',  label: 'Terminal',   icon: '>_' },
  { appId: 'home',     title: 'home.exe',     label: 'Home',       icon: '⌂'  },
  { appId: 'about',    title: 'about.txt',    label: 'About',      icon: '📄' },
  { appId: 'team',     title: 'team.db',      label: 'Team',       icon: '👥' },
  { appId: 'stack',    title: 'stack.log',    label: 'Tech Stack', icon: '⚙'  },
  { appId: 'contact',  title: 'contact.sh',   label: 'Contact',    icon: '@'  },
  { appId: 'neofetch', title: 'neofetch',     label: 'Neofetch',   icon: '🖥' },
]

interface Props {
  windows: WindowState[]
  onOpenWindow: (appId: AppId, title: string) => void
  onFocusWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
}

export function Desktop({ windows, onOpenWindow, onFocusWindow, onRestoreWindow }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  const minimized = windows.filter(w => w.isMinimized)
  const open = windows.filter(w => !w.isMinimized)

  return (
    <div className="desktop">
      <div className="scanlines" />

      <div className="desktop-icons">
        {ICONS.map(icon => (
          <button
            key={icon.appId}
            className="desktop-icon"
            onDoubleClick={() => onOpenWindow(icon.appId, icon.title)}
            title={`Double-click to open ${icon.label}`}
          >
            <span className="desktop-icon-glyph">{icon.icon}</span>
            <span className="desktop-icon-label">{icon.label}</span>
          </button>
        ))}
      </div>

      <div className="taskbar">
        <div className="taskbar-left">
          <button
            className="taskbar-logo"
            onClick={() => onOpenWindow('terminal', 'terminal.sh')}
            title="Open Terminal"
          >
            <span className="taskbar-logo-text">SlashDot</span>
            <span className="taskbar-logo-badge">OS</span>
          </button>
        </div>

        <div className="taskbar-center">
          {open.map(w => (
            <button
              key={w.id}
              className={`taskbar-item ${w.isFocused ? 'active' : ''}`}
              onClick={() => onFocusWindow(w.id)}
            >
              {w.title}
            </button>
          ))}
          {minimized.map(w => (
            <button
              key={w.id}
              className="taskbar-item minimized"
              onClick={() => onRestoreWindow(w.id)}
              title={`Restore ${w.title}`}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className="taskbar-right">
          <span className="taskbar-date">{dateStr}</span>
          <span className="taskbar-time">{timeStr}</span>
        </div>
      </div>
    </div>
  )
}