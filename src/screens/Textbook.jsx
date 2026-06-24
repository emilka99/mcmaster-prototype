import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_SPECIALTIES = [
  {
    id: 'cardiology',
    name: 'Kardiologia',
    chapterCount: 24,
    icon: '❤️',
    topics: [
      {
        id: 'cardiology-heart-failure',
        name: 'Niewydolność serca',
        content: [
          { id: 'cardiology-3-2', type: 'chapter', title: 'Niewydolność serca', chapter: '3.2', readTime: '12 min' },
          { id: 'cardiology-video-1', type: 'video', title: 'Przegląd — Kardiologia', duration: '18 min' },
          { id: 'cardiology-calc-1', type: 'calculator', title: 'Kalkulator SCORE2' },
        ],
      },
      {
        id: 'cardiology-hypertension',
        name: 'Nadciśnienie tętnicze',
        content: [
          { id: 'cardiology-4-1', type: 'chapter', title: 'Nadciśnienie tętnicze', chapter: '4.1', readTime: '15 min' },
        ],
      },
    ],
  },
  {
    id: 'neurology',
    name: 'Neurologia',
    chapterCount: 18,
    icon: '🧠',
    topics: [
      {
        id: 'neurology-stroke',
        name: 'Udar mózgu',
        content: [
          { id: 'neurology-2-1', type: 'chapter', title: 'Udar niedokrwienny', chapter: '2.1', readTime: '20 min' },
          { id: 'neurology-2-2', type: 'chapter', title: 'Udar krwotoczny', chapter: '2.2', readTime: '14 min' },
        ],
      },
    ],
  },
  {
    id: 'endocrinology',
    name: 'Endokrynologia',
    chapterCount: 15,
    icon: '⚗️',
    topics: [
      {
        id: 'endocrinology-diabetes',
        name: 'Cukrzyca',
        content: [
          { id: 'endocrinology-1-1', type: 'chapter', title: 'Cukrzyca typu 2', chapter: '1.1', readTime: '18 min' },
          { id: 'endocrinology-calc-1', type: 'calculator', title: 'Kalkulator HbA1c' },
        ],
      },
    ],
  },
  {
    id: 'pulmonology',
    name: 'Pulmonologia',
    chapterCount: 12,
    icon: '🫁',
    topics: [
      {
        id: 'pulmonology-asthma',
        name: 'Astma',
        content: [
          { id: 'pulmonology-1-1', type: 'chapter', title: 'Astma oskrzelowa', chapter: '1.1', readTime: '10 min' },
        ],
      },
    ],
  },
]

// ── Type config ───────────────────────────────────────────────────────────────

const TYPE_META = {
  chapter:    { label: 'ROZDZIAŁ',   cta: 'Czytaj',   bg: 'var(--bg-surface)',       border: '1px solid var(--border-subtle)' },
  video:      { label: 'WIDEO',      cta: 'Oglądaj',  bg: 'var(--bg-brand-subtle)',  border: '1px solid rgba(122,0,60,0.25)' },
  calculator: { label: 'KALKULATOR', cta: 'Otwórz',   bg: 'var(--bg-subtle)',        border: '1px solid var(--border-subtle)' },
}

const TYPE_LABELS = { chapter: 'rozdział', video: 'wideo', calculator: 'kalkulator' }

// ── Transition hook ───────────────────────────────────────────────────────────

function useSlide(view) {
  const [visible, setVisible] = useState(false)
  const prevView = useRef(view)

  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    prevView.current = view
    return () => cancelAnimationFrame(t)
  }, [view])

  return visible
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6"/>
    <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

// ── Sub-components ────────────────────────────────────────────────────────────

function BackButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        fontSize: '15px',
        color: 'var(--text-brand)',
        padding: '0',
        marginBottom: '16px',
      }}
    >
      ← {label}
    </button>
  )
}

function SectionHeading({ title, sub }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '22px',
        color: 'var(--text-primary)',
        lineHeight: 1.2,
        marginBottom: '4px',
      }}>
        {title}
      </h1>
      {sub && (
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '11px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function SearchShortcut({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: '44px',
        padding: '0 14px 0 40px',
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border-default)',
        borderRadius: '28px',
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        color: 'var(--text-tertiary)',
        textAlign: 'left',
        cursor: 'pointer',
        marginBottom: '24px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={{ color: 'var(--text-tertiary)', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
        <IconSearch />
      </span>
      Szukaj w Textbook...
    </button>
  )
}

