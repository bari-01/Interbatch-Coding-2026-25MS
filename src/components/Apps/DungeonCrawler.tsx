import { useState, useEffect, useCallback } from 'react'

const ROWS = 21
const COLS = 41
const CELL = 18

type Tile = 'wall' | 'floor' | 'door' | 'stairs'
type Dir = 'up' | 'down' | 'left' | 'right'

interface Pos { r: number; c: number }
interface Enemy { pos: Pos; hp: number; maxHp: number; symbol: string; name: string; alive: boolean }
interface Item { pos: Pos; type: 'health' | 'sword' | 'shield' | 'gold'; symbol: string }

interface GameState {
  map: Tile[][]
  player: Pos
  hp: number
  maxHp: number
  attack: number
  defense: number
  gold: number
  level: number
  enemies: Enemy[]
  items: Item[]
  log: string[]
  gameOver: boolean
  won: boolean
}

function generateMap(): { map: Tile[][]; playerStart: Pos; enemies: Enemy[]; items: Item[]; stairsPos: Pos } {
  const map: Tile[][] = Array.from({ length: ROWS }, () => Array(COLS).fill('wall' as Tile))

  const rooms: { r: number; c: number; h: number; w: number }[] = []

  function carveRoom(r: number, c: number, h: number, w: number) {
    for (let i = r; i < r + h; i++) {
      for (let j = c; j < c + w; j++) {
        if (i > 0 && i < ROWS - 1 && j > 0 && j < COLS - 1) map[i][j] = 'floor'
      }
    }
    rooms.push({ r, c, h, w })
  }

  function carveCorridor(r1: number, c1: number, r2: number, c2: number) {
    let r = r1; let c = c1
    while (c !== c2) { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) map[r][c] = 'floor'; c += c < c2 ? 1 : -1 }
    while (r !== r2) { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) map[r][c] = 'floor'; r += r < r2 ? 1 : -1 }
  }

  const roomDefs = [
    { r: 2, c: 2,  h: 5, w: 7 },
    { r: 2, c: 14, h: 4, w: 8 },
    { r: 2, c: 28, h: 5, w: 11 },
    { r: 10, c: 2, h: 6, w: 9 },
    { r: 10, c: 16, h: 5, w: 8 },
    { r: 10, c: 28, h: 6, w: 10 },
    { r: 14, c: 2, h: 5, w: 7 },
    { r: 15, c: 18, h: 4, w: 9 },
  ]

  roomDefs.forEach(rd => carveRoom(rd.r, rd.c, rd.h, rd.w))

  for (let i = 0; i < rooms.length - 1; i++) {
    const a = rooms[i]; const b = rooms[i + 1]
    carveCorridor(
      Math.floor(a.r + a.h / 2), Math.floor(a.c + a.w / 2),
      Math.floor(b.r + b.h / 2), Math.floor(b.c + b.w / 2)
    )
  }

  const playerStart: Pos = { r: 4, c: 5 }

  const stairsRoom = rooms[rooms.length - 1]
  const stairsPos: Pos = { r: stairsRoom.r + 1, c: stairsRoom.c + 1 }
  map[stairsPos.r][stairsPos.c] = 'stairs'

  const enemies: Enemy[] = [
    { pos: { r: 3, c: 16 }, hp: 6, maxHp: 6, symbol: 'g', name: 'Goblin', alive: true },
    { pos: { r: 12, c: 6 }, hp: 8, maxHp: 8, symbol: 'o', name: 'Orc', alive: true },
    { pos: { r: 12, c: 20 }, hp: 5, maxHp: 5, symbol: 's', name: 'Skeleton', alive: true },
    { pos: { r: 11, c: 30 }, hp: 10, maxHp: 10, symbol: 'T', name: 'Troll', alive: true },
    { pos: { r: 16, c: 4 }, hp: 7, maxHp: 7, symbol: 'r', name: 'Rat King', alive: true },
    { pos: { r: 16, c: 22 }, hp: 15, maxHp: 15, symbol: 'D', name: 'Dragon', alive: true },
  ]

  const items: Item[] = [
    { pos: { r: 3, c: 20 }, type: 'health', symbol: '♥' },
    { pos: { r: 11, c: 8 }, type: 'sword',  symbol: '⚔' },
    { pos: { r: 12, c: 30 }, type: 'shield', symbol: '🛡' },
    { pos: { r: 15, c: 4 }, type: 'health', symbol: '♥' },
    { pos: { r: 16, c: 24 }, type: 'gold', symbol: '$' },
    { pos: { r: 4, c: 30 }, type: 'health', symbol: '♥' },
  ]

  return { map, playerStart, enemies, items, stairsPos }
}

