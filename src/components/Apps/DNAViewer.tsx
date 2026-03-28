import { useState, useEffect, useRef } from 'react'

const COMPLEMENT: Record<string, string> = { A:'T', T:'A', G:'C', C:'G' }
const BASE_COLORS: Record<string, string> = { A:'#ff5050', T:'#00c8ff', G:'#00ff46', C:'#ffd700' }

export function DNAViewerApp() {
  const [sequence, setSequence] = useState('ATCGATCGATCGAATTCCGGTTAAGGCC')
  const [input, setInput] = useState('ATCGATCGATCGAATTCCGGTTAAGGCC')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const offsetRef = useRef(0)

  const complement = sequence.split('').map(b => COMPLEMENT[b] ?? 'N').join('')

  const aminoMap: Record<string, string> = {
    'TTT':'Phe','TTC':'Phe','TTA':'Leu','TTG':'Leu',
    'CTT':'Leu','CTC':'Leu','CTA':'Leu','CTG':'Leu',
    'ATT':'Ile','ATC':'Ile','ATA':'Ile','ATG':'Met',
    'GTT':'Val','GTC':'Val','GTA':'Val','GTG':'Val',
    'TCT':'Ser','TCC':'Ser','TCA':'Ser','TCG':'Ser',
    'CCT':'Pro','CCC':'Pro','CCA':'Pro','CCG':'Pro',
    'ACT':'Thr','ACC':'Thr','ACA':'Thr','ACG':'Thr',
    'GCT':'Ala','GCC':'Ala','GCA':'Ala','GCG':'Ala',
    'TAT':'Tyr','TAC':'Tyr','TAA':'Stop','TAG':'Stop',
    'CAT':'His','CAC':'His','CAA':'Gln','CAG':'Gln',
    'AAT':'Asn','AAC':'Asn','AAA':'Lys','AAG':'Lys',
    'GAT':'Asp','GAC':'Asp','GAA':'Glu','GAG':'Glu',
    'TGT':'Cys','TGC':'Cys','TGA':'Stop','TGG':'Trp',
    'CGT':'Arg','CGC':'Arg','CGA':'Arg','CGG':'Arg',
    'AGT':'Ser','AGC':'Ser','AGA':'Arg','AGG':'Arg',
    'GGT':'Gly','GGC':'Gly','GGA':'Gly','GGG':'Gly',
  }

  const codons = []
  for (let i = 0; i < sequence.length - 2; i += 3) {
    codons.push({ codon: sequence.slice(i, i+3), aa: aminoMap[sequence.slice(i, i+3)] ?? '???' })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    function draw() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      const offset = offsetRef.current
      const spacing = 24
      const visible = Math.floor(W / spacing) + 2

      for (let i = 0; i < visible; i++) {
        const seqIdx = (i + Math.floor(offset / spacing)) % sequence.length
        const base1 = sequence[seqIdx] ?? 'A'
        const base2 = complement[seqIdx] ?? 'T'
        const x = i * spacing - (offset % spacing)
        const wave = Math.sin((i + offset * 0.02) * 0.4) * 40
        const y1 = H/2 - 50 + wave
        const y2 = H/2 + 50 - wave

        ctx.beginPath()
        ctx.moveTo(x, y1)
        ctx.lineTo(x, y2)
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y1, 8, 0, Math.PI * 2)
        ctx.fillStyle = BASE_COLORS[base1] ?? '#888'
        ctx.shadowColor = BASE_COLORS[base1] ?? '#888'
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(x, y2, 8, 0, Math.PI * 2)
        ctx.fillStyle = BASE_COLORS[base2] ?? '#888'
        ctx.shadowColor = BASE_COLORS[base2] ?? '#888'
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#000'
        ctx.font = 'bold 8px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(base1, x, y1 + 3)
        ctx.fillText(base2, x, y2 + 3)
      }

      offsetRef.current += 0.5
      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [sequence, complement])

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// dna.app — DNA Sequence Viewer</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={input}
          onChange={function(e) { setInput(e.target.value.toUpperCase().replace(/[^ATGC]/g, '')) }}
          placeholder="Enter DNA sequence (A, T, G, C only)..."
          style={{
            flex: 1, padding: '6px 10px', background: '#111', border: '1px solid #222',
            borderRadius: 6, color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={function() { if (input.length >= 3) setSequence(input) }}
          style={{ padding: '6px 14px', background: '#00ff4620', border: '1px solid #00ff46', borderRadius: 6, color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
          Visualize
        </button>
      </div>

      <canvas ref={canvasRef} width={640} height={160} style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {Object.entries(BASE_COLORS).map(function(entry) {
          return (
            <span key={entry[0]} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
              <span style={{ width: 12, height: 12, background: entry[1], borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ color: entry[1] }}>{entry[0]}</span>
            </span>
          )
        })}
      </div>

      <div className="app-divider" />

      <p className="app-label yellow">// sequence analysis</p>
      <div className="app-commands" style={{ marginBottom: 12 }}>
        {[
          ['Length',        sequence.length + ' bases'],
          ['Complement',    complement.slice(0, 20) + (complement.length > 20 ? '...' : '')],
          ['GC content',    Math.round((sequence.split('').filter(b => b==='G'||b==='C').length / sequence.length) * 100) + '%'],
          ['AT content',    Math.round((sequence.split('').filter(b => b==='A'||b==='T').length / sequence.length) * 100) + '%'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>

      <p className="app-label yellow">// codon translation</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {codons.map(function(c, i) {
          return (
            <div key={i} style={{
              background: c.aa === 'Stop' ? '#ff505020' : '#111',
              border: `1px solid ${c.aa === 'Stop' ? '#ff5050' : '#222'}`,
              borderRadius: 4, padding: '3px 8px', fontFamily: 'JetBrains Mono', fontSize: 10,
            }}>
              <span style={{ color: '#00c8ff' }}>{c.codon}</span>
              <span style={{ color: '#555' }}> → </span>
              <span style={{ color: c.aa === 'Stop' ? '#ff5050' : '#ffd700' }}>{c.aa}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}