import React from 'react'

// ── Shared helpers ────────────────────────────────────────────────────────────
const BG   = '#08080f'
const GRID = 'rgba(255,255,255,0.04)'
const LINE = 'rgba(255,255,255,0.25)'
const TXT  = 'rgba(255,255,255,0.75)'
const DIM  = 'rgba(255,255,255,0.35)'

function Base({ children, h = 130 }: { children: React.ReactNode; h?: number }) {
  return (
    <svg viewBox={`0 0 260 ${h}`} width="100%" style={{ maxHeight: h + 10 }} aria-hidden>
      <rect width="260" height={h} fill={BG} rx="8" />
      {/* subtle grid */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="10" y1={h * p} x2="250" y2={h * p} stroke={GRID} />
      ))}
      {children}
    </svg>
  )
}

function Candle({ x, y, h, w = 10, bull, wickT = 4, wickB = 4 }: {
  x: number; y: number; h: number; w?: number; bull: boolean; wickT?: number; wickB?: number
}) {
  const color = bull ? '#34d399' : '#f87171'
  const cx = x + w / 2
  return (
    <g>
      <line x1={cx} y1={y - wickT} x2={cx} y2={y + h + wickB} stroke={color} strokeWidth="1" />
      <rect x={x} y={y} width={w} height={Math.max(h, 2)} fill={color} fillOpacity="0.85" rx="1" />
    </g>
  )
}

function Label({ x, y, text, color = TXT, size = 7.5, anchor = 'middle' }: {
  x: number; y: number; text: string; color?: string; size?: number; anchor?: string
}) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor as any} fontFamily="system-ui" fontWeight="700">{text}</text>
}

function Arrow({ x1, y1, x2, y2, color = '#f59e0b' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const ax = x2 - ux * 6, ay = y2 - uy * 6
  const px = -uy * 4, py = ux * 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  )
}

function Zone({ x, y, w, h, color, label }: { x: number; y: number; w: number; h: number; color: string; label?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.18" />
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={color} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,2" />
      {label && <Label x={x + w + 4} y={y + h / 2 + 2.5} text={label} color={color} anchor="start" size={7} />}
    </g>
  )
}

// ── Diagrams ──────────────────────────────────────────────────────────────────

export function MarketStructureDiagram() {
  const pts: [number, number][] = [[10,105],[45,68],[65,82],[110,35],[135,52],[180,18],[205,32]]
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  return (
    <Base>
      <path d={path} stroke="#34d399" strokeWidth="2" fill="none" />
      {[[45,68,'HH'],[110,35,'HH'],[180,18,'HH']].map(([x,y,l]) => (
        <g key={String(l)}><circle cx={x as number} cy={y as number} r="3" fill="#34d399" /><Label x={x as number} y={(y as number)-7} text={String(l)} color="#34d399" size={7}/></g>
      ))}
      {[[65,82,'HL'],[135,52,'HL']].map(([x,y,l]) => (
        <g key={String(l)+x}><circle cx={x as number} cy={y as number} r="3" fill="#60a5fa" /><Label x={x as number} y={(y as number)+12} text={String(l)} color="#60a5fa" size={7}/></g>
      ))}
      <Label x={130} y={122} text="Bullish Market Structure: HH + HL sequence" color={DIM} size={7}/>
    </Base>
  )
}

export function BreakOfStructureDiagram() {
  return (
    <Base>
      <polyline points="10,105 45,72 65,85 110,45" stroke={LINE} strokeWidth="1.5" fill="none" />
      <line x1="10" y1="72" x2="140" y2="72" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
      <polyline points="110,45 135,60 160,25" stroke="#34d399" strokeWidth="2" fill="none" />
      <circle cx={110} cy={45} r="3" fill="#34d399" />
      <Label x={145} y={68} text="Previous High" color="#f59e0b" size={7} anchor="start"/>
      <Arrow x1={155} y1={55} x2={165} y2={38} color="#34d399"/>
      <Label x={170} y={35} text="BOS ↑" color="#34d399" size={8} anchor="start"/>
      <Label x={130} y={122} text="Break of Structure: price clears previous high" color={DIM} size={7}/>
    </Base>
  )
}

export function ChangeOfCharacterDiagram() {
  return (
    <Base>
      <polyline points="10,105 40,70 60,82 100,40 130,55" stroke="#34d399" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="82" x2="200" y2="82" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <polyline points="130,55 160,75 185,62 215,90" stroke="#f87171" strokeWidth="2" fill="none"/>
      <circle cx={130} cy={55} r="3" fill="#f59e0b"/>
      <Label x={85} y={45} text="Bullish" color="#34d399" size={7}/>
      <Label x={82} y={78} text="Last HL" color="#f59e0b" size={7}/>
      <Label x={195} y={92} text="ChoCH" color="#f87171" size={8} anchor="start"/>
      <Label x={130} y={122} text="Price breaks last HL → Change of Character" color={DIM} size={7}/>
    </Base>
  )
}

