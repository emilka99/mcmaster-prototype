import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_RESULTS_PRECISE = [
  {
    id: 'cardiology-3-2', type: 'chapter',
    title: 'Heart Failure', specialty: 'Cardiology', chapter: '3.2', readTime: '12 min',
    matchContext: 'title', matchSnippet: null,
  },
  {
    id: 'cardiology-3-1', type: 'chapter',
    title: 'Cardiac Diagnostics', specialty: 'Cardiology', chapter: '3.1', readTime: '8 min',
    matchContext: 'heading', matchSnippet: null,
  },
  {
    id: 'cardiology-4-1', type: 'chapter',
    title: 'Arterial Hypertension', specialty: 'Cardiology', chapter: '4.1', readTime: '15 min',
    matchContext: 'text', matchSnippet: '...management of heart failure includes...',
  },
]

const MOCK_RESULTS_EXPLORE = [
  {
    id: 'cardiology-3-2', type: 'chapter',
    title: 'Heart Failure', specialty: 'Cardiology', chapter: '3.2', readTime: '12 min',
    matchContext: 'title', matchSnippet: null,
  },
  {
    id: 'cardiology-video-1', type: 'video',
    title: 'Cardiology — Overview', duration: '18 min',
    matchContext: 'category', matchSnippet: null,
  },
  {
    id: 'cardiology-calc-1', type: 'calculator',
    title: 'Cardiac Risk Calculator (SCORE2)',
    matchContext: 'title', matchSnippet: null,
  },
  {
    id: 'cardiology-3-1', type: 'chapter',
    title: 'Cardiac Diagnostics', specialty: 'Cardiology', chapter: '3.1', readTime: '8 min',
    matchContext: 'text', matchSnippet: '...cardiac diagnostics in heart failure include echo...',
  },
]

const MOCK_SUGGESTIONS = [
  { text: 'Cardiology', foundIn: 'both', count: 24 },
  { text: 'Heart failure', foundIn: 'textbook', count: 3 },
  { text: 'Heart failure — Overview', foundIn: 'elearning', count: 1 },
  { text: 'Hypertension', foundIn: 'both', count: 8 },
  { text: 'Diabetes type 2', foundIn: 'textbook', count: 5 },
  { text: 'Neurology', foundIn: 'textbook', count: 12 },
]

const POPULAR_TOPICS = ['Cardiology', 'Neurology', 'Endocrinology', 'Pulmonology', 'Nephrology']

const MATCH_CONTEXT_CONFIG = {
  title:    { label: 'Title match',  color: '#7A003C', bg: '#F9EEF3', icon: 'title' },
  heading:  { label: 'In heading',   color: '#185FA5', bg: '#E6F1FB', icon: 'format_h1' },
  category: { label: 'In category',  color: '#0F6E56', bg: '#E1F5EE', icon: 'label' },
  text:     { label: 'In full text', color: '#854F0B', bg: '#FAEEDA', icon: 'article' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSearchMode(query) {
  return query.trim().split(/\s+/).length <= 2 ? 'precise' : 'explore'
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('searchHistory') || '[]') } catch { return [] }
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

// ── Match context tag ─────────────────────────────────────────────────────────

function MatchTag({ matchContext, matchSnippet }) {
  const cfg = MATCH_CONTEXT_CONFIG[matchContext]
  if (!cfg) return null
  return (
    <div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        fontSize: '11px', fontWeight: 500, fontFamily: 'var(--font-ui)',
        padding: '2px 8px', borderRadius: '999px',
        color: cfg.color, background: cfg.bg,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>{cfg.icon}</span>
        {cfg.label}
      </span>
      {matchContext === 'text' && matchSnippet && (
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)',
          fontStyle: 'italic', marginTop: '5px', lineHeight: 1.5,
        }}>
          "{matchSnippet}"
        </p>
      )}
    </div>
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
        type="text"
        value={query}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search McMaster Textbook..."
        autoComplete="off"
        style={{
          width: '100%', height: '48px',
          padding: query.length > 0 ? '0 44px' : '0 44px 0 44px',
          background: 'var(--bg-surface)',
          border: `1.5px solid ${focused ? 'var(--border-brand)' : 'var(--border-default)'}`,
          borderRadius: '28px',
          fontFamily: 'var(--font-ui)', fontSize: '16px',
          color: 'var(--text-primary)', outline: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
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
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined icon-sm">close</span>
        </button>
      )}
    </div>
  )
}

// ── Filter bar ────────────────────────────────────────────────────────────────

