import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_RESULTS_PRECISE = [
  { id: 'cardiology-3-2', type: 'chapter', title: 'Heart Failure', specialty: 'Cardiology', chapter: '3.2', readTime: '12 min' },
  { id: 'cardiology-3-1', type: 'chapter', title: 'Cardiac Diagnostics', specialty: 'Cardiology', chapter: '3.1', readTime: '8 min' },
  { id: 'cardiology-4-1', type: 'chapter', title: 'Arterial Hypertension', specialty: 'Cardiology', chapter: '4.1', readTime: '15 min' },
]

const MOCK_RESULTS_EXPLORE = [
  { id: 'cardiology-3-2', type: 'chapter', title: 'Heart Failure', specialty: 'Cardiology', chapter: '3.2', readTime: '12 min' },
  { id: 'cardiology-video-1', type: 'video', title: 'Cardiology — Overview', duration: '18 min' },
  { id: 'cardiology-calc-1', type: 'calculator', title: 'Cardiac Risk Calculator (SCORE2)' },
  { id: 'cardiology-3-1', type: 'chapter', title: 'Cardiac Diagnostics', specialty: 'Cardiology', chapter: '3.1', readTime: '8 min' },
]

const MOCK_SUGGESTIONS = ['Cardiology', 'Heart Failure', 'Hypertension', 'Neurology', 'Type 2 Diabetes']

const POPULAR_TOPICS = ['Cardiology', 'Neurology', 'Endocrinology', 'Pulmonology', 'Nephrology']

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSearchMode(query) {
  return query.trim().split(/\s+/).length <= 2 ? 'precise' : 'explore'
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]')
  } catch {
    return []
  }
}

function saveToHistory(query) {
  try {
    const history = getHistory()
    const updated = [query, ...history.filter(q => q !== query)].slice(0, 5)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  } catch {}
}

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: 'var(--text-primary)' }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

function describeResults(results) {
  const types = [...new Set(results.map(r => r.type))]
  const labels = { chapter: 'chapter', video: 'video', calculator: 'calculator' }
  return `${results.length} result${results.length === 1 ? '' : 's'} · ${types.map(t => labels[t]).join(', ')}`
}

// ── Type tag ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  chapter:    { label: 'CHAPTER',    bg: 'var(--bg-subtle)',        color: 'var(--text-secondary)' },
  video:      { label: 'VIDEO',      bg: 'var(--color-brand-100)',  color: 'var(--text-brand)'     },
  calculator: { label: 'CALCULATOR', bg: 'var(--color-neutral-100)',color: 'var(--text-secondary)' },
}

function TypeTag({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.chapter
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '10px',
      letterSpacing: '0.07em', padding: '3px 7px', borderRadius: '4px',
    }}>
      {cfg.label}
    </span>
  )
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function SearchBar({ query, onChange, onSearch, onClear, inputRef, focused, onFocus, onBlur }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim()) onSearch(query)
    if (e.key === 'Escape') { onClear(); inputRef.current?.blur() }
  }

  return (
    <div style={{ position: 'relative' }}>
      <span
        className="material-symbols-outlined icon-sm"
        style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: focused ? 'var(--interactive-primary)' : 'var(--text-tertiary)',
          pointerEvents: 'none',
        }}
      >
        search
      </span>

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search McMaster Textbook..."
        autoComplete="off"
        style={{
          width: '100%', height: '48px',
          padding: '0 44px',
          background: 'var(--bg-surface)',
          border: `1.5px solid ${focused ? 'var(--border-brand)' : 'var(--border-default)'}`,
          borderRadius: '28px',
          fontFamily: 'var(--font-ui)', fontSize: '16px',
          color: 'var(--text-primary)', outline: 'none',
          transition: 'border-color 0.15s',
          WebkitAppearance: 'none',
        }}
      />

      {query.length > 0 && (
        <button
          onMouseDown={e => { e.preventDefault(); onClear() }}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: '4px',
          }}
        >
          <span className="material-symbols-outlined icon-sm">close</span>
        </button>
      )}
    </div>
  )
}

// ── Result cards ──────────────────────────────────────────────────────────────

function PreciseCard({ result, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sygnet)', padding: '14px 16px',
        textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {result.specialty} · Chapter {result.chapter}
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          {result.readTime}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {result.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--interactive-primary)', fontWeight: 500 }}>
        Read
        <span className="material-symbols-outlined icon-sm">arrow_forward</span>
      </div>
    </button>
  )
}

