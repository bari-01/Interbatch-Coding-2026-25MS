import { useState } from 'react'

type Matrix = number[][]

function createMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

function multiply(A: Matrix, B: Matrix): Matrix | null {
  if (A[0].length !== B.length) return null
  return A.map((row, i) =>
    B[0].map((_, j) =>
      row.reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0)
    )
  )
}

function determinant(M: Matrix): number {
  const n = M.length
  if (n === 1) return M[0][0]
  if (n === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0]
  return M[0].reduce((sum, val, j) => {
    const minor = M.slice(1).map(row => row.filter((_, c) => c !== j))
    return sum + val * Math.pow(-1, j) * determinant(minor)
  }, 0)
}

function transpose(M: Matrix): Matrix {
  return M[0].map((_, j) => M.map(row => row[j]))
}

function inverse(M: Matrix): Matrix | null {
  const n = M.length
  if (n !== 2) return null
  const det = determinant(M)
  if (Math.abs(det) < 1e-10) return null
  return [
    [ M[1][1]/det, -M[0][1]/det],
    [-M[1][0]/det,  M[0][0]/det],
  ]
}

function add(A: Matrix, B: Matrix): Matrix | null {
  if (A.length !== B.length || A[0].length !== B[0].length) return null
  return A.map((row, i) => row.map((val, j) => val + B[i][j]))
}

function MatrixInput({ label, matrix, setMatrix, color }: {
  label: string
  matrix: Matrix
  setMatrix: (m: Matrix) => void
  color: string
}) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ color, fontFamily: 'JetBrains Mono', fontSize: 12, marginBottom: 6, fontWeight: 700 }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 52px)`, gap: 4 }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={function(e) {
                const newM = matrix.map(r => [...r])
                newM[i][j] = parseFloat(e.target.value) || 0
                setMatrix(newM)
              }}
              style={{
                width: 52, padding: '5px 6px', background: '#111',
                border: `1px solid ${color}40`, borderRadius: 4,
                color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 12,
                textAlign: 'center', outline: 'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

function MatrixDisplay({ label, matrix, color }: { label: string; matrix: Matrix; color: string }) {
  return (
    <div>
      <p style={{ color, fontFamily: 'JetBrains Mono', fontSize: 12, marginBottom: 6, fontWeight: 700 }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 60px)`, gap: 4 }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <div key={`${i}-${j}`} style={{
              width: 60, padding: '5px 6px', background: `${color}15`,
              border: `1px solid ${color}40`, borderRadius: 4,
              color, fontFamily: 'JetBrains Mono', fontSize: 12, textAlign: 'center',
            }}>
              {Math.round(val * 1000) / 1000}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function MatrixCalcApp() {
  const [A, setA] = useState<Matrix>([[1,2],[3,4]])
  const [B, setB] = useState<Matrix>([[5,6],[7,8]])
  const [result, setResult] = useState<{ label: string; matrix?: Matrix; scalar?: number; error?: string } | null>(null)

  const ops = [
    { label: 'A × B',  fn: () => { const r = multiply(A, B); return r ? { label: 'A × B', matrix: r } : { label: 'A × B', error: 'Incompatible dimensions' } }},
    { label: 'A + B',  fn: () => { const r = add(A, B); return r ? { label: 'A + B', matrix: r } : { label: 'A + B', error: 'Incompatible dimensions' } }},
    { label: 'Aᵀ',     fn: () => ({ label: 'Transpose of A', matrix: transpose(A) })},
    { label: 'Bᵀ',     fn: () => ({ label: 'Transpose of B', matrix: transpose(B) })},
    { label: 'det(A)', fn: () => ({ label: 'det(A)', scalar: determinant(A) })},
    { label: 'det(B)', fn: () => ({ label: 'det(B)', scalar: determinant(B) })},
    { label: 'A⁻¹',    fn: () => { const r = inverse(A); return r ? { label: 'A⁻¹ (2×2 only)', matrix: r } : { label: 'A⁻¹', error: 'Not invertible or not 2×2' } }},
    { label: 'B⁻¹',    fn: () => { const r = inverse(B); return r ? { label: 'B⁻¹ (2×2 only)', matrix: r } : { label: 'B⁻¹', error: 'Not invertible or not 2×2' } }},
  ]

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// matrix.app — Matrix Calculator</p>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
        <MatrixInput label="Matrix A" matrix={A} setMatrix={setA} color="#00ff46" />
        <MatrixInput label="Matrix B" matrix={B} setMatrix={setB} color="#00c8ff" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {ops.map(function(op) {
          return (
            <button key={op.label} onClick={function() { setResult(op.fn()) }}
              style={{ padding: '5px 12px', background: '#111', border: '1px solid #333', borderRadius: 6, color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer', transition: 'all 0.1s' }}
              onMouseEnter={function(e) { (e.target as HTMLElement).style.borderColor = '#00ff46'; (e.target as HTMLElement).style.color = '#00ff46' }}
              onMouseLeave={function(e) { (e.target as HTMLElement).style.borderColor = '#333'; (e.target as HTMLElement).style.color = '#aaa' }}
            >
              {op.label}
            </button>
          )
        })}
      </div>

      {result && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '14px 16px' }}>
          <p style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>Result: {result.label}</p>
          {result.error && <p style={{ color: '#ff5050', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{result.error}</p>}
          {result.matrix && <MatrixDisplay label="" matrix={result.matrix} color="#ffd700" />}
          {result.scalar !== undefined && (
            <p style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700 }}>
              {Math.round(result.scalar * 10000) / 10000}
            </p>
          )}
        </div>
      )}

      <div className="app-divider" />
      <p className="app-label yellow">// matrix size</p>
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: '2×2', fn: () => { setA([[1,2],[3,4]]); setB([[5,6],[7,8]]) }},
          { label: '3×3', fn: () => { setA([[1,2,3],[4,5,6],[7,8,9]]); setB([[9,8,7],[6,5,4],[3,2,1]]) }},
          { label: 'Reset', fn: () => { setA([[1,0],[0,1]]); setB([[1,0],[0,1]]); setResult(null) }},
        ].map(function(btn) {
          return (
            <button key={btn.label} onClick={btn.fn}
              style={{ padding: '4px 12px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
              {btn.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}