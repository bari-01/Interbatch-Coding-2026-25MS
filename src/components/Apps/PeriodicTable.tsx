import { useState } from 'react'

interface Element {
  symbol: string
  name: string
  number: number
  mass: string
  category: string
  group: number
  period: number
  description: string
}

const ELEMENTS: Element[] = [
  { symbol:'H',  name:'Hydrogen',    number:1,   mass:'1.008',   category:'nonmetal',        group:1,  period:1, description:'Lightest element. Makes up 75% of the universe.' },
  { symbol:'He', name:'Helium',      number:2,   mass:'4.003',   category:'noble-gas',        group:18, period:1, description:'Noble gas. Used in balloons and MRI machines.' },
  { symbol:'Li', name:'Lithium',     number:3,   mass:'6.941',   category:'alkali-metal',     group:1,  period:2, description:'Lightest metal. Used in batteries.' },
  { symbol:'Be', name:'Beryllium',   number:4,   mass:'9.012',   category:'alkaline-earth',   group:2,  period:2, description:'Hard, lightweight metal used in aerospace.' },
  { symbol:'B',  name:'Boron',       number:5,   mass:'10.811',  category:'metalloid',        group:13, period:2, description:'Metalloid used in glass and ceramics.' },
  { symbol:'C',  name:'Carbon',      number:6,   mass:'12.011',  category:'nonmetal',         group:14, period:2, description:'Basis of all known life. Exists as diamond and graphite.' },
  { symbol:'N',  name:'Nitrogen',    number:7,   mass:'14.007',  category:'nonmetal',         group:15, period:2, description:'Makes up 78% of Earth\'s atmosphere.' },
  { symbol:'O',  name:'Oxygen',      number:8,   mass:'15.999',  category:'nonmetal',         group:16, period:2, description:'Essential for respiration. Makes up 21% of air.' },
  { symbol:'F',  name:'Fluorine',    number:9,   mass:'18.998',  category:'halogen',          group:17, period:2, description:'Most electronegative element.' },
  { symbol:'Ne', name:'Neon',        number:10,  mass:'20.180',  category:'noble-gas',        group:18, period:2, description:'Noble gas used in neon signs.' },
  { symbol:'Na', name:'Sodium',      number:11,  mass:'22.990',  category:'alkali-metal',     group:1,  period:3, description:'Highly reactive metal. Component of table salt.' },
  { symbol:'Mg', name:'Magnesium',   number:12,  mass:'24.305',  category:'alkaline-earth',   group:2,  period:3, description:'Light structural metal. Essential for chlorophyll.' },
  { symbol:'Al', name:'Aluminum',    number:13,  mass:'26.982',  category:'post-transition',  group:13, period:3, description:'Most abundant metal in Earth\'s crust.' },
  { symbol:'Si', name:'Silicon',     number:14,  mass:'28.086',  category:'metalloid',        group:14, period:3, description:'Basis of modern electronics and computing.' },
  { symbol:'P',  name:'Phosphorus',  number:15,  mass:'30.974',  category:'nonmetal',         group:15, period:3, description:'Essential for DNA and ATP energy molecules.' },
  { symbol:'S',  name:'Sulfur',      number:16,  mass:'32.065',  category:'nonmetal',         group:16, period:3, description:'Yellow solid. Used in gunpowder and rubber vulcanization.' },
  { symbol:'Cl', name:'Chlorine',    number:17,  mass:'35.453',  category:'halogen',          group:17, period:3, description:'Used to disinfect water. Component of table salt.' },
  { symbol:'Ar', name:'Argon',       number:18,  mass:'39.948',  category:'noble-gas',        group:18, period:3, description:'Third most abundant gas in Earth\'s atmosphere.' },
  { symbol:'K',  name:'Potassium',   number:19,  mass:'39.098',  category:'alkali-metal',     group:1,  period:4, description:'Essential for nerve function. Highly reactive.' },
  { symbol:'Ca', name:'Calcium',     number:20,  mass:'40.078',  category:'alkaline-earth',   group:2,  period:4, description:'Most abundant metal in human body. Builds bones.' },
  { symbol:'Fe', name:'Iron',        number:26,  mass:'55.845',  category:'transition-metal', group:8,  period:4, description:'Most common element on Earth by mass. Basis of steel.' },
  { symbol:'Cu', name:'Copper',      number:29,  mass:'63.546',  category:'transition-metal', group:11, period:4, description:'Excellent electrical conductor. Used since ancient times.' },
  { symbol:'Zn', name:'Zinc',        number:30,  mass:'65.38',   category:'transition-metal', group:12, period:4, description:'Essential trace element. Used in galvanizing steel.' },
  { symbol:'Ag', name:'Silver',      number:47,  mass:'107.868', category:'transition-metal', group:11, period:5, description:'Best electrical and thermal conductor. Used in jewelry.' },
  { symbol:'Au', name:'Gold',        number:79,  mass:'196.967', category:'transition-metal', group:11, period:6, description:'Highly valued precious metal. Resistant to corrosion.' },
  { symbol:'Hg', name:'Mercury',     number:80,  mass:'200.592', category:'transition-metal', group:12, period:6, description:'Only metal liquid at room temperature.' },
  { symbol:'Pb', name:'Lead',        number:82,  mass:'207.2',   category:'post-transition',  group:14, period:6, description:'Dense toxic metal. Used in batteries and radiation shielding.' },
  { symbol:'U',  name:'Uranium',     number:92,  mass:'238.029', category:'actinide',         group:3,  period:7, description:'Radioactive. Used in nuclear power and weapons.' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'nonmetal':        '#1D9E75',
  'noble-gas':       '#534AB7',
  'alkali-metal':    '#D85A30',
  'alkaline-earth':  '#BA7517',
  'metalloid':       '#0F6E56',
  'halogen':         '#993556',
  'transition-metal':'#185FA5',
  'post-transition': '#888780',
  'actinide':        '#A32D2D',
}

export function PeriodicTableApp() {
  const [selected, setSelected] = useState<Element | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search
    ? ELEMENTS.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.symbol.toLowerCase().includes(search.toLowerCase()) ||
        String(e.number).includes(search)
      )
    : ELEMENTS

  return (
    <div className="app-body" style={{ padding: '12px 16px' }}>
      <p className="app-label cyan">// periodic.app — Periodic Table</p>

      <input
        type="text"
        placeholder="Search element, symbol, or number..."
        value={search}
        onChange={function(e) { setSearch(e.target.value) }}
        style={{
          width: '100%', padding: '8px 12px', marginBottom: 12,
          background: '#111', border: '1px solid #222', borderRadius: 6,
          color: '#d0d0d0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
          outline: 'none',
        }}
      />

      {selected && (
        <div style={{
          background: '#111', border: `2px solid ${CATEGORY_COLORS[selected.category] ?? '#333'}`,
          borderRadius: 8, padding: '12px 16px', marginBottom: 12,
          display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: CATEGORY_COLORS[selected.category] ?? '#fff', fontFamily: 'JetBrains Mono' }}>{selected.symbol}</div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono' }}>#{selected.number}</div>
            <div style={{ fontSize: 11, color: '#555', fontFamily: 'JetBrains Mono' }}>{selected.mass}</div>
          </div>
          <div>
            <p style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{selected.name}</p>
            <p style={{ color: '#888', fontFamily: 'JetBrains Mono', fontSize: 11, marginBottom: 6, textTransform: 'capitalize' }}>{selected.category.replace('-', ' ')}</p>
            <p style={{ color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.6 }}>{selected.description}</p>
          </div>
          <button onClick={function() { setSelected(null) }} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {filtered.map(function(el) {
          return (
            <button
              key={el.number}
              onClick={function() { setSelected(el) }}
              style={{
                width: 56, height: 60, background: selected?.number === el.number ? CATEGORY_COLORS[el.category] : '#111',
                border: `1px solid ${CATEGORY_COLORS[el.category] ?? '#333'}`,
                borderRadius: 6, cursor: 'pointer', padding: 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s',
              }}
            >
              <span style={{ fontSize: 9, color: '#666', fontFamily: 'JetBrains Mono' }}>{el.number}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: selected?.number === el.number ? '#fff' : (CATEGORY_COLORS[el.category] ?? '#fff'), fontFamily: 'JetBrains Mono' }}>{el.symbol}</span>
              <span style={{ fontSize: 8, color: '#888', fontFamily: 'JetBrains Mono', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 52 }}>{el.name}</span>
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {Object.entries(CATEGORY_COLORS).map(function(entry) {
          return (
            <span key={entry[0]} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#888' }}>
              <span style={{ width: 10, height: 10, background: entry[1], borderRadius: 2, display: 'inline-block' }} />
              {entry[0].replace(/-/g, ' ')}
            </span>
          )
        })}
      </div>
    </div>
  )
}