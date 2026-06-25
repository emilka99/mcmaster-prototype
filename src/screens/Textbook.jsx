import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_SPECIALTIES = [
  {
    id: 'cardiology',
    name: 'Kardiologia',
    chapterCount: 24,
    icon: 'cardiology',
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
    icon: 'neurology',
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
    icon: 'endocrinology',
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
    icon: 'pulmonology',
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

// ── Specialty icons ───────────────────────────────────────────────────────────

const SpecialtyIcons = {
  cardiology: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 24S3 17 3 10a6 6 0 0 1 11-3.3A6 6 0 0 1 25 10c0 7-11 14-11 14Z"
        stroke="var(--interactive-primary)" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M8 12h3l2-4 2 8 2-4h3" stroke="var(--interactive-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  neurology: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="12" r="7" stroke="var(--interactive-primary)" strokeWidth="2"/>
      <path d="M14 19v6M10 23h8" stroke="var(--interactive-primary)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 9c0-2 2-3 4-2M14 7v2M18 10c0 2-1.5 3-4 3" stroke="var(--interactive-primary)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  endocrinology: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="5" ry="8" stroke="var(--interactive-primary)" strokeWidth="2"/>
      <path d="M9 14h10M14 6V4M14 24v-2" stroke="var(--interactive-primary)" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2" fill="var(--interactive-primary)"/>
    </svg>
  ),
  pulmonology: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 5v10M14 5C14 5 8 6 7 10c-1.5 5 1 9 4 10M14 5c0 0 6 1 7 5 1.5 5-1 9-4 10"
        stroke="var(--interactive-primary)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 15c-2 1-3 4-2 6M21 15c2 1 3 4 2 6" stroke="var(--interactive-primary)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
}

// ── Type config ───────────────────────────────────────────────────────────────

const TYPE_META = {
  chapter:    { label: 'ROZDZIAŁ',   cta: 'Czytaj',   bg: 'var(--bg-surface)',       border: '1px solid var(--border-subtle)' },
  video:      { label: 'WIDEO',      cta: 'Oglądaj',  bg: 'var(--bg-brand-subtle)',  border: '1px solid rgba(122,0,60,0.25)' },
  calculator: { label: 'KALKULATOR', cta: 'Otwórz',   bg: 'var(--bg-subtle)',        border: '1px solid var(--border-subtle)' },
}

const TYPE_LABELS = { chapter: 'rozdział', video: 'wideo', calculator: 'kalkulator' }

// ── Transition hook ───────────────────────────────────────────────────────────

function useSlide(view) {
  const [visible, setVisible] = useState(true)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    setVisible(false)
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
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
      <SpecialtiesViewOnly onSelect={onSelect} />
    </>
  )
}

function SpecialtiesViewOnly({ onSelect }) {
  return (
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
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
              {SpecialtyIcons[specialty.icon] ? SpecialtyIcons[specialty.icon]() : null}
            </span>
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
    else if (item.type === 'video') navigate(`/video/${item.id}`)
    else if (item.type === 'calculator') navigate(`/calculator/${item.id}`)
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

// ── E-learning data ───────────────────────────────────────────────────────────

const MOCK_VIDEOS = [
  { id: 'v1', title: 'Niewydolność serca — przegląd', specialty: 'Kardiologia', duration: '18 min', color: '#7A003C' },
  { id: 'v2', title: 'Udar mózgu — diagnostyka', specialty: 'Neurologia', duration: '24 min', color: '#185FA5' },
  { id: 'v3', title: 'Cukrzyca typu 2', specialty: 'Endokrynologia', duration: '15 min', color: '#0F6E56' },
  { id: 'v4', title: 'Astma oskrzelowa', specialty: 'Pulmonologia', duration: '12 min', color: '#854F0B' },
]

const MOCK_CALCULATORS = [
  { id: 'score2', title: 'Kalkulator ryzyka sercowego', subtitle: 'SCORE2 — ryzyko 10-letnie', specialty: 'Kardiologia' },
  { id: 'hba1c', title: 'Przelicznik HbA1c', subtitle: 'mmol/mol ↔ %', specialty: 'Endokrynologia' },
  { id: 'bmi', title: 'Kalkulator BMI', subtitle: 'Body Mass Index + interpretacja', specialty: 'Ogólne' },
  { id: 'gfr', title: 'Kalkulator eGFR', subtitle: 'CKD-EPI — funkcja nerek', specialty: 'Nefrologia' },
]

const IconPlay = ({ size = 28, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" fill={color} fillOpacity="0.15"/>
    <path d="M11 9.5L20 14L11 18.5V9.5Z" fill={color}/>
  </svg>
)

const IconCalc = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <rect x="5.5" y="4.5" width="9" height="3" rx="1" fill="currentColor" opacity="0.5"/>
    <circle cx="6.5" cy="11" r="1" fill="currentColor"/>
    <circle cx="10" cy="11" r="1" fill="currentColor"/>
    <circle cx="13.5" cy="11" r="1" fill="currentColor"/>
    <circle cx="6.5" cy="14.5" r="1" fill="currentColor"/>
    <circle cx="10" cy="14.5" r="1" fill="currentColor"/>
    <circle cx="13.5" cy="14.5" r="1" fill="currentColor"/>
  </svg>
)

function ELearningView({ navigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Wideo */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>
          Wideo
        </h3>
        <div style={{
          display: 'flex', gap: '12px', overflowX: 'auto',
          marginLeft: '-16px', marginRight: '-16px',
          paddingLeft: '16px', paddingRight: '16px',
          paddingBottom: '4px', scrollbarWidth: 'none',
        }}>
          {MOCK_VIDEOS.map(v => (
            <button
              key={v.id}
              onClick={() => navigate(`/video/${v.id}`)}
              style={{
                width: '200px', flexShrink: 0, background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', cursor: 'pointer', textAlign: 'left', padding: 0,
              }}
            >
              <div style={{
                height: '112px', background: v.color + '26',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconPlay size={36} color={v.color} />
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
                  color: 'var(--text-primary)', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', marginBottom: '6px',
                }}>
                  {v.title}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {v.specialty} · {v.duration}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Kalkulatory */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>
          Kalkulatory
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MOCK_CALCULATORS.map(c => (
            <button
              key={c.id}
              onClick={() => navigate(`/calculator/${c.id}`)}
              style={{
                width: '100%', height: '64px', padding: '0 16px',
                background: 'var(--bg-surface)', border: 'none',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
                textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
                <IconCalc size={20} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
                  color: 'var(--text-primary)', lineHeight: 1.2,
                }}>
                  {c.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)',
                }}>
                  {c.specialty} · {c.subtitle}
                </div>
              </div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '18px' }}>›</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function Tabs({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '20px',
      marginLeft: '-16px',
      marginRight: '-16px',
    }}>
      {[
        { id: 'textbook', label: 'Textbook' },
        { id: 'elearning', label: 'E-learning' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            height: '40px',
            background: 'none',
            border: 'none',
            borderBottom: active === tab.id ? '2px solid var(--interactive-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontWeight: active === tab.id ? 600 : 400,
            fontSize: '14px',
            color: active === tab.id ? 'var(--text-brand)' : 'var(--text-secondary)',
            transition: 'color 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Textbook() {
  const navigate = useNavigate()
  const [view, setView] = useState('specialties')
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [tab, setTab] = useState('textbook')

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
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Textbook
          </h1>
          <SearchShortcut onClick={() => navigate('/search')} />
          <Tabs active={tab} onChange={t => { setTab(t); setView('specialties') }} />
          {tab === 'textbook'
            ? <SpecialtiesViewOnly onSelect={selectSpecialty} />
            : <ELearningView navigate={navigate} />
          }
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
