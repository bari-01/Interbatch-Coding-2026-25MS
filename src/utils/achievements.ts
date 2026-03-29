const unlocked: Record<string, string> = {}

export function unlock(id: string) {
  if (unlocked[id]) return
  unlocked[id] = new Date().toLocaleTimeString()
  ;(window as any).__slashdotAchievements = unlocked
  window.dispatchEvent(new CustomEvent('slashdot-achievement', { detail: { id } }))
  window.dispatchEvent(new CustomEvent('slashdot-notify', {
    detail: { message: `Achievement unlocked: ${id.replace(/_/g, ' ')}!`, type: 'achievement' }
  }))
}

export function unlockOnce(id: string) { unlock(id) }