export function FairValueGapDiagram() {
  return (
    <Base>
      <Candle x={60} y={80} h={35} bull={false} wickT={8} wickB={4}/>
      <Candle x={100} y={28} h={55} bull={true} wickT={4} wickB={5}/>
      <Candle x={140} y={45} h={30} bull={true} wickT={3} wickB={8}/>
      <Zone x={60} y={45} w={100} h={35} color="#60a5fa" label="FVG"/>
      <line x1={60} y1={80} x2={60} y2={80} stroke="#60a5fa" strokeWidth="0"/>
      <Label x={105} y={63} text="Gap" color="#60a5fa" size={8}/>
      <Label x={130} y={122} text="C3 low doesn't reach C1 high = FVG" color={DIM} size={7}/>
    </Base>
  )
}

export function OrderBlockDiagram() {
  return (
    <Base>
      <Candle x={30} y={72} h={28} bull={true} wickT={5} wickB={3}/>
      <Candle x={55} y={68} h={32} bull={true} wickT={4} wickB={4}/>
      <Candle x={80} y={75} h={22} bull={false} wickT={3} wickB={5}/>
      <Zone x={80} y={75} w={20} h={22} color="#c084fc" label="OB"/>
      <Candle x={115} y={22} h={52} bull={true} wickT={5} wickB={4}/>
      <Candle x={140} y={18} h={40} bull={true} wickT={4} wickB={3}/>
      <Arrow x1={50} y1={115} x2={88} y2={95} color="#c084fc"/>
      <Label x={30} y={122} text="Last bearish candle before displacement = Bullish OB" color={DIM} size={7}/>
    </Base>
  )
}

export function BreakerBlockDiagram() {
  return (
    <Base>
      <Candle x={20} y={55} h={30} bull={false} wickT={5} wickB={4}/>
      <Zone x={20} y={55} w={20} h={30} color="#c084fc"/>
      <Label x={20} y={50} text="Bearish OB" color="#c084fc" size={6.5}/>
      <Candle x={55} y={30} h={55} bull={false} wickT={5} wickB={8}/>
      <Candle x={80} y={70} h={35} bull={true} wickT={3} wickB={5}/>
      <Candle x={105} y={40} h={45} bull={true} wickT={4} wickB={4}/>
      <line x1={20} y1={55} x2={200} y2={55} stroke="#f87171" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={160} y={52} text="Breaker" color="#f87171" size={7}/>
      <Label x={130} y={122} text="Violated OB becomes Breaker Block (resistance)" color={DIM} size={7}/>
    </Base>
  )
}

export function LiquiditySweepDiagram() {
  return (
    <Base>
      <line x1="20" y1="45" x2="240" y2="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={22} y={40} text="Buy Stops (BSL)" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={30} y={55} h={25} bull={true} wickT={20} wickB={3}/>
      <Candle x={55} y={60} h={20} bull={true} wickT={5} wickB={3}/>
      <Candle x={80} y={55} h={25} bull={true} wickT={3} wickB={4}/>
      <Candle x={110} y={25} h={60} bull={false} wickT={22} wickB={5}/>
      <Label x={118} y={18} text="Sweep!" color="#f87171" size={8} anchor="start"/>
      <Candle x={140} y={40} h={50} bull={false} wickT={4} wickB={4}/>
      <Candle x={165} y={65} h={35} bull={false} wickT={3} wickB={5}/>
      <Label x={130} y={122} text="Wick takes stops above level → sharp reversal" color={DIM} size={7}/>
    </Base>
  )
}

export function EqualHighsDiagram() {
  return (
    <Base>
      <polyline points="20,100 50,55 70,75 100,55 120,70 150,55 170,72" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="55" x2="220" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx={50} cy={55} r="3" fill="#f59e0b"/>
      <circle cx={100} cy={55} r="3" fill="#f59e0b"/>
      <circle cx={150} cy={55} r="3" fill="#f59e0b"/>
      <Label x={200} y={52} text="EQH" color="#f59e0b" size={8}/>
      <rect x={20} y={45} width={200} height={10} fill="#f59e0b" fillOpacity="0.08"/>
      <Label x={115} y={30} text="Buy Stops Pool" color="#f59e0b" size={7.5}/>
      <Arrow x1={115} y1={35} x2={115} y2={48} color="#f59e0b"/>
      <Label x={130} y={122} text="Equal highs = pooled buy stops above" color={DIM} size={7}/>
    </Base>
  )
}

