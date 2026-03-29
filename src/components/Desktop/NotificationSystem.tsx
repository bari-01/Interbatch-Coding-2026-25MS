import { useState, useEffect } from 'react'

interface Toast {
  id: number
  message: string
  type: 'achievement' | 'info' | 'success' | 'error'
}

let toastId = 0

export function NotificationSystem() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(function() {
    const handler = function(e: Event) {
      const { message, type } = (e as CustomEvent).detail
      const id = ++toastId
      setToasts(prev => [...prev, { id, message, type: type ?? 'info' }])
      setTimeout(function() {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    }
    window.addEventListener('slashdot-notify', handler)
    return function() { window.removeEventListener('slashdot-notify', handler) }
  }, [])

  const colors: Record<string, string> = {
    achievement: '#ffd700',
    info:        '#00c8ff',
    success:     '#00ff46',
    error:       '#ff5050',
  }

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16,
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      gap: 8, pointerEvents: 'none',
    }}>
      {toasts.map(function(toast) {
        return (
          <div key={toast.id} style={{
            background: '#111',
            border: `1px solid ${colors[toast.type]}40`,
            borderLeft: `3px solid ${colors[toast.type]}`,
            borderRadius: 8,
            padding: '10px 16px',
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            color: colors[toast.type],
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            minWidth: 240,
            maxWidth: 320,
            animation: 'slideIn 0.2s ease-out',
          }}>
            {toast.type === 'achievement' && '🏆 '}
            {toast.message}
          </div>
        )
      })}
    </div>
  )
}