function ExploreCard({ result, onClick }) {
  const meta = result.type === 'chapter' ? result.readTime : result.duration || null

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sygnet)', padding: '12px 16px',
        textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}
    >
      <TypeTag type={result.type} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.3, flex: 1 }}>
          {result.title}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)', flexShrink: 0 }}>
          {meta}
          <span className="material-symbols-outlined icon-sm">chevron_right</span>
        </span>
      </div>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Search() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [history, setHistory] = useState(getHistory)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [])

  const triggerSearch = useCallback((q) => {
    const trimmed = q.trim()
    if (!trimmed) return
    saveToHistory(trimmed)
    setHistory(getHistory())
    setQuery(trimmed)
    setSubmittedQuery(trimmed)
    setFocused(false)
    inputRef.current?.blur()
  }, [])

  function handleClear() {
    setQuery('')
    setSubmittedQuery('')
    inputRef.current?.focus()
  }

  const isTyping = focused && query.length > 0
  const hasResults = submittedQuery.length > 0 && !focused
  const mode = hasResults ? getSearchMode(submittedQuery) : null

  const suggestions = query
    ? MOCK_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : []

  const results = mode === 'precise' ? MOCK_RESULTS_PRECISE : MOCK_RESULTS_EXPLORE

  function handleResultClick(result) {
    if (result.type === 'chapter') navigate(`/reader/${result.id}`)
    else if (result.type === 'video') navigate(`/video/${result.id}`)
    else if (result.type === 'calculator') navigate(`/calculator/${result.id}`)
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }} onScroll={() => inputRef.current?.blur()}>

      {/* Sticky search bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '12px 16px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <SearchBar
          query={query}
          onChange={q => { setQuery(q); if (submittedQuery) setSubmittedQuery('') }}
          onSearch={triggerSearch}
          onClear={handleClear}
          inputRef={inputRef}
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />

        {/* Suggestions dropdown */}
        {isTyping && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', left: '16px', right: '16px', top: 'calc(100% - 4px)',
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-box)',
            overflow: 'hidden', zIndex: 20,
          }}>
            {suggestions.map((s, i) => (
              <button
                key={s}
                onMouseDown={e => { e.preventDefault(); triggerSearch(s) }}
                style={{
                  width: '100%', height: '44px', padding: '0 16px',
                  background: 'none', border: 'none',
                  borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                }}
              >
                <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)' }}>search</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)' }}>
                  {highlightMatch(s, query)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* IDLE */}
        {!hasResults && !isTyping && (
          <>
            {history.length > 0 && (
              <section>
                <SectionLabel>Recent searches</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {history.slice(0, 3).map(item => (
                    <button
                      key={item}
                      onClick={() => triggerSearch(item)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', height: '40px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0 4px', textAlign: 'left', borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)' }}>schedule</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)' }}>{item}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel>Popular topics</SectionLabel>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {POPULAR_TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => { setQuery(topic); triggerSearch(topic) }}
                    style={{
                      border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill-sm)',
                      padding: '6px 14px', background: 'var(--bg-surface)',
                      fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '14px',
                      color: 'var(--text-primary)', cursor: 'pointer',
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* TYPING — no suggestions */}
        {isTyping && suggestions.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', paddingTop: '24px' }}>
            No suggestions for "{query}"
          </p>
        )}

        {/* RESULTS PRECISE */}
        {hasResults && mode === 'precise' && (
          <section>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Results for: <strong style={{ color: 'var(--text-primary)' }}>{submittedQuery}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_RESULTS_PRECISE.map(r => (
                <PreciseCard key={r.id} result={r} onClick={() => handleResultClick(r)} />
              ))}
            </div>
          </section>
        )}

        {/* RESULTS EXPLORE */}
        {hasResults && mode === 'explore' && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '22px', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '4px' }}>
              {submittedQuery}
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              {describeResults(results)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map(r => (
                <ExploreCard key={r.id} result={r} onClick={() => handleResultClick(r)} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
      color: 'var(--text-secondary)', textTransform: 'uppercase',
      letterSpacing: '0.08em', marginBottom: '10px',
    }}>
      {children}
    </h3>
  )
}
