import { useEffect, useRef, useState } from 'react'

interface Atom {
  symbol: string
  x: number; y: number; z: number
  color: string
  radius: number
}

interface Bond {
  from: number; to: number
}

interface Molecule {
  name: string
  formula: string
  description: string
  atoms: Atom[]
  bonds: Bond[]
}

const MOLECULES: Record<string, Molecule> = {
  H2O: {
    name: 'Water', formula: 'H₂O',
    description: 'The molecule of life. Bent shape due to lone pairs on oxygen.',
    atoms: [
      { symbol: 'O', x: 0,    y: 0,   z: 0, color: '#ff5050', radius: 16 },
      { symbol: 'H', x: -60,  y: 50,  z: 0, color: '#ffffff', radius: 10 },
      { symbol: 'H', x:  60,  y: 50,  z: 0, color: '#ffffff', radius: 10 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
  },
  CO2: {
    name: 'Carbon Dioxide', formula: 'CO₂',
    description: 'Linear molecule. Main greenhouse gas. Product of combustion.',
    atoms: [
      { symbol: 'C', x: 0,    y: 0, z: 0, color: '#888888', radius: 14 },
      { symbol: 'O', x: -90,  y: 0, z: 0, color: '#ff5050', radius: 16 },
      { symbol: 'O', x:  90,  y: 0, z: 0, color: '#ff5050', radius: 16 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
  },
  CH4: {
    name: 'Methane', formula: 'CH₄',
    description: 'Simplest hydrocarbon. Tetrahedral geometry. Natural gas component.',
    atoms: [
      { symbol: 'C', x: 0,   y: 0,   z: 0,  color: '#888888', radius: 14 },
      { symbol: 'H', x: -70, y: -70, z: 0,  color: '#ffffff', radius: 10 },
      { symbol: 'H', x:  70, y: -70, z: 0,  color: '#ffffff', radius: 10 },
      { symbol: 'H', x: -70, y:  70, z: 0,  color: '#ffffff', radius: 10 },
      { symbol: 'H', x:  70, y:  70, z: 0,  color: '#ffffff', radius: 10 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }],
  },
  NH3: {
    name: 'Ammonia', formula: 'NH₃',
    description: 'Trigonal pyramidal. Basic substance. Used in fertilizers.',
    atoms: [
      { symbol: 'N', x: 0,   y: 0,   z: 0, color: '#4488ff', radius: 15 },
      { symbol: 'H', x: -70, y: 60,  z: 0, color: '#ffffff', radius: 10 },
      { symbol: 'H', x:  70, y: 60,  z: 0, color: '#ffffff', radius: 10 },
      { symbol: 'H', x: 0,   y: -80, z: 0, color: '#ffffff', radius: 10 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
  },
  NaCl: {
    name: 'Sodium Chloride', formula: 'NaCl',
    description: 'Table salt. Ionic compound. Essential electrolyte.',
    atoms: [
      { symbol: 'Na', x: -60, y: 0, z: 0, color: '#ffd700', radius: 18 },
      { symbol: 'Cl', x:  60, y: 0, z: 0, color: '#00ff46', radius: 20 },
    ],
    bonds: [{ from: 0, to: 1 }],
  },
  O2: {
    name: 'Oxygen', formula: 'O₂',
    description: 'Diatomic oxygen. Essential for aerobic respiration.',
    atoms: [
      { symbol: 'O', x: -50, y: 0, z: 0, color: '#ff5050', radius: 16 },
      { symbol: 'O', x:  50, y: 0, z: 0, color: '#ff5050', radius: 16 },
    ],
    bonds: [{ from: 0, to: 1 }],
  },
  C6H6: {
    name: 'Benzene', formula: 'C₆H₆',
    description: 'Aromatic ring. Basis of organic chemistry. Discovered by Kekulé.',
    atoms: [
      { symbol: 'C', x:  0,   y: -80, z: 0, color: '#888888', radius: 12 },
      { symbol: 'C', x:  70,  y: -40, z: 0, color: '#888888', radius: 12 },
      { symbol: 'C', x:  70,  y:  40, z: 0, color: '#888888', radius: 12 },
      { symbol: 'C', x:  0,   y:  80, z: 0, color: '#888888', radius: 12 },
      { symbol: 'C', x: -70,  y:  40, z: 0, color: '#888888', radius: 12 },
      { symbol: 'C', x: -70,  y: -40, z: 0, color: '#888888', radius: 12 },
      { symbol: 'H', x:  0,   y:-110, z: 0, color: '#ffffff', radius: 8  },
      { symbol: 'H', x:  95,  y: -55, z: 0, color: '#ffffff', radius: 8  },
      { symbol: 'H', x:  95,  y:  55, z: 0, color: '#ffffff', radius: 8  },
      { symbol: 'H', x:  0,   y: 110, z: 0, color: '#ffffff', radius: 8  },
      { symbol: 'H', x: -95,  y:  55, z: 0, color: '#ffffff', radius: 8  },
      { symbol: 'H', x: -95,  y: -55, z: 0, color: '#ffffff', radius: 8  },
    ],
    bonds: [
      { from:0,to:1},{from:1,to:2},{from:2,to:3},
      { from:3,to:4},{from:4,to:5},{from:5,to:0},
      { from:0,to:6},{from:1,to:7},{from:2,to:8},
      { from:3,to:9},{from:4,to:10},{from:5,to:11},
    ],
  },
}

export function MolecularViewerApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const angleRef = useRef(0)
  const [selected, setSelected] = useState('H2O')
  const [spinning, setSpinning] = useState(true)
  const spinRef = useRef(true)
  const selectedRef = useRef('H2O')

  useEffect(() => { spinRef.current = spinning }, [spinning])
  useEffect(() => { selectedRef.current = selected }, [selected])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    function draw() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      const mol = MOLECULES[selectedRef.current]
      if (!mol) { frameRef.current = requestAnimationFrame(draw); return }

      const angle = angleRef.current
      const CX = W / 2; const CY = H / 2

      const rotated = mol.atoms.map(function(a) {
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)
        return {
          ...a,
          rx: a.x * cosA - a.z * sinA + CX,
          ry: a.y + CY,
          rz: a.x * sinA + a.z * cosA,
        }
      })

      mol.bonds.forEach(function(b) {
        const a1 = rotated[b.from]
        const a2 = rotated[b.to]
        ctx.beginPath()
        ctx.moveTo(a1.rx, a1.ry)
        ctx.lineTo(a2.rx, a2.ry)
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 3
        ctx.stroke()
      })

      rotated.sort((a, b) => a.rz - b.rz).forEach(function(a) {
        ctx.beginPath()
        ctx.arc(a.rx, a.ry, a.radius, 0, Math.PI * 2)
        ctx.fillStyle = a.color
        ctx.shadowColor = a.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#000'
        ctx.font = `bold ${a.radius * 0.9}px JetBrains Mono`
        ctx.textAlign = 'center'
        ctx.fillText(a.symbol, a.rx, a.ry + a.radius * 0.35)
      })

      if (spinRef.current) angleRef.current += 0.015
      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const mol = MOLECULES[selected]

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#00c8ff', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700 }}>// molecular.app</span>
        {Object.keys(MOLECULES).map(function(key) {
          return (
            <button key={key} onClick={function() { setSelected(key) }}
              style={{ padding: '3px 10px', background: selected === key ? '#00c8ff20' : 'transparent', border: `1px solid ${selected === key ? '#00c8ff' : '#333'}`, borderRadius: 4, color: selected === key ? '#00c8ff' : '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
              {MOLECULES[key].formula}
            </button>
          )
        })}
        <button onClick={function() { setSpinning(s => !s) }}
          style={{ padding: '3px 10px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer', marginLeft: 'auto' }}>
          {spinning ? '⏸ Stop' : '▶ Spin'}
        </button>
      </div>
      <canvas ref={canvasRef} width={680} height={300} style={{ flex: 1, width: '100%' }} />
      {mol && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700 }}>{mol.formula}</span>
            <span style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 12, marginLeft: 8 }}>{mol.name}</span>
          </div>
          <p style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, margin: 0, flex: 1 }}>{mol.description}</p>
        </div>
      )}
    </div>
  )
}