// ── Level 1: Specialties ──────────────────────────────────────────────────────

function SpecialtiesView({ onSelect, navigate }) {
  return (
    <>
      <SearchShortcut onClick={() => navigate('/search')} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
      }}>
        {MOCK_SPECIALTIES.map(specialty => (
          <button
            key={specialty.id}
            onClick={() => onSelect(specialty)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sygnet)',
              padding: '20px 16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '32px', lineHeight: 1 }}>{specialty.icon}</span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '15px',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              {specialty.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}>
              {specialty.chapterCount} rozdziałów
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

// ── Level 2: Topics ───────────────────────────────────────────────────────────

function TopicsView({ specialty, onBack, onSelect }) {
  function topicTypeSummary(content) {
    const types = [...new Set(content.map(c => c.type))]
    return types.map(t => TYPE_LABELS[t]).join(' · ')
  }

  return (
    <>
      <BackButton label="Textbook" onClick={onBack} />
      <SectionHeading
        title={specialty.name}
        sub={`${specialty.chapterCount} rozdziałów`}
      />

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-box)',
        overflow: 'hidden',
      }}>
        {specialty.topics.map((topic, i) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic)}
            style={{
              width: '100%',
              height: '64px',
              padding: '0 16px',
              background: 'none',
              border: 'none',
              borderBottom: i < specialty.topics.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--text-primary)',
                marginBottom: '3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {topic.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}>
                {topicTypeSummary(topic.content)}
              </div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '18px', flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>
    </>
  )
}

// ── Level 3: Content ──────────────────────────────────────────────────────────

function ContentView({ specialty, topic, onBack, navigate }) {
  function handleClick(item) {
    if (item.type === 'chapter') navigate(`/reader/${item.id}`)
    else if (item.type === 'video') console.log('video placeholder', item.id)
    else if (item.type === 'calculator') console.log('calculator placeholder', item.id)
  }

  return (
    <>
      <BackButton label={specialty.name} onClick={onBack} />
      <SectionHeading title={topic.name} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {topic.content.map(item => {
          const meta = TYPE_META[item.type]
          const timeLabel = item.readTime || item.duration || null

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              style={{
                width: '100%',
                background: meta.bg,
                border: meta.border,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sygnet)',
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '0.07em',
                  color: item.type === 'video' ? 'var(--text-brand)' : 'var(--text-secondary)',
                }}>
                  {meta.label}
                  {item.chapter ? ` · ${item.chapter}` : ''}
                </span>
                {timeLabel && (
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                  }}>
                    {timeLabel}
                  </span>
                )}
              </div>

              <div style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}>
                {item.title}
              </div>

              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                color: item.type === 'video' ? 'var(--text-brand)' : 'var(--interactive-primary)',
              }}>
                {meta.cta} →
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

// ── Animated wrapper ──────────────────────────────────────────────────────────

function SlidePane({ viewKey, children }) {
  const visible = useSlide(viewKey)
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
      }}
    >
      {children}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Textbook() {
  const navigate = useNavigate()
  const [view, setView] = useState('specialties')
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)

  function selectSpecialty(specialty) {
    setSelectedSpecialty(specialty)
    setView('topics')
  }

  function selectTopic(topic) {
    setSelectedTopic(topic)
    setView('content')
  }

  function goToSpecialties() {
    setView('specialties')
    setSelectedSpecialty(null)
    setSelectedTopic(null)
  }

  function goToTopics() {
    setView('topics')
    setSelectedTopic(null)
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%', padding: 'var(--spacing-4) var(--spacing-4) var(--spacing-6)' }}>

      {view === 'specialties' && (
        <SlidePane viewKey="specialties">
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '28px',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Textbook
          </h1>
          <SpecialtiesView onSelect={selectSpecialty} navigate={navigate} />
        </SlidePane>
      )}

      {view === 'topics' && selectedSpecialty && (
        <SlidePane viewKey={`topics-${selectedSpecialty.id}`}>
          <TopicsView
            specialty={selectedSpecialty}
            onBack={goToSpecialties}
            onSelect={selectTopic}
          />
        </SlidePane>
      )}

      {view === 'content' && selectedSpecialty && selectedTopic && (
        <SlidePane viewKey={`content-${selectedTopic.id}`}>
          <ContentView
            specialty={selectedSpecialty}
            topic={selectedTopic}
            onBack={goToTopics}
            navigate={navigate}
          />
        </SlidePane>
      )}

    </div>
  )
}
