import { useState, useEffect, useRef } from 'react'
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

interface ContextMenu {
  x: number
  y: number
}

interface Props {
  windows: WindowState[]
  onOpenWindow: (appId: AppId, title: string) => void
  onFocusWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
}

export function Desktop({ windows, onOpenWindow, onFocusWindow, onRestoreWindow }: Props) {
  const [time, setTime] = useState(new Date())
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Close context menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleMenuClick = (action: () => void) => {
    action()
    setContextMenu(null)
  }

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  const minimized = windows.filter(w => w.isMinimized)
  const open = windows.filter(w => !w.isMinimized)

  return (
    <div className="desktop" onContextMenu={handleRightClick}>
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

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="context-menu-header">SlashDot OS</div>
          <div className="context-divider" />

          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('terminal', 'terminal.sh'))}>
            <span className="context-icon">&gt;_</span> Open Terminal
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('home', 'home.exe'))}>
            <span className="context-icon">⌂</span> Open Home
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('about', 'about.txt'))}>
            <span className="context-icon">📄</span> Open About
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('team', 'team.db'))}>
            <span className="context-icon">👥</span> Open Team
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('stack', 'stack.log'))}>
            <span className="context-icon">⚙</span> Open Tech Stack
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('contact', 'contact.sh'))}>
            <span className="context-icon">@</span> Open Contact
          </button>

          <div className="context-divider" />

          <button className="context-item" onClick={() => handleMenuClick(() => onOpenWindow('neofetch', 'neofetch'))}>
            <span className="context-icon">🖥</span> Neofetch
          </button>

          <div className="context-divider" />

          <button className="context-item" onClick={() => handleMenuClick(() => window.location.reload())}>
            <span className="context-icon">↺</span> Refresh Desktop
          </button>
          <button className="context-item" onClick={() => handleMenuClick(() => {
            const el = document.documentElement
            if (el.requestFullscreen) el.requestFullscreen()
          })}>
            <span className="context-icon">⛶</span> Fullscreen
          </button>

          <div className="context-divider" />

          <div className="context-item disabled">
            <span className="context-icon">ℹ</span> SlashDot OS v2026.1
          </div>
          <div className="context-item disabled">
            <span className="context-icon">👤</span> 25MS — IISER Kolkata
          </div>
        </div>
      )}

      {/* Taskbar */}
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