export function EqualLowsDiagram() {
  return (
    <Base>
      <polyline points="20,30 50,75 70,55 100,75 120,60 150,75 170,58" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="75" x2="220" y2="75" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx={50} cy={75} r="3" fill="#60a5fa"/>
      <circle cx={100} cy={75} r="3" fill="#60a5fa"/>
      <circle cx={150} cy={75} r="3" fill="#60a5fa"/>
      <Label x={200} y={72} text="EQL" color="#60a5fa" size={8}/>
      <rect x={20} y={75} width={200} height={10} fill="#60a5fa" fillOpacity="0.08"/>
      <Label x={115} y={100} text="Sell Stops Pool" color="#60a5fa" size={7.5}/>
      <Arrow x1={115} y1={96} x2={115} y2={83} color="#60a5fa"/>
      <Label x={130} y={122} text="Equal lows = pooled sell stops below" color={DIM} size={7}/>
    </Base>
  )
}

export function AMDCycleDiagram() {
  const sections = [
    { x: 15, label: 'A', name: 'Accumulation', color: '#60a5fa' },
    { x: 90, label: 'M', name: 'Manipulation', color: '#f87171' },
    { x: 165, label: 'D', name: 'Distribution', color: '#34d399' },
  ]
  return (
    <Base>
      {sections.map(s => (
        <g key={s.label}>
          <rect x={s.x} y={20} width={68} height={80} fill={s.color} fillOpacity="0.07" rx="4"/>
          <rect x={s.x} y={20} width={68} height={80} fill="none" stroke={s.color} strokeOpacity="0.3" rx="4"/>
          <text x={s.x + 34} y={62} fill={s.color} fontSize={22} textAnchor="middle" fontFamily="system-ui" fontWeight="900" opacity="0.5">{s.label}</text>
          <Label x={s.x + 34} y={82} text={s.name} color={s.color} size={7}/>
        </g>
      ))}
      <polyline points="25,70 55,75 70,72 83,73" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <polyline points="98,68 110,55 120,80 135,40 148,65" stroke="#f87171" strokeWidth="1.5" fill="none"/>
      <polyline points="173,65 188,40 205,30 220,18 228,22" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Label x={130} y={122} text="Accumulate → Manipulate (Judas) → Distribute (real move)" color={DIM} size={7}/>
    </Base>
  )
}

export function PowerOfThreeDiagram() {
  return (
    <Base>
      <rect x={15} y={40} width={55} height={65} fill="#60a5fa" fillOpacity="0.07" rx="4"/>
      <rect x={80} y={25} width={55} height={80} fill="#f87171" fillOpacity="0.07" rx="4"/>
      <rect x={145} y={15} width={55} height={90} fill="#34d399" fillOpacity="0.07" rx="4"/>
      <Label x={42} y={85} text="A" color="#60a5fa" size={20}/>
      <Label x={42} y={100} text="Range" color="#60a5fa" size={7}/>
      <Label x={107} y={72} text="B" color="#f87171" size={20}/>
      <Label x={103} y={87} text="Judas" color="#f87171" size={7}/>
      <polyline points="20,85 45,80 60,88 73,83" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <polyline points="88,60 100,45 110,70 122,35 133,55" stroke="#f87171" strokeWidth="1.5" fill="none"/>
      <polyline points="153,55 165,35 180,22 200,14 215,18" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Label x={172} y={80} text="C" color="#34d399" size={20}/>
      <Label x={166} y={95} text="True Move" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Asia consolidates → London manipulates → NY distributes" color={DIM} size={6.5}/>
    </Base>
  )
}