function initGame(level: number): GameState {
  const { map, playerStart, enemies, items } = generateMap()
  return {
    map, player: playerStart,
    hp: 20, maxHp: 20,
    attack: 4 + level, defense: 1 + Math.floor(level / 2),
    gold: 0, level,
    enemies, items,
    log: [`Floor ${level} — Find the stairs and descend!`, 'WASD or arrow keys to move.'],
    gameOver: false, won: false,
  }
}

export function DungeonCrawlerApp() {
  const [state, setState] = useState<GameState>(() => initGame(1))

  const isVisible = useCallback((state: GameState, r: number, c: number): boolean => {
    const dr = Math.abs(r - state.player.r)
    const dc = Math.abs(c - state.player.c)
    return dr <= 6 && dc <= 10
  }, [])

  const move = useCallback((dir: Dir) => {
    setState(prev => {
      if (prev.gameOver || prev.won) return prev
      const { player, map, enemies, items } = prev
      const delta: Record<Dir, Pos> = { up: { r: -1, c: 0 }, down: { r: 1, c: 0 }, left: { r: 0, c: -1 }, right: { r: 0, c: 1 } }
      const d = delta[dir]
      const nr = player.r + d.r
      const nc = player.c + d.c

      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev
      if (map[nr][nc] === 'wall') return prev

      const newLog = [...prev.log]

      const enemy = enemies.find(e => e.alive && e.pos.r === nr && e.pos.c === nc)
      if (enemy) {
        const dmg = Math.max(1, prev.attack - 0)
        const newEnemies = enemies.map(e => {
          if (e !== enemy) return e
          const newHp = e.hp - dmg
          if (newHp <= 0) newLog.push(`You killed the ${e.name}! (+${e.maxHp} XP)`)
          else newLog.push(`You hit ${e.name} for ${dmg} damage! (${newHp}/${e.maxHp} HP)`)
          return { ...e, hp: newHp, alive: newHp > 0 }
        })

        const enemyDmg = Math.max(1, enemy.hp > 0 ? Math.floor(enemy.maxHp / 5) - prev.defense : 0)
        const newHp = enemy.hp > 0 ? prev.hp - enemyDmg : prev.hp
        if (enemyDmg > 0 && enemy.hp > 0) newLog.push(`${enemy.name} hits you for ${enemyDmg}!`)

        return {
          ...prev,
          enemies: newEnemies,
          hp: newHp,
          gameOver: newHp <= 0,
          log: newLog.slice(-6),
        }
      }

      let newHp = prev.hp
      let newAttack = prev.attack
      let newDefense = prev.defense
      let newGold = prev.gold
      let newMaxHp = prev.maxHp
      const newItems = items.filter(item => {
        if (item.pos.r === nr && item.pos.c === nc) {
          if (item.type === 'health') { newHp = Math.min(newMaxHp, newHp + 8); newLog.push('Found a health potion! (+8 HP)') }
          if (item.type === 'sword')  { newAttack += 3; newLog.push('Found a sword! (+3 attack)') }
          if (item.type === 'shield') { newDefense += 2; newLog.push('Found a shield! (+2 defense)') }
          if (item.type === 'gold')   { newGold += 10; newLog.push('Found 10 gold!') }
          return false
        }
        return true
      })

      const won = map[nr][nc] === 'stairs'
      if (won) newLog.push(`Descended to floor ${prev.level + 1}!`)

      const enemyMoves = enemies.map(e => {
        if (!e.alive) return e
        const dr = Math.sign(nr - e.pos.r)
        const dc = Math.sign(nc - e.pos.c)
        const er = e.pos.r + dr
        const ec = e.pos.c + dc
        if (map[er]?.[ec] === 'floor' || map[er]?.[ec] === 'stairs') {
          return { ...e, pos: { r: er, c: ec } }
        }
        return e
      })

      return {
        ...prev,
        player: { r: nr, c: nc },
        hp: newHp,
        maxHp: newMaxHp,
        attack: newAttack,
        defense: newDefense,
        gold: newGold,
        items: newItems,
        enemies: enemyMoves,
        won,
        log: newLog.slice(-6),
      }
    })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp')    { e.preventDefault(); move('up') }
      if (e.key === 's' || e.key === 'ArrowDown')  { e.preventDefault(); move('down') }
      if (e.key === 'a' || e.key === 'ArrowLeft')  { e.preventDefault(); move('left') }
      if (e.key === 'd' || e.key === 'ArrowRight') { e.preventDefault(); move('right') }
      if (e.key === 'r' || e.key === 'R') setState(initGame(1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  useEffect(() => {
    if (state.won) {
      setTimeout(() => setState(initGame(state.level + 1)), 1000)
    }
  }, [state.won, state.level])

  const TILE_COLORS: Record<Tile, string> = {
    wall:   '#111',
    floor:  '#1a1a1a',
    door:   '#8B4513',
    stairs: '#ffd700',
  }

  const TILE_CHARS: Record<Tile, string> = {
    wall:   '█',
    floor:  '·',
    door:   '+',
    stairs: '▼',
  }

  const hpPct = state.hp / state.maxHp
  const hpColor = hpPct > 0.6 ? '#00ff46' : hpPct > 0.3 ? '#ffd700' : '#ff5050'

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'JetBrains Mono, monospace' }}>

      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 20, alignItems: 'center', fontSize: 12 }}>
        <span style={{ color: '#ffd700', fontWeight: 700 }}>⚔ Dungeon — Floor {state.level}</span>
        <span style={{ color: hpColor }}>♥ {state.hp}/{state.maxHp}</span>
        <span style={{ color: '#ff8800' }}>⚔ ATK {state.attack}</span>
        <span style={{ color: '#00c8ff' }}>🛡 DEF {state.defense}</span>
        <span style={{ color: '#ffd700' }}>$ {state.gold}</span>
        <button onClick={() => setState(initGame(1))} style={{ marginLeft: 'auto', padding: '2px 10px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontSize: 11, cursor: 'pointer' }}>↺ Restart</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {state.gameOver ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ff5050', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>☠ You Died</p>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>Floor {state.level} • Gold: {state.gold}</p>
              <button onClick={() => setState(initGame(1))} style={{ padding: '8px 20px', background: '#ff505020', border: '1px solid #ff5050', borderRadius: 6, color: '#ff5050', fontFamily: 'JetBrains Mono', fontSize: 13, cursor: 'pointer' }}>Try Again</button>
            </div>
          ) : (
            <div style={{ lineHeight: 1, fontSize: CELL - 4 }}>
              {state.map.map((row, r) => (
                <div key={r} style={{ display: 'flex' }}>
                  {row.map((tile, c) => {
                    const visible = isVisible(state, r, c)
                    const isPlayer = state.player.r === r && state.player.c === c
                    const enemy = state.enemies.find(e => e.alive && e.pos.r === r && e.pos.c === c)
                    const item = state.items.find(i => i.pos.r === r && i.pos.c === c)

                    if (!visible) {
                      return <span key={c} style={{ width: CELL, height: CELL, display: 'inline-block', color: '#050505', background: '#050505' }}>█</span>
                    }

                    let char = TILE_CHARS[tile]
                    let color = tile === 'wall' ? '#222' : '#2a2a2a'
                    let bg = TILE_COLORS[tile]

                    if (isPlayer) { char = '@'; color = '#ffd700'; bg = '#1a1a1a' }
                    else if (enemy) { char = enemy.symbol; color = '#ff5050'; bg = '#1a0000' }
                    else if (item) { char = item.symbol; color = item.type === 'health' ? '#ff5050' : item.type === 'gold' ? '#ffd700' : '#00c8ff'; bg = '#0d0d0d' }
                    else if (tile === 'stairs') { char = '▼'; color = '#ffd700'; bg = '#1a1500' }

                    return (
                      <span key={c} style={{ width: CELL, height: CELL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, background: bg, fontSize: CELL - 6, fontWeight: isPlayer || !!enemy ? 700 : 400 }}>
                        {char}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 180, borderLeft: '1px solid #1e1e1e', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, overflowY: 'auto' }}>
          <p style={{ color: '#555', marginBottom: 4 }}>── Log ──</p>
          {state.log.slice().reverse().map((l, i) => (
            <p key={i} style={{ color: i === 0 ? '#aaa' : '#444', margin: 0, lineHeight: 1.5 }}>{l}</p>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <p style={{ color: '#555', marginBottom: 6 }}>── Controls ──</p>
            <p style={{ color: '#333', margin: 0 }}>WASD / ↑↓←→ move</p>
            <p style={{ color: '#333', margin: 0 }}>Bump enemy to attack</p>
            <p style={{ color: '#333', margin: 0 }}>▼ = stairs (next floor)</p>
            <p style={{ color: '#333', margin: 0 }}>R = restart</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 20, fontSize: 10, color: '#333' }}>
        <span style={{ color: '#ffd700' }}>@ you</span>
        <span style={{ color: '#ff5050' }}>g o s T r D enemies</span>
        <span style={{ color: '#ff5050' }}>♥ health</span>
        <span style={{ color: '#00c8ff' }}>⚔ sword  🛡 shield</span>
        <span style={{ color: '#ffd700' }}>$ gold  ▼ stairs</span>
      </div>
    </div>
  )
}