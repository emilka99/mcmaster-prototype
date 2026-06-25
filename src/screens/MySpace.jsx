import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_USER = {
  hasHistory: false,
  lastRead: null,
  // lastRead: { chapterId: 'cardiology-3-2', title: 'Kardiologia 3.2 — Niewydolność serca' },
  folders: [],
  // folders: [{ id: 1, name: 'Kardiologia', count: 12 }],
  savedItems: 0,
  notes: 0,
  readingMinutes: 0,
  offlineReady: false,
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconBook({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M5 6C5 6 10 5 16 9C22 5 27 6 27 6V25C27 25 22 24 16 28C10 24 5 25 5 25V6Z"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      <line x1="16" y1="9" x2="16" y2="28" stroke={color} strokeWidth="2.5"/>
    </svg>
  )
}

function IconSearch({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="12.5" y1="12.5" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconStack({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="13" width="16" height="3" rx="1" fill="currentColor"/>
      <rect x="2" y="8.5" width="16" height="3" rx="1" fill="currentColor"/>
      <rect x="2" y="4" width="16" height="3" rx="1" fill="currentColor"/>
    </svg>
  )
}

function IconWifiOff({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 5L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5.5 8.5C7 7.2 8.9 6.5 10 6.5C11.5 6.5 13.2 7 14.5 8"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 11C8.6 10.5 9.3 10.2 10 10.2C10.7 10.2 11.4 10.5 12 11"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function IconCheck({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M6.5 10L9 12.5L14 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconFolder({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 5C2 4.4 2.4 4 3 4H8L10 6H17C17.6 6 18 6.4 18 7V15C18 15.6 17.6 16 17 16H3C2.4 16 2 15.6 2 15V5Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

function IconBookmark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 3H15C15.6 3 16 3.4 16 4V18L10 14L4 18V4C4 3.4 4.4 3 5 3Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

function IconNote({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconClock({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M10 6V10.5L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPlay({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill="var(--interactive-primary)"/>
      <path d="M7 6L13 9L7 12V6Z" fill="white"/>
    </svg>
  )
}

function IconCalc({ size = 20 }) {
  return (
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
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMinutes(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PromoCard({ icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: '160px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-box)',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <span style={{ color: 'var(--interactive-primary)' }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontWeight: 600,
        fontSize: '14px',
        color: 'var(--text-primary)',
        lineHeight: 1.3,
      }}>
        {title}
      </span>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
      }}>
        {desc}
      </span>
    </button>
  )
}

function ResourceRow({ icon, label, value, isLast, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '52px',
        width: '100%',
        padding: '0 16px',
        background: 'none',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
        gap: '12px',
      }}
    >
      <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{icon}</span>
      <span style={{
        flex: 1,
        textAlign: 'left',
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        color: 'var(--text-primary)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginRight: '8px',
      }}>
        {value}
      </span>
      <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
    </button>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      {/* Hero illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <IconBook size={64} color="var(--interactive-primary)" />
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: '22px',
        lineHeight: 1.2,
        color: 'var(--text-primary)',
        textAlign: 'center',
        marginBottom: '12px',
      }}>
        Zacznij swoją przygodę z McMaster
      </h2>

      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '16px',
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        Przeglądaj podręcznik, zapisuj rozdziały i buduj własną bibliotekę wiedzy medycznej.
      </p>

      {/* Promo cards — horizontal scroll */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        marginLeft: 'calc(var(--spacing-6) * -1)',
        marginRight: 'calc(var(--spacing-6) * -1)',
        padding: '0 var(--spacing-6) 4px',
        scrollbarWidth: 'none',
        marginBottom: '24px',
      }}>
        <PromoCard
          icon={<IconSearch size={22} />}
          title="Szybkie wyszukiwanie"
          desc="Znajdź odpowiedź w kilka sekund"
          onClick={() => navigate('/search')}
        />
        <PromoCard
          icon={<IconStack size={22} />}
          title="Przeglądaj Textbook"
          desc="Kardiologia, neurologia i 20+ specjalności"
          onClick={() => navigate('/textbook')}
        />
        <PromoCard
          icon={<IconWifiOff size={22} />}
          title="Tryb offline"
          desc="Pobierz cały podręcznik na telefon"
          onClick={() => console.log('offline')}
        />
      </div>

      {/* E-learning section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Odkryj materiały edukacyjne
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => navigate('/video/v1')}
            style={{
              width: '100%', height: '60px', padding: '0 16px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
              <IconPlay size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                Wideo edukacyjne
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Kardiologia, neurologia i inne
              </div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
          </button>
          <button
            onClick={() => navigate('/calculator/score2')}
            style={{
              width: '100%', height: '60px', padding: '0 16px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
              <IconCalc size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                Kalkulatory kliniczne
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                SCORE2, BMI, HbA1c, eGFR i inne
              </div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
          </button>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={() => navigate('/textbook')}
        style={{
          width: '100%',
          height: '52px',
          background: 'var(--interactive-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer',
          letterSpacing: '0.01em',
        }}
      >
        Przeglądaj Textbook →
      </button>
    </div>
  )
}

// ── Filled State ──────────────────────────────────────────────────────────────

function FilledState({ user, navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Continue reading */}
      {user.lastRead && (
        <section>
          <button
            onClick={() => navigate(`/reader/${user.lastRead.chapterId}`)}
            style={{
              width: '100%',
              background: 'var(--bg-brand-subtle)',
              border: '1px solid var(--border-brand)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <IconPlay size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-brand)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '3px',
              }}>
                Kontynuuj czytanie
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '16px',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.lastRead.title}
              </div>
            </div>
            <span style={{ color: 'var(--text-brand)', fontSize: '18px', flexShrink: 0 }}>›</span>
          </button>
        </section>
      )}

      {/* Resources */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '11px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Moje zasoby
        </h3>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-box)',
          overflow: 'hidden',
        }}>
          <ResourceRow
            icon={<IconFolder />}
            label="Moje foldery"
            value={user.folders.length}
            onClick={() => console.log('→ foldery')}
          />
          <ResourceRow
            icon={<IconBookmark />}
            label="Zapisane elementy"
            value={user.savedItems}
            onClick={() => console.log('→ zapisane')}
          />
          <ResourceRow
            icon={<IconNote />}
            label="Notatki"
            value={user.notes}
            onClick={() => console.log('→ notatki')}
          />
          <ResourceRow
            icon={<IconClock />}
            label="Czas czytania"
            value={formatMinutes(user.readingMinutes)}
            isLast
            onClick={() => console.log('→ czas czytania')}
          />
        </div>
      </section>

      {/* Ostatnio używane */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Ostatnio używane
        </h3>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden',
        }}>
          <button
            onClick={() => navigate('/video/v1')}
            style={{
              width: '100%', height: '56px', padding: '0 16px',
              background: 'none', border: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
              <IconPlay size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Niewydolność serca — przegląd
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Wideo · Kardiologia
              </div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
          </button>
          <button
            onClick={() => navigate('/calculator/score2')}
            style={{
              width: '100%', height: '56px', padding: '0 16px',
              background: 'none', border: 'none', borderBottom: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
              <IconCalc size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                Kalkulator SCORE2
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Kalkulator · Kardiologia
              </div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
          </button>
        </div>
      </section>

      {/* Offline */}
      <OfflineCard ready={user.offlineReady} />
    </div>
  )
}

function OfflineCard({ ready }) {
  return (
    <section>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-box)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <span style={{ color: ready ? 'var(--color-success)' : 'var(--text-tertiary)', flexShrink: 0 }}>
          {ready ? <IconCheck size={22} /> : <IconWifiOff size={22} />}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-primary)',
            marginBottom: '2px',
          }}>
            {ready ? 'Textbook pobrany' : 'Pobierz Textbook na telefon'}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            {ready ? 'Ostatnia sync: dziś' : 'Dostęp bez internetu'}
          </div>
        </div>
        {!ready && (
          <button
            onClick={() => console.log('offline download')}
            style={{
              background: 'none',
              border: '1.5px solid var(--interactive-primary)',
              borderRadius: 'var(--radius-pill-sm)',
              color: 'var(--interactive-primary)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '13px',
              padding: '6px 14px',
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Pobierz
          </button>
        )}
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MySpace() {
  const navigate = useNavigate()
  const [mockHasHistory, setMockHasHistory] = useState(MOCK_USER.hasHistory)

  const user = {
    ...MOCK_USER,
    hasHistory: mockHasHistory,
    lastRead: mockHasHistory
      ? { chapterId: 'cardiology-3-2', title: 'Kardiologia 3.2 — Niewydolność serca' }
      : null,
    folders: mockHasHistory ? [{ id: 1, name: 'Kardiologia', count: 12 }] : [],
    savedItems: mockHasHistory ? 24 : 0,
    notes: mockHasHistory ? 7 : 0,
    readingMinutes: mockHasHistory ? 340 : 0,
    offlineReady: mockHasHistory ? false : false,
  }

  const isEmpty = !user.hasHistory && user.folders.length === 0

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>
      {isEmpty
        ? <EmptyState navigate={navigate} />
        : <FilledState user={user} navigate={navigate} />
      }

      {import.meta.env.DEV && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setMockHasHistory(v => !v)}
            style={{
              background: 'none',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 16px',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
            }}
          >
            DEV: przełącz stan ({mockHasHistory ? 'filled' : 'empty'})
          </button>
        </div>
      )}
    </div>
  )
}
