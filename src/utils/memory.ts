const KEY = 'slashdot-os-memory'

interface OSMemory {
  name: string
  visits: number
  lastVisit: string
  theme: string
  commandCount: number
  firstVisit: string
}

export function loadMemory(): OSMemory | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as OSMemory
  } catch {
    return null
  }
}

export function saveMemory(data: Partial<OSMemory>) {
  try {
    const existing = loadMemory() ?? {
      name: '',
      visits: 0,
      lastVisit: '',
      theme: 'green',
      commandCount: 0,
      firstVisit: new Date().toLocaleDateString(),
    }
    const updated = { ...existing, ...data }
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {}
}

export function incrementVisit() {
  const mem = loadMemory()
  const visits = (mem?.visits ?? 0) + 1
  saveMemory({
    visits,
    lastVisit: new Date().toLocaleDateString(),
    firstVisit: mem?.firstVisit ?? new Date().toLocaleDateString(),
  })
  return visits
}

export function incrementCommandCount() {
  const mem = loadMemory()
  saveMemory({ commandCount: (mem?.commandCount ?? 0) + 1 })
}