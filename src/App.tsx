import { useState, useMemo, useRef, useEffect } from 'react'
import {
  TERMS, CATEGORIES, CATEGORY_COLORS, searchTerms,
  ALL_LETTERS, type Term, type Category,
} from './terms'
import { DIAGRAMS } from './diagrams'

// ── Category metadata ─────────────────────────────────────────────────────────
const CAT_ICONS: Record<string, string> = {
  'Market Structure': '📈',
  'Liquidity':        '💧',
  'Price Delivery':   '🎯',
  'Order Blocks':     '🧱',
  'Sessions & Time':  '⏱',
  'AMD & Bias':       '🔄',
  'SMC & Models':     '🧠',
}

const CAT_SHORT: Record<string, string> = {
  'Market Structure': 'STRUCTURE',
  'Liquidity':        'LIQUIDITY',
  'Price Delivery':   'DELIVERY',
  'Order Blocks':     'ORDER BLOCK',
  'Sessions & Time':  'SESSION',
  'AMD & Bias':       'AMD',
  'SMC & Models':     'SMC',
}

// ── Animated hero background ─────────────────────────────────────────────────
function HeroBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Scrolling grid */}
      <div style={{
        position: 'absolute', inset: '-40px',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'grid-scroll 20s linear infinite',
      }}/>
      {/* Gradient fade over grid */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(4,4,10,0) 0%, #04040a 75%)' }}/>
      {/* Floating orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)',
        filter: 'blur(60px)', top: '-120px', left: '25%',
        animation: 'orb-drift-1 18s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 65%)',
        filter: 'blur(50px)', top: '0px', right: '10%',
        animation: 'orb-drift-2 22s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 65%)',
        filter: 'blur(45px)', top: '80px', left: '5%',
        animation: 'orb-drift-3 26s ease-in-out infinite',
      }}/>
      {/* Subtle horizontal glow at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent)' }}/>
    </div>
  )
}

// ── Term Card ─────────────────────────────────────────────────────────────────
function TermCard({ term, onRelatedClick, highlight, index }: {
  term: Term
  onRelatedClick: (name: string) => void
  highlight?: string
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[term.category]
  const DiagramComp = DIAGRAMS[term.diagramId]

  function hl(text: string) {
    if (!highlight || highlight.length < 2) return <>{text}</>
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === highlight.toLowerCase()
            ? <mark key={i} style={{ background: `${color}28`, color, borderRadius: '3px', padding: '0 2px', fontWeight: 700 }}>{p}</mark>
            : p
        )}
      </>
    )
  }

  return (
    <div
      className="gcard"
      style={{
        '--accent': color,
        borderRadius: '18px',
        overflow: 'hidden',
        background: 'rgba(5,5,12,0.99)',
        borderTop:    `1px solid ${color}22`,
        borderRight:  `1px solid ${color}12`,
        borderBottom: `1px solid ${color}12`,
        borderLeft:   `3px solid ${color}`,
        animationDelay: `${Math.min(index * 0.04, 0.4)}s`,
      } as React.CSSProperties}
      onClick={() => setExpanded(e => !e)}
    >
      {/* ── Diagram section ── */}
      <div
        className="diagram-frame"
        style={{
          background: `linear-gradient(160deg, ${color}0d 0%, ${color}04 40%, rgba(4,4,8,1) 75%)`,
          borderBottom: `1px solid ${color}14`,
          position: 'relative',
        }}
      >
        {/* Category watermark */}
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 3,
          fontSize: '7.5px', fontWeight: 900, letterSpacing: '0.14em',
          padding: '3px 8px', borderRadius: '6px',
          background: `${color}14`, color, border: `1px solid ${color}28`,
          textTransform: 'uppercase', pointerEvents: 'none',
        }}>
          {CAT_SHORT[term.category]}
        </div>
        {/* Diagram */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {DiagramComp ? <DiagramComp /> : (
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '28px', opacity: 0.3 }}>{CAT_ICONS[term.category]}</span>
            </div>
          )}
        </div>
        {/* Bottom fade into card body */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px', background: `linear-gradient(transparent, rgba(5,5,12,0.6))`, zIndex: 2, pointerEvents: 'none' }}/>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '14px 15px 14px 13px' }}>
        {/* Term name row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'rgba(255,255,255,0.95)', lineHeight: 1.22, flex: 1, letterSpacing: '-0.2px' }}>
            {term.term}
          </h3>
          {term.abbr && (
            <span style={{
              fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em',
              padding: '3px 8px', borderRadius: '7px', whiteSpace: 'nowrap', flexShrink: 0,
              background: `${color}16`, color, border: `1px solid ${color}32`,
              boxShadow: `0 0 8px ${color}14`,
            }}>
              {term.abbr}
            </span>
          )}
        </div>

        {/* Category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <span style={{
            display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
            background: color, boxShadow: `0 0 6px ${color}90`,
            animation: 'dot-pulse 3s ease-in-out infinite',
          }}/>
          <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.16em', color, textTransform: 'uppercase', opacity: 0.85 }}>
            {term.category}
          </span>
        </div>

        {/* Definition */}
        <p style={{
          fontSize: '12px', color: 'rgba(148,163,184,0.88)', lineHeight: 1.68,
          display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden',
          transition: 'all 0.2s ease',
        }}>
          {highlight ? hl(term.definition) : term.definition}
        </p>

        {/* Expand toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 9, gap: 6, alignItems: 'center' }}>
          <div style={{
            fontSize: '9.5px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: `${color}70`, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {expanded ? 'Less' : 'Details'}
            <span style={{
              display: 'inline-block',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
            }}>▾</span>
          </div>
        </div>

        {/* ── Expanded content ── */}
        {expanded && (
          <div className="expand-content" style={{ marginTop: 12, borderTop: `1px solid ${color}14`, paddingTop: 12 }}>
            {term.example && (
              <div style={{
                padding: '10px 12px', borderRadius: '12px', marginBottom: 10,
                background: `${color}08`, border: `1px solid ${color}18`,
                fontSize: '11.5px', color: 'rgba(148,163,184,0.85)', lineHeight: 1.65,
              }}>
                <span style={{
                  display: 'block', fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color, marginBottom: 6,
                }}>
                  Example
                </span>
                {term.example}
              </div>
            )}
            {term.related.length > 0 && (
              <div>
                <p style={{
                  fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: `${color}60`, marginBottom: 8,
                }}>Related Concepts</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {term.related.map(r => (
                    <button
                      key={r}
                      className="related-tag"
                      onClick={e => { e.stopPropagation(); onRelatedClick(r) }}
                      style={{
                        padding: '5px 11px', borderRadius: '9px',
                        fontSize: '10.5px', fontWeight: 700,
                        background: `${color}10`, color,
                        border: `1px solid ${color}28`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      {r} <span style={{ opacity: 0.7, fontSize: 9 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ val, label, color, icon }: { val: string; label: string; color: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'scale(0.88)'; el.style.opacity = '0'
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease'
      el.style.transform = 'scale(1)'; el.style.opacity = '1'
    })
  }, [])
  return (
    <div ref={ref} className="stat-card" style={{
      '--accent': color,
      borderRadius: '18px', padding: '22px 16px', textAlign: 'center',
      background: 'rgba(5,5,14,0.98)',
      border: `1px solid ${color}20`,
      position: 'relative', overflow: 'hidden',
    } as React.CSSProperties}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color}0e, transparent 70%)`, pointerEvents: 'none' }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '18px', marginBottom: 6 }}>{icon}</div>
        <p style={{
          fontWeight: 900, fontSize: '32px', lineHeight: 1, marginBottom: 6, color,
          textShadow: `0 0 30px ${color}60, 0 0 60px ${color}25`,
          fontVariantNumeric: 'tabular-nums',
        }}>{val}</p>
        <p style={{ fontSize: '9.5px', color: 'rgba(100,116,139,0.8)', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700 }}>{label}</p>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeLetter,   setActiveLetter]   = useState<string | null>(null)
  const [navShadow,      setNavShadow]      = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Scroll shadow on nav
  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const displayed = useMemo(() => {
    let list = query.trim().length >= 1 ? searchTerms(query.trim()) : TERMS
    if (activeCategory) list = list.filter(t => t.category === activeCategory)
    if (activeLetter)   list = list.filter(t => t.term.toUpperCase().startsWith(activeLetter))
    return list.sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory, activeLetter])

  const lettersWithTerms = useMemo(() => new Set(TERMS.map(t => t.term[0].toUpperCase())), [])

  function handleRelatedClick(name: string) {
    setQuery(name); setActiveCategory(null); setActiveLetter(null)
    searchRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() { setQuery(''); setActiveCategory(null); setActiveLetter(null) }
  const hasFilter = query || activeCategory || activeLetter

  return (
    <div style={{ minHeight: '100vh', background: '#04040a', color: 'white' }}>

      {/* ══ Navigation ══════════════════════════════════════════════════════════ */}
      <nav style={{
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        background: navShadow ? 'rgba(4,4,10,0.96)' : 'rgba(4,4,10,0.82)',
        backdropFilter: 'blur(24px)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: navShadow ? '0 1px 32px rgba(0,0,0,0.6)' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)',
              boxShadow: '0 0 12px rgba(245,158,11,0.1)',
            }}>📖</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.2em', color: 'white' }}>ICT GLOSSARY</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.45)' }}>by Chronic Trading</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.7)', fontWeight: 600 }}>{TERMS.length} concepts</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }}/>
            <div style={{
              fontSize: 9, fontWeight: 900, letterSpacing: '0.12em',
              padding: '4px 10px', borderRadius: 7,
              background: 'rgba(245,158,11,0.1)', color: 'rgba(245,158,11,0.8)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}>LIVE</div>
          </div>
        </div>
      </nav>

      {/* ══ Hero ════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '72px 20px 52px', textAlign: 'center', overflow: 'hidden' }}>
        <HeroBg />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 720, margin: '0 auto' }}>
          {/* Badge */}
          <div className="animate-glow" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            border: '1px solid rgba(245,158,11,0.28)',
            background: 'rgba(245,158,11,0.08)',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b, 0 0 16px #f59e0b80', display: 'inline-block' }}/>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.88)' }}>
              {TERMS.length} Concepts — Every one visualised
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontWeight: 900, lineHeight: 0.88,
            fontSize: 'clamp(38px, 8vw, 70px)',
            letterSpacing: 'clamp(-2px, -0.04em, -3.5px)',
            marginBottom: 18,
          }}>
            The <span className="gold-title">ICT&thinsp;/&thinsp;SMC</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>Glossary.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(148,163,184,0.82)', lineHeight: 1.7,
            fontSize: 'clamp(13px, 2vw, 15.5px)',
            maxWidth: 460, margin: '0 auto 36px',
          }}>
            Every concept defined, visualised with a custom diagram, and cross-linked.
            The complete reference for ICT and Smart Money Concepts.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto 28px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                color: query ? 'rgba(245,158,11,0.7)' : 'rgba(100,116,139,0.6)',
                fontSize: 15, pointerEvents: 'none', transition: 'color 0.2s',
              }}>
                {query ? '✦' : '⌕'}
              </span>
              <input
                ref={searchRef}
                className="search-input"
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveLetter(null) }}
                placeholder="Search terms, abbreviations, definitions…"
                style={{
                  width: '100%', padding: '15px 44px 15px 46px', borderRadius: 16,
                  fontSize: 14, color: 'white',
                  background: query ? 'rgba(8,8,18,0.98)' : 'rgba(6,6,14,0.9)',
                  border: `1.5px solid ${query ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.09)'}`,
                  boxShadow: query ? '0 0 0 3px rgba(245,158,11,0.07), 0 8px 32px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.35)',
                  transition: 'all 0.22s ease',
                  boxSizing: 'border-box',
                }}
                autoComplete="off" spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    color: 'rgba(148,163,184,0.5)', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '2px 4px',
                    borderRadius: 6, transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}
                >×</button>
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { n: TERMS.length,                           label: 'terms',    c: '#f59e0b' },
              { n: TERMS.length,                           label: 'diagrams', c: '#34d399' },
              { n: TERMS.filter(t=>t.example).length,      label: 'examples', c: '#60a5fa' },
              { n: CATEGORIES.length,                      label: 'categories', c: '#c084fc' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: s.c, textShadow: `0 0 16px ${s.c}60` }}>{s.n}</span>
                <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.6)', fontWeight: 600, letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Category Filters ════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 20px 16px', position: 'sticky', top: 52, zIndex: 40, background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
            {/* All */}
            <button
              className="cat-pill"
              onClick={() => setActiveCategory(null)}
              style={{
                padding: '7px 15px', borderRadius: 11, fontSize: 10, fontWeight: 900,
                letterSpacing: '0.06em', cursor: 'pointer',
                border: `1.5px solid ${!activeCategory ? 'rgba(245,158,11,0.55)' : 'rgba(255,255,255,0.07)'}`,
                background: !activeCategory ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.04)',
                color: !activeCategory ? '#f59e0b' : 'rgba(100,116,139,0.8)',
                boxShadow: !activeCategory ? '0 0 16px rgba(245,158,11,0.14)' : 'none',
                transition: 'all 0.18s ease',
              }}
            >
              All {TERMS.length}
            </button>

            {/* Category pills */}
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLORS[cat]
              const count = TERMS.filter(t => t.category === cat).length
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  className="cat-pill"
                  onClick={() => setActiveCategory(active ? null : cat)}
                  style={{
                    padding: '7px 14px', borderRadius: 11, fontSize: 10, fontWeight: 900,
                    letterSpacing: '0.06em', cursor: 'pointer',
                    border: `1.5px solid ${active ? `${color}55` : 'rgba(255,255,255,0.07)'}`,
                    background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
                    color: active ? color : 'rgba(100,116,139,0.8)',
                    boxShadow: active ? `0 0 18px ${color}18` : 'none',
                    transition: 'all 0.18s ease',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', background: color,
                    opacity: active ? 1 : 0.5, display: 'inline-block', flexShrink: 0,
                    boxShadow: active ? `0 0 6px ${color}` : 'none',
                  }}/>
                  {cat} <span style={{ opacity: 0.6, fontSize: 9 }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ A–Z ═════════════════════════════════════════════════════════════════ */}
      {!query && (
        <section style={{ padding: '14px 20px 6px' }}>
          <div style={{ maxWidth: 1020, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(100,116,139,0.4)', textTransform: 'uppercase', marginRight: 4 }}>Jump</span>
              {ALL_LETTERS.map(letter => {
                const has = lettersWithTerms.has(letter)
                const active = activeLetter === letter
                return (
                  <button
                    key={letter}
                    disabled={!has}
                    className={has ? 'letter-btn' : ''}
                    onClick={() => setActiveLetter(active ? null : letter)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, fontSize: 10, fontWeight: 900,
                      cursor: has ? 'pointer' : 'default',
                      border: active ? '1.5px solid rgba(245,158,11,0.55)' : has ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                      background: active ? 'rgba(245,158,11,0.15)' : has ? 'rgba(255,255,255,0.04)' : 'transparent',
                      color: active ? '#f59e0b' : has ? 'rgba(148,163,184,0.75)' : 'rgba(30,41,59,0.5)',
                      boxShadow: active ? '0 0 12px rgba(245,158,11,0.18)' : 'none',
                      transition: 'all 0.14s ease',
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ Results header ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '14px 20px 10px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, color: 'rgba(100,116,139,0.7)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: displayed.length > 0 ? '#34d399' : '#f87171', display: 'inline-block', boxShadow: displayed.length > 0 ? '0 0 6px #34d399' : '0 0 6px #f87171' }}/>
            {displayed.length} result{displayed.length !== 1 ? 's' : ''}
            {query && <><span style={{ opacity: 0.4 }}> · </span><span style={{ color: 'rgba(245,158,11,0.8)' }}>"{query}"</span></>}
            {activeCategory && <><span style={{ opacity: 0.4 }}> · </span><span style={{ color: CATEGORY_COLORS[activeCategory] }}>{activeCategory}</span></>}
            {activeLetter && <><span style={{ opacity: 0.4 }}> · </span><span style={{ color: 'rgba(245,158,11,0.8)' }}>"{activeLetter}…"</span></>}
          </p>
          {hasFilter && (
            <button
              onClick={clearFilters}
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                color: 'rgba(100,116,139,0.6)', background: 'none',
                cursor: 'pointer', padding: '4px 10px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(100,116,139,0.6)')}
            >
              Clear all ×
            </button>
          )}
        </div>
      </section>

      {/* ══ Term grid ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '4px 20px 96px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }} className="animate-fade-up">
              <div style={{ fontSize: 44, marginBottom: 16, filter: 'grayscale(0.5)', opacity: 0.6 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(100,116,139,0.7)', marginBottom: 6 }}>No terms match</p>
              <p style={{ fontSize: 12, color: 'rgba(30,41,59,0.8)' }}>Try a different search or clear your filters</p>
            </div>
          ) : (
            <div
              className="card-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 12,
                alignItems: 'start',
              }}
            >
              {displayed.map((term, i) => (
                <TermCard key={term.id} term={term} highlight={query} onRelatedClick={handleRelatedClick} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ Stats ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 20px 64px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.3)', padding: '32px 0 20px' }}>
            By the numbers
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard val={`${TERMS.length}`}                          label="Terms Defined"    color="#f59e0b" icon="📚" />
            <StatCard val={`${TERMS.length}`}                          label="Visual Diagrams"  color="#34d399" icon="🎨" />
            <StatCard val={`${CATEGORIES.length}`}                     label="Categories"       color="#60a5fa" icon="🏷️" />
            <StatCard val={`${TERMS.filter(t=>t.abbr).length}`}        label="Abbreviations"    color="#c084fc" icon="📝" />
            <StatCard val={`${TERMS.filter(t=>t.example).length}`}     label="With Examples"    color="#f472b6" icon="💡" />
            <StatCard val={`${TERMS.filter(t=>t.related.length>3).length}`} label="Deeply Linked" color="#14b8a6" icon="🔗" />
          </div>
        </div>
      </section>

      {/* ══ Footer ══════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '28px 20px 36px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>📖</div>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.4)' }}>ICT Glossary</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(245,158,11,0.3)', display: 'inline-block' }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(245,158,11,0.3)' }}>a Chronic Trading tool</span>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(30,41,59,0.9)', letterSpacing: '0.04em' }}>Definitions are educational only — not financial advice.</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            {CATEGORIES.slice(0,4).map(cat => (
              <span key={cat} style={{ fontSize: 8, color: `${CATEGORY_COLORS[cat]}40`, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {cat.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