function FilterBar({ filters, setFilters, showFilters, setShowFilters }) {
  return (
    <div style={{ padding: '0 16px 8px', borderBottom: '1px solid var(--border-subtle)' }}>

      {/* Quick chips */}
      <div style={{
        display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 0',
        scrollbarWidth: 'none', alignItems: 'center',
      }}>
        {[
          { value: 'all', label: 'All' },
          { value: 'textbook', label: 'Textbook' },
          { value: 'elearning', label: 'E-learning' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilters(f => ({ ...f, source: opt.value }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 12px', borderRadius: '999px', flexShrink: 0,
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
              whiteSpace: 'nowrap', cursor: 'pointer',
              background: filters.source === opt.value ? 'var(--interactive-primary)' : 'transparent',
              color: filters.source === opt.value ? '#fff' : 'var(--text-secondary)',
              borderColor: filters.source === opt.value ? 'var(--interactive-primary)' : 'var(--border-default)',
            }}
          >
            {opt.label}
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--border-default)', flexShrink: 0 }} />

        <button
          onClick={() => setShowFilters(f => !f)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 12px', borderRadius: '999px', flexShrink: 0,
            border: '1px solid var(--border-default)',
            fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
            whiteSpace: 'nowrap', cursor: 'pointer',
            background: showFilters ? 'var(--interactive-primary)' : 'transparent',
            color: showFilters ? '#fff' : 'var(--text-secondary)',
            borderColor: showFilters ? 'var(--interactive-primary)' : 'var(--border-default)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>tune</span>
          Filters {showFilters ? '▴' : '▾'}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div style={{ paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 500, fontFamily: 'var(--font-ui)',
              color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em',
              whiteSpace: 'nowrap', marginTop: '6px', minWidth: '54px',
            }}>
              Match in
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { value: 'all', label: 'All fields' },
                { value: 'title', label: 'Title' },
                { value: 'heading', label: 'Heading' },
                { value: 'category', label: 'Category' },
                { value: 'text', label: 'Full text' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(f => ({ ...f, matchIn: opt.value }))}
                  style={{
                    padding: '4px 12px', borderRadius: '999px', cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontSize: '12px',
                    border: '1px solid var(--border-default)',
                    background: filters.matchIn === opt.value ? 'var(--bg-brand-subtle)' : 'transparent',
                    color: filters.matchIn === opt.value ? 'var(--interactive-primary)' : 'var(--text-secondary)',
                    borderColor: filters.matchIn === opt.value ? 'var(--interactive-primary)' : 'var(--border-default)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 500, fontFamily: 'var(--font-ui)',
              color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em',
              whiteSpace: 'nowrap', marginTop: '6px', minWidth: '54px',
            }}>
              Sort by
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'newest', label: 'Newest first' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(f => ({ ...f, sortBy: opt.value }))}
                  style={{
                    padding: '4px 12px', borderRadius: '999px', cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontSize: '12px',
                    border: '1px solid var(--border-default)',
                    background: filters.sortBy === opt.value ? 'var(--bg-brand-subtle)' : 'transparent',
                    color: filters.sortBy === opt.value ? 'var(--interactive-primary)' : 'var(--text-secondary)',
                    borderColor: filters.sortBy === opt.value ? 'var(--interactive-primary)' : 'var(--border-default)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
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
      <div>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {result.specialty} · Chapter {result.chapter}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {result.title}
      </div>
      <MatchTag matchContext={result.matchContext} matchSnippet={result.matchSnippet} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--interactive-primary)', fontWeight: 500, marginTop: '2px' }}>
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
      <div>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {result.title}
        </span>
      </div>
      <MatchTag matchContext={result.matchContext} matchSnippet={result.matchSnippet} />
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
  const [filters, setFilters] = useState({ source: 'all', matchIn: 'all', sortBy: 'relevance' })
  const [showFilters, setShowFilters] = useState(false)

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
    setShowFilters(false)
    inputRef.current?.focus()
  }

  const isTyping = focused && query.length > 0
  const hasResults = submittedQuery.length > 0 && !focused
  const mode = hasResults ? getSearchMode(submittedQuery) : null

  const suggestions = query
    ? MOCK_SUGGESTIONS.filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
    : []

  const results = mode === 'precise' ? MOCK_RESULTS_PRECISE : MOCK_RESULTS_EXPLORE

  function handleResultClick(result) {
    if (result.type === 'chapter') navigate(`/reader/${result.id}`)
    else if (result.type === 'video') navigate(`/video/${result.id}`)
    else if (result.type === 'calculator') navigate(`/calculator/${result.id}`)
  }

  const SOURCE_COLORS = {
    textbook: { bg: 'var(--bg-brand-subtle)', color: 'var(--interactive-primary)' },
    elearning: { bg: '#E6F1FB', color: '#185FA5' },
    both: { bg: 'var(--bg-subtle)', color: 'var(--text-secondary)' },
  }

  const SOURCE_LABELS = {
    textbook: 'Textbook',
    elearning: 'E-learning',
    both: 'Textbook + E-learning',
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }} onScroll={() => inputRef.current?.blur()}>

      {/* Sticky search bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: hasResults ? 'none' : '1px solid var(--glass-border)',
      }}>
        <div style={{ padding: '12px 16px', position: 'relative' }}>
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
              {suggestions.map((s, i) => {
                const src = SOURCE_COLORS[s.foundIn] || SOURCE_COLORS.both
                return (
                  <button
                    key={s.text}
                    onMouseDown={e => { e.preventDefault(); triggerSearch(s.text) }}
                    style={{
                      width: '100%', height: '44px', padding: '0 16px',
                      background: 'none', border: 'none',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                    }}
                  >
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>search</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {highlightMatch(s.text, query)}
                    </span>
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-ui)', fontWeight: 500,
                      padding: '2px 7px', borderRadius: '999px', flexShrink: 0,
                      background: src.bg, color: src.color,
                    }}>
                      {SOURCE_LABELS[s.foundIn]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Filter bar — visible when typing or in results */}
        {(hasResults || isTyping) && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
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
