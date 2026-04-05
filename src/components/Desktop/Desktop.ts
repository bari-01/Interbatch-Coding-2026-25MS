import { h } from '../../../framework/render'
import { windowManager } from '../../store/windowManager'
import { AppId, WindowState } from '../../types'
import { toggleMute } from '../../utils/sounds'
import './Desktop.css'

interface DesktopIcon {
  appId: string
  title: string
  label: string
  icon: string
}

const ICONS: DesktopIcon[] = [
  { appId: 'terminal', title: 'terminal.sh', label: 'Terminal', icon: '>_' },
  { appId: 'home', title: 'home.exe', label: 'Home', icon: '⌂' },
  { appId: 'about', title: 'about.txt', label: 'About', icon: '📄' },
  { appId: 'team', title: 'team.db', label: 'Team', icon: '👥' },
  { appId: 'stack', title: 'stack.log', label: 'Tech Stack', icon: '⚙' },
  { appId: 'contact', title: 'contact.sh', label: 'Contact', icon: '@' },
  { appId: 'neofetch', title: 'neofetch', label: 'Neofetch', icon: '🖥' },
]

export function createDesktop() {
  let muted = false
  const timeState = { time: new Date() }

  // Icon buttons
  const iconsContainer = h('div', { className: 'desktop-icons' })
  ICONS.forEach(icon => {
    const btn = h('button', {
      className: 'desktop-icon',
      title: `Double-click to open ${icon.label}`
    },
      h('span', { className: 'desktop-icon-glyph' }, icon.icon),
      h('span', { className: 'desktop-icon-label' }, icon.label)
    )
    const activate = () => { windowManager.openWindow(icon.appId as AppId, icon.title) }
    btn.addEventListener('dblclick', activate)
    //btn.addEventListener('click', activate) // Fallback for single clicks
    iconsContainer.appendChild(btn)
  })

  // Taskbar parts
  const taskbarCenter = h('div', { className: 'taskbar-center' })
  const taskbarLogo = h('button', {
    className: 'taskbar-logo',
    title: 'Open Terminal',
    onClick: () => windowManager.openWindow('terminal', 'terminal.sh')
  },
    h('span', { className: 'taskbar-logo-text' }, 'SlashDot'),
    h('span', { className: 'taskbar-logo-badge' }, 'OS')
  )

  const muteBtn = h('button', {
    className: 'mute-btn',
    title: 'Mute sounds',
    onClick: () => {
      muted = toggleMute()
      muteBtn.className = `mute-btn ${muted ? 'muted' : ''}`
      muteBtn.title = muted ? 'Unmute sounds' : 'Mute sounds'
      muteBtn.textContent = muted ? '🔇' : '🔊'
    }
  }, '🔊')

  const timeSpan = h('span', { className: 'taskbar-time' })
  const dateSpan = h('span', { className: 'taskbar-date' })

  const updateTime = () => {
    timeState.time = new Date()
    timeSpan.textContent = timeState.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    dateSpan.textContent = timeState.time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }
  updateTime()
  const timer = setInterval(updateTime, 1000)

  const taskbar = h('div', { className: 'taskbar' },
    h('div', { className: 'taskbar-left' }, taskbarLogo),
    taskbarCenter,
    h('div', { className: 'taskbar-right' }, muteBtn, dateSpan, timeSpan)
  )

  const desktop = h('div', { className: 'desktop' },
    h('div', { className: 'scanlines' }),
    iconsContainer,
    taskbar
  )

  // Context Menu
  let contextMenuElement: HTMLElement | null = null

  const closeMenu = () => {
    if (contextMenuElement) {
      desktop.removeChild(contextMenuElement)
      contextMenuElement = null
    }
  }

  desktop.addEventListener('mousedown', (e: MouseEvent) => {
    if (contextMenuElement && !contextMenuElement.contains(e.target as Node)) {
      closeMenu()
    }
  })

  desktop.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault()
    closeMenu() // Close previous

    const handleMenuClick = (action: () => void) => {
      action()
      closeMenu()
    }

    const mkItem = (icon: string, text: string, action: () => void) =>
      h('button', { className: 'context-item', onClick: () => handleMenuClick(action) },
        h('span', { className: 'context-icon' }, icon), ` ${text}`
      )

    contextMenuElement = h('div', {
      id: 'context-menu',
      className: 'context-menu',
      style: { left: `${e.clientX}px`, top: `${e.clientY}px` }
    },
      h('div', { className: 'context-menu-header' }, 'SlashDot OS'),
      h('div', { className: 'context-divider' }),
      mkItem('>', 'Open Terminal', () => windowManager.openWindow('terminal', 'terminal.sh')),
      mkItem('⌂', 'Open Home', () => windowManager.openWindow('home', 'home.exe')),
      mkItem('📄', 'Open About', () => windowManager.openWindow('about', 'about.txt')),
      mkItem('👥', 'Open Team', () => windowManager.openWindow('team', 'team.db')),
      mkItem('⚙', 'Open Tech Stack', () => windowManager.openWindow('stack', 'stack.log')),
      mkItem('@', 'Open Contact', () => windowManager.openWindow('contact', 'contact.sh')),
      h('div', { className: 'context-divider' }),
      mkItem('🖥', 'Neofetch', () => windowManager.openWindow('neofetch', 'neofetch')),
      h('div', { className: 'context-divider' }),
      mkItem('↺', 'Refresh Desktop', () => window.location.reload()),
      mkItem('⛶', 'Fullscreen', () => {
        const el = document.documentElement
        if (el.requestFullscreen) el.requestFullscreen()
      }),
      h('div', { className: 'context-divider' }),
      h('div', { className: 'context-item disabled' }, h('span', { className: 'context-icon' }, 'ℹ'), ' SlashDot OS v2026.1'),
      h('div', { className: 'context-item disabled' }, h('span', { className: 'context-icon' }, '👤'), ' 25MS — IISER Kolkata')
    )
    desktop.appendChild(contextMenuElement)
  })

  // Subscribe to windowManager to update taskbar buttons
  const unsubscribe = windowManager.subscribe((windows) => {
    taskbarCenter.innerHTML = ''
    const minimized = windows.filter(w => w.isMinimized)
    const open = windows.filter(w => !w.isMinimized)

    open.forEach(w => {
      taskbarCenter.appendChild(h('button', {
        className: `taskbar-item ${w.isFocused ? 'active' : ''}`,
        onClick: () => windowManager.focusWindow(w.id)
      }, w.title))
    })

    minimized.forEach(w => {
      taskbarCenter.appendChild(h('button', {
        className: 'taskbar-item minimized',
        title: `Restore ${w.title}`,
        onClick: () => windowManager.openWindow(w.appId, w.title)
      }, w.title))
    })
  })

    // Cleanup mechanism
    ; (desktop as any)._cleanup = () => {
      clearInterval(timer)
      unsubscribe()
    }

  return desktop
}