export function PremiumDiscountDiagram() {
  return (
    <Base>
      <rect x={30} y={15} width={200} height={50} fill="#f87171" fillOpacity="0.07"/>
      <rect x={30} y={65} width={200} height={50} fill="#34d399" fillOpacity="0.07"/>
      <line x1="30" y1="15" x2="230" y2="15" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="30" y1="65" x2="230" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="30" y1="115" x2="230" y2="115" stroke="#34d399" strokeWidth="1.5"/>
      <Label x={35} y={11} text="Swing High / Premium Top" color="#f87171" size={7} anchor="start"/>
      <Label x={35} y={62} text="50% Equilibrium" color="#f59e0b" size={7} anchor="start"/>
      <Label x={35} y={127} text="Swing Low / Discount Bottom" color="#34d399" size={7} anchor="start"/>
      <Label x={220} y={45} text="SELL" color="#f87171" size={9} anchor="end"/>
      <Label x={220} y={95} text="BUY" color="#34d399" size={9} anchor="end"/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}

export function OTEDiagram() {
  return (
    <Base>
      <polyline points="20,100 80,20" stroke="#34d399" strokeWidth="2" fill="none"/>
      <line x1="20" y1="100" x2="240" y2="100" stroke={LINE} strokeWidth="1"/>
      <line x1="20" y1="20" x2="240" y2="20" stroke={LINE} strokeWidth="1"/>
      {[
        {pct:0.5,  label:'50% EQ',     color:'#f59e0b', y:60},
        {pct:0.618,label:'61.8% OTE',  color:'#34d399', y:69.4},
        {pct:0.705,label:'70.5%',      color:'#34d399', y:76.4},
        {pct:0.79, label:'79% Deep',   color:'#60a5fa', y:83.2},
      ].map(f => (
        <g key={f.label}>
          <line x1="80" y1={f.y} x2="240" y2={f.y} stroke={f.color} strokeWidth="0.8" strokeDasharray="4,3"/>
          <Label x={195} y={f.y - 2} text={f.label} color={f.color} size={6.5} anchor="start"/>
        </g>
      ))}
      <Zone x={80} y={69} w={80} h={15} color="#34d399" label="OTE Zone"/>
      <Label x={130} y={122} text="OTE = 61.8%–79% retracement of displacement" color={DIM} size={7}/>
    </Base>
  )
}

export function KillZonesDiagram() {
  const zones = [
    { x:15,  w:40, label:'Asia',  sub:'7PM–11PM', color:'#c084fc' },
    { x:65,  w:40, label:'London',sub:'2AM–5AM',  color:'#60a5fa' },
    { x:115, w:55, label:'NY AM', sub:'8:30–11AM',color:'#f59e0b' },
    { x:180, w:30, label:'NY PM', sub:'1:30–4PM', color:'#34d399' },
  ]
  return (
    <Base h={110}>
      <line x1="10" y1="60" x2="250" y2="60" stroke={LINE} strokeWidth="1"/>
      {zones.map(z => (
        <g key={z.label}>
          <rect x={z.x} y={40} width={z.w} height={40} fill={z.color} fillOpacity="0.15" rx="3"/>
          <rect x={z.x} y={40} width={z.w} height={40} fill="none" stroke={z.color} strokeOpacity="0.4" rx="3"/>
          <Label x={z.x + z.w/2} y={56} text={z.label} color={z.color} size={7}/>
          <Label x={z.x + z.w/2} y={68} text={z.sub} color={z.color} size={6} />
        </g>
      ))}
      <Label x={130} y={100} text="Highest probability setups occur within kill zones" color={DIM} size={7}/>
    </Base>
  )
}

export function DisplacementDiagram() {
  return (
    <Base>
      <Candle x={20}  y={75} h={22} bull={true}  wickT={3} wickB={3}/>
      <Candle x={40}  y={70} h={25} bull={false} wickT={4} wickB={3}/>
      <Candle x={60}  y={72} h={20} bull={true}  wickT={3} wickB={4}/>
      <Candle x={80}  y={68} h={24} bull={false} wickT={5} wickB={3}/>
      <Candle x={110} y={18} h={70} bull={true}  wickT={4} wickB={5}/>
      <Zone x={80} y={42} w={44} h={26} color="#60a5fa" label="FVG"/>
      <Label x={125} y={14} text="Displacement!" color="#34d399" size={8} anchor="start"/>
      <Candle x={155} y={38} h={30} bull={true}  wickT={4} wickB={4}/>
      <Candle x={180} y={32} h={25} bull={true}  wickT={3} wickB={4}/>
      <Label x={130} y={122} text="Impulsive move leaving FVG = institutional displacement" color={DIM} size={7}/>
    </Base>
  )
}

export function InducementDiagram() {
  return (
    <Base>
      <polyline points="20,90 60,40 90,60" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={60} cy={40} r="3" fill="#f59e0b"/>
      <Label x={60} y={34} text="Inducement" color="#f59e0b" size={7}/>
      <Label x={60} y={25} text="(Minor High)" color="#f59e0b" size={6.5}/>
      <polyline points="90,60 110,50 125,70" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={110} cy={50} r="3" fill="#f87171"/>
      <Label x={112} y={45} text="Sweep" color="#f87171" size={7} anchor="start"/>
      <polyline points="125,70 150,80 185,100 220,112" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={160} y={95} text="Real Move ↓" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Minor high baits retail longs → swept → real move" color={DIM} size={7}/>
    </Base>
  )
}

export function JudasSwingDiagram() {
  return (
    <Base>
      <line x1="30" y1="70" x2="230" y2="70" stroke={LINE} strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={32} y={66} text="Previous Low" color={DIM} size={7} anchor="start"/>
      <polyline points="30,70 60,85 80,100 95,110" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={70} y={118} text="Judas drop" color="#f87171" size={7}/>
      <circle cx={95} cy={110} r="3" fill="#f87171"/>
      <polyline points="95,110 115,90 140,65 170,40 210,20" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={175} y={30} text="True direction ↑" color="#34d399" size={8}/>
      <Label x={130} y={122} text="False open drops → stops swept → real bull move" color={DIM} size={7}/>
    </Base>
  )
}

export function MSSDiagram() {
  return (
    <Base>
      <polyline points="20,100 50,65 70,78 110,42 130,55 160,30" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="78" x2="240" y2="78" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={22} y={74} text="Last HL" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="160,30 185,50 210,85" stroke="#f87171" strokeWidth="2.5" fill="none"/>
      <circle cx={210} cy={85} r="4" fill="#f87171"/>
      <Label x={175} y={95} text="MSS" color="#f87171" size={9}/>
      <Label x={130} y={122} text="Displacement breaks last HL = Market Structure Shift" color={DIM} size={7}/>
    </Base>
  )
}

export function DrawOnLiquidityDiagram() {
  return (
    <Base>
      <polyline points="30,90 60,75 80,82 110,65 130,72" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="25" x2="240" y2="25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={22} y={21} text="DOL: Equal Highs / BSL" color="#f59e0b" size={7} anchor="start"/>
      <Arrow x1={130} y1={65} x2={200} y2={28} color="#f59e0b"/>
      <polyline points="130,72 155,55 175,40 200,28" stroke="#34d399" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
      <Label x={170} y={50} text="Price drawn↑" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Price is always moving toward the next liquidity pool" color={DIM} size={7}/>
    </Base>
  )
}

export function SMTDivergenceDiagram() {
  return (
    <Base>
      <Label x={50} y={18} text="ES" color="#34d399" size={8}/>
      <Label x={50} y={75} text="NQ" color="#60a5fa" size={8}/>
      <polyline points="30,40 70,22 100,30 140,15 170,20" stroke="#34d399" strokeWidth="2" fill="none"/>
      <circle cx={140} cy={15} r="3" fill="#34d399"/>
      <Label x={142} y={12} text="New High" color="#34d399" size={6.5} anchor="start"/>
      <polyline points="30,85 70,70 100,75 140,68 170,72" stroke="#60a5fa" strokeWidth="2" fill="none"/>
      <circle cx={140} cy={68} r="3" fill="#60a5fa"/>
      <Label x={142} y={65} text="Lower High ←" color="#f87171" size={6.5} anchor="start"/>
      <line x1="140" y1="15" x2="140" y2="68" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2"/>
      <Label x={148} y={44} text="SMT" color="#f87171" size={8}/>
      <Label x={130} y={122} text="ES new high + NQ lower high = bearish divergence" color={DIM} size={7}/>
    </Base>
  )
}

export function MitigationBlockDiagram() {
  return (
    <Base>
      <Candle x={30} y={70} h={30} bull={false} wickT={5} wickB={4}/>
      <Zone x={30} y={70} w={20} h={30} color="#c084fc" label="Bearish OB"/>
      <Candle x={60} y={45} h={50} bull={false} wickT={5} wickB={5}/>
      <Candle x={85} y={70} h={30} bull={true}  wickT={4} wickB={4}/>
      <Candle x={110} y={50} h={35} bull={true}  wickT={3} wickB={5}/>
      <Candle x={135} y={65} h={25} bull={false} wickT={4} wickB={3}/>
      <Label x={155} y={75} text="Return to OB" color="#c084fc" size={7} anchor="start"/>
      <Arrow x1={155} y1={75} x2={145} y2={75} color="#c084fc"/>
      <Label x={130} y={122} text="Price returns to OB, partially fills orders, continues" color={DIM} size={7}/>
    </Base>
  )
}

export function VolumeImbalanceDiagram() {
  return (
    <Base>
      <Candle x={60}  y={65} h={40} bull={true} wickT={4} wickB={4}/>
      <Candle x={85}  y={40} h={45} bull={true} wickT={3} wickB={3}/>
      <line x1="70" y1="65" x2="240" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="95" y1="85" x2="240" y2="85" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Zone x={95} y={65} w={70} h={20} color="#f59e0b" label="Vol. Imbalance"/>
      <Label x={130} y={122} text="Open/close gap between adjacent candles = imbalance" color={DIM} size={7}/>
    </Base>
  )
}

export function BPRDiagram() {
  return (
    <Base>
      <Zone x={50} y={30} w={160} h={30} color="#34d399" label="Bullish FVG"/>
      <Zone x={50} y={50} w={160} h={30} color="#f87171" label="Bearish FVG"/>
      <Zone x={50} y={50} w={160} h={10} color="#f59e0b"/>
      <Label x={130} y={55} text="BPR" color="#f59e0b" size={9}/>
      <Label x={130} y={22} text="Bullish FVG" color="#34d399" size={7}/>
      <Label x={130} y={92} text="Bearish FVG" color="#f87171" size={7}/>
      <Label x={130} y={105} text="Overlap = Balanced Price Range" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="Two opposing FVGs overlapping = high-reaction zone" color={DIM} size={7}/>
    </Base>
  )
}

export function NWOGDiagram() {
  return (
    <Base>
      <Label x={60} y={14} text="Friday Close" color={DIM} size={7}/>
      <Label x={165} y={14} text="Sunday Open" color={DIM} size={7}/>
      <line x1="20" y1="45" x2="110" y2="45" stroke={LINE} strokeWidth="1.5"/>
      <line x1="145" y1="65" x2="240" y2="65" stroke={LINE} strokeWidth="1.5"/>
      <circle cx={110} cy={45} r="3" fill="#f59e0b"/>
      <circle cx={145} cy={65} r="3" fill="#60a5fa"/>
      <Zone x={110} y={45} w={35} h={20} color="#f59e0b" label="Gap"/>
      <polyline points="145,65 165,55 185,48 210,40" stroke="#34d399" strokeWidth="2" strokeDasharray="5,3" fill="none"/>
      <Label x={185} y={35} text="Gap fills" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Price commonly returns to fill NWOG during the week" color={DIM} size={7}/>
    </Base>
  )
}

export function MacroDiagram() {
  const macros = [
    { x:20,  w:30, label:'8:50', color:'#f59e0b' },
    { x:70,  w:30, label:'9:50', color:'#f59e0b' },
    { x:120, w:30, label:'10:50',color:'#f59e0b' },
    { x:165, w:28, label:'1:10', color:'#60a5fa' },
    { x:203, w:28, label:'2:10', color:'#60a5fa' },
  ]
  return (
    <Base h={100}>
      <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
      {macros.map(m => (
        <g key={m.label}>
          <rect x={m.x} y={35} width={m.w} height={40} fill={m.color} fillOpacity="0.15" rx="3"/>
          <Label x={m.x + m.w/2} y={50} text={m.label} color={m.color} size={6.5}/>
          <Label x={m.x + m.w/2} y={62} text="AM" color={m.color} size={5.5}/>
        </g>
      ))}
      <Label x={130} y={90} text="20-min windows of highest algo predictability" color={DIM} size={7}/>
    </Base>
  )
}

export function DailyBiasDiagram() {
  return (
    <Base>
      <Label x={35} y={15} text="Bullish Day" color="#34d399" size={8}/>
      <rect x={15} y={20} width={55} height={90} fill="#34d399" fillOpacity="0.05" rx="4"/>
      <polyline points="25,100 35,92 42,95 50,70 55,65 65,40 70,35" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={20} y={108} text="Asia" color={DIM} size={6}/>
      <Label x={38} y={108} text="London" color={DIM} size={6}/>
      <Label x={58} y={108} text="NY" color={DIM} size={6}/>
      <Label x={155} y={15} text="Bearish Day" color="#f87171" size={8}/>
      <rect x={135} y={20} width={55} height={90} fill="#f87171" fillOpacity="0.05" rx="4"/>
      <polyline points="145,40 150,45 160,65 165,70 175,90 180,95" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={140} y={108} text="Asia" color={DIM} size={6}/>
      <Label x={158} y={108} text="London" color={DIM} size={6}/>
      <Label x={178} y={108} text="NY" color={DIM} size={6}/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}

export function LiquidityRunDiagram() {
  return (
    <Base>
      {[[50,48],[110,28],[170,14]].map(([x,y]) => (
        <g key={x}>
          <line x1={x} y1={y as number} x2={x+60} y2={y as number} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
          <Label x={x+2} y={(y as number)-4} text="BSL" color="#f59e0b" size={6.5} anchor="start"/>
        </g>
      ))}
      <polyline points="20,95 40,85 55,55 75,70 90,42 115,35 135,48 155,22 180,18 210,10" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Price systematically sweeps each liquidity level" color={DIM} size={7}/>
    </Base>
  )
}

export function IRL_ERL_Diagram() {
  return (
    <Base>
      <line x1="30" y1="25" x2="230" y2="25" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="30" y1="105" x2="230" y2="105" stroke="#34d399" strokeWidth="1.5"/>
      <rect x={30} y={25} width={200} height={80} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={32} y={21} text="External Resistance (ERL)" color="#f87171" size={7} anchor="start"/>
      <Label x={32} y={118} text="External Support (ERL)" color="#34d399" size={7} anchor="start"/>
      <line x1="70" y1="55" x2="200" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="70" y1="75" x2="200" y2="75" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
      <Zone x={70} y={55} w={130} h={20} color="#f59e0b" label="IRL Zone"/>
      <Label x={100} y={68} text="Internal Liquidity" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="IRL: within range. ERL: beyond swing highs/lows." color={DIM} size={7}/>
    </Base>
  )
}

export function MarketMakerBuyDiagram() {
  return (
    <Base>
      <Label x={30} y={12} text="1. Consolidation" color="#60a5fa" size={7}/>
      <rect x={15} y={15} width={55} height={95} fill="#60a5fa" fillOpacity="0.05" rx="3"/>
      <polyline points="20,80 30,75 35,85 45,72 55,80 62,70 67,78" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <Label x={95} y={12} text="2. Judas Drop" color="#f87171" size={7}/>
      <rect x={78} y={15} width={50} height={95} fill="#f87171" fillOpacity="0.05" rx="3"/>
      <polyline points="80,60 90,75 100,90 105,105" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={165} y={12} text="3. True Rally" color="#34d399" size={7}/>
      <rect x={148} y={15} width={70} height={95} fill="#34d399" fillOpacity="0.05" rx="3"/>
      <polyline points="152,100 162,80 175,60 190,40 205,25 215,18" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={130} y={122} text="Consolidate → False Drop (sweep SSL) → Real Rally" color={DIM} size={7}/>
    </Base>
  )
}

export function MarketMakerSellDiagram() {
  return (
    <Base>
      <Label x={30} y={12} text="1. Consolidation" color="#60a5fa" size={7}/>
      <rect x={15} y={15} width={55} height={95} fill="#60a5fa" fillOpacity="0.05" rx="3"/>
      <polyline points="20,60 30,65 35,55 45,68 55,55 62,65 67,58" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <Label x={95} y={12} text="2. Judas Rally" color="#f59e0b" size={7}/>
      <rect x={78} y={15} width={50} height={95} fill="#f59e0b" fillOpacity="0.05" rx="3"/>
      <polyline points="80,80 90,65 100,45 105,28" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <Label x={165} y={12} text="3. True Drop" color="#f87171" size={7}/>
      <rect x={148} y={15} width={70} height={95} fill="#f87171" fillOpacity="0.05" rx="3"/>
      <polyline points="152,25 162,40 175,60 190,78 205,95 215,108" stroke="#f87171" strokeWidth="2.5" fill="none"/>
      <Label x={130} y={122} text="Consolidate → False Rally (sweep BSL) → Real Drop" color={DIM} size={7}/>
    </Base>
  )
}

export function TurtleSoupDiagram() {
  return (
    <Base>
      <line x1="20" y1="35" x2="240" y2="35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={22} y={31} text="20-Day Low" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="20,60 50,55 75,48 95,52 110,44 125,38" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <Candle x={125} y={18} h={38} bull={false} wickT={20} wickB={4}/>
      <Label x={140} y={12} text="False Break" color="#f87171" size={7}/>
      <Candle x={150} y={30} h={40} bull={true}  wickT={3} wickB={3}/>
      <Candle x={175} y={22} h={30} bull={true}  wickT={3} wickB={4}/>
      <Candle x={200} y={15} h={25} bull={true}  wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Break of 20-day low triggers stops → sharp reversal up" color={DIM} size={7}/>
    </Base>
  )
}

export function CBDRDiagram() {
  return (
    <Base h={110}>
      <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
      <rect x={95} y={25} width={80} height={60} fill="#c084fc" fillOpacity="0.1" rx="4"/>
      <rect x={95} y={25} width={80} height={60} fill="none" stroke="#c084fc" strokeOpacity="0.4" rx="4"/>
      <Label x={135} y={42} text="CBDR" color="#c084fc" size={9}/>
      <Label x={135} y={54} text="2AM – 5AM EST" color="#c084fc" size={7}/>
      <Label x={135} y={65} text="Pre-NY Range" color="#c084fc" size={6.5}/>
      <line x1="95" y1="25" x2="95" y2="85" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="175" y1="25" x2="175" y2="85" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.6"/>
      <Label x={30} y={52} text="Asia" color={DIM} size={7}/>
      <Label x={210} y={52} text="NY" color={DIM} size={7}/>
      <Label x={130} y={100} text="Range before NY open — potential manipulation zone" color={DIM} size={7}/>
    </Base>
  )
}

export function RetraCementDiagram() {
  return (
    <Base>
      <polyline points="20,100 80,30" stroke="#34d399" strokeWidth="2" fill="none"/>
      <polyline points="80,30 130,60" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
      <polyline points="130,60 210,15" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={100} y={28} text="Impulse" color="#34d399" size={7}/>
      <Label x={115} y={70} text="Retracement" color="#f59e0b" size={7}/>
      <Label x={185} y={22} text="Continuation" color="#34d399" size={7}/>
      <Zone x={105} y={45} w={50} h={20} color="#f59e0b" label="OTE Zone"/>
      <circle cx={80} cy={30} r="3" fill="#34d399"/>
      <circle cx={130} cy={60} r="3" fill="#f59e0b"/>
      <Label x={130} y={122} text="Price pulls back into OTE zone before continuing" color={DIM} size={7}/>
    </Base>
  )
}

export function FlipDiagram() {
  return (
    <Base>
      <line x1="20" y1="55" x2="240" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <polyline points="20,90 50,80 70,60 90,45 110,30" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={70} y={50} text="Support" color="#34d399" size={7}/>
      <Candle x={110} y={18} h={50} bull={false} wickT={4} wickB={4}/>
      <Candle x={135} y={40} h={40} bull={false} wickT={4} wickB={4}/>
      <polyline points="155,55 170,65 190,75 220,85" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={185} y={72} text="Resistance" color="#f87171" size={7}/>
      <Label x={130} y={122} text="Previous support breaks → becomes resistance (flip)" color={DIM} size={7}/>
    </Base>
  )
}

export function OrderFlowDiagram() {
  return (
    <Base>
      {[
        { y:25,  label:'Institutional Buy Orders',  color:'#34d399', bull:true  },
        { y:60,  label:'Retail Sell Orders',        color:'#f87171', bull:false },
        { y:95,  label:'Institutional Sell Orders', color:'#f87171', bull:false },
      ].map((row, i) => (
        <g key={i}>
          <rect x={15} y={row.y} width={230} height={25} fill={row.color} fillOpacity="0.07" rx="3"/>
          <Label x={20} y={row.y + 16} text={row.label} color={row.color} size={7.5} anchor="start"/>
          <rect x={200} y={row.y + 6} width={35} height={12} fill={row.color} fillOpacity="0.3" rx="2"/>
          <Label x={217} y={row.y + 16} text={i === 1 ? 'SMALL' : 'LARGE'} color={row.color} size={6.5}/>
        </g>
      ))}
      <Label x={130} y={122} text="Institutions dominate flow — retail orders are absorbed" color={DIM} size={7}/>
    </Base>
  )
}

export function ConsequentEncroachmentDiagram() {
  return (
    <Base>
      <Zone x={50} y={35} w={160} h={55} color="#60a5fa" label="FVG"/>
      <line x1="50" y1="62" x2="210" y2="62" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={52} y={58} text="CE — 50% of FVG" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={75} y={30} h={28} bull={false} wickT={5} wickB={4}/>
      <Candle x={100} y={38} h={20} bull={true} wickT={3} wickB={3}/>
      <Arrow x1={145} y1={95} x2={135} y2={65} color="#f59e0b"/>
      <Label x={150} y={100} text="Target CE first" color="#f59e0b" size={7} anchor="start"/>
      <Label x={130} y={122} text="Midpoint of FVG = primary entry target (CE)" color={DIM} size={7}/>
    </Base>
  )
}

// ── Diagram registry ──────────────────────────────────────────────────────────
import type { ReactElement } from 'react'
export const DIAGRAMS: Record<string, () => ReactElement> = {
  'market-structure':        MarketStructureDiagram,
  'break-of-structure':      BreakOfStructureDiagram,
  'change-of-character':     ChangeOfCharacterDiagram,
  'market-structure-shift':  MSSDiagram,
  'equal-highs':             EqualHighsDiagram,
  'equal-lows':              EqualLowsDiagram,
  'buy-side-liquidity':      EqualHighsDiagram,
  'sell-side-liquidity':     EqualLowsDiagram,
  'liquidity-sweep':         LiquiditySweepDiagram,
  'stop-hunt':               LiquiditySweepDiagram,
  'draw-on-liquidity':       DrawOnLiquidityDiagram,
  'inducement':              InducementDiagram,
  'fair-value-gap':          FairValueGapDiagram,
  'sibi':                    FairValueGapDiagram,
  'bisi':                    FairValueGapDiagram,
  'displacement':            DisplacementDiagram,
  'balanced-price-range':    BPRDiagram,
  'volume-imbalance':        VolumeImbalanceDiagram,
  'premium-discount':        PremiumDiscountDiagram,
  'ote':                     OTEDiagram,
  'order-block':             OrderBlockDiagram,
  'breaker-block':           BreakerBlockDiagram,
  'mitigation-block':        MitigationBlockDiagram,
  'kill-zones':              KillZonesDiagram,
  'macro':                   MacroDiagram,
  'amd':                     AMDCycleDiagram,
  'manipulation':            JudasSwingDiagram,
  'judas-swing':             JudasSwingDiagram,
  'power-of-three':          PowerOfThreeDiagram,
  'daily-bias':              DailyBiasDiagram,
  'nwog':                    NWOGDiagram,
  'smt-divergence':          SMTDivergenceDiagram,
  'retracement':             RetraCementDiagram,
  'liquidity-run':           LiquidityRunDiagram,
  'irl-erl':                 IRL_ERL_Diagram,
  'market-maker-buy':        MarketMakerBuyDiagram,
  'market-maker-sell':       MarketMakerSellDiagram,
  'turtle-soup':             TurtleSoupDiagram,
  'cbdr':                    CBDRDiagram,
  'flip':                    FlipDiagram,
  'order-flow':              OrderFlowDiagram,
  'consequent-encroachment': ConsequentEncroachmentDiagram,
}
