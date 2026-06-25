import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSavedChapters } from '../hooks/useSavedChapters'

const MOCK_USER = {
  hasHistory: false,
  readingMinutes: 0,
  offlineReady: false,
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
        minWidth: '160px', flexShrink: 0,
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '16px',
        boxShadow: 'var(--shadow-box)', textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}
    >
      <span style={{ color: 'var(--interactive-primary)' }}>
        <span className="material-symbols-outlined icon-md">{icon}</span>
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {title}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
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
        display: 'flex', alignItems: 'center', height: '52px', width: '100%',
        padding: '0 16px', background: 'none', border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer', gap: '12px',
      }}
    >
      <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-sm">{icon}</span>
      </span>
      <span style={{ flex: 1, textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
        {value}
      </span>
      <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-sm">chevron_right</span>
      </span>
    </button>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--interactive-primary)' }}>
        <span className="material-symbols-outlined icon-xl">book_2</span>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '22px',
        lineHeight: 1.2, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px',
      }}>
        Zacznij swoją przygodę z McMaster
      </h2>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '16px', lineHeight: 1.6,
        color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px',
      }}>
        Przeglądaj podręcznik, zapisuj rozdziały i buduj własną bibliotekę wiedzy medycznej.
      </p>

      {/* Promo cards */}
      <div style={{
        display: 'flex', gap: '12px', overflowX: 'auto',
        marginLeft: 'calc(var(--spacing-6) * -1)', marginRight: 'calc(var(--spacing-6) * -1)',
        padding: '0 var(--spacing-6) 4px', scrollbarWidth: 'none', marginBottom: '24px',
      }}>
        <PromoCard icon="search" title="Szybkie wyszukiwanie" desc="Znajdź odpowiedź w kilka sekund" onClick={() => navigate('/search')} />
        <PromoCard icon="menu_book" title="Przeglądaj Textbook" desc="Kardiologia, neurologia i 20+ specjalności" onClick={() => navigate('/textbook')} />
        <PromoCard icon="wifi_off" title="Tryb offline" desc="Pobierz cały podręcznik na telefon" onClick={() => console.log('offline')} />
      </div>

      {/* E-learning */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Odkryj materiały edukacyjne
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ElearningRow icon="play_circle" title="Wideo edukacyjne" subtitle="Kardiologia, neurologia i inne" onClick={() => navigate('/video/v1')} />
          <ElearningRow icon="calculate" title="Kalkulatory kliniczne" subtitle="SCORE2, BMI, HbA1c, eGFR i inne" onClick={() => navigate('/calculator/score2')} />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/textbook')}
        style={{
          width: '100%', height: '52px',
          background: 'var(--interactive-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
          cursor: 'pointer', letterSpacing: '0.01em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}
      >
        Przeglądaj Textbook
        <span className="material-symbols-outlined icon-sm">arrow_forward</span>
      </button>
    </div>
  )
}

function ElearningRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: '60px', padding: '0 16px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
      }}
    >
      <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-md">{icon}</span>
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>{subtitle}</div>
      </div>
      <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-sm">chevron_right</span>
      </span>
    </button>
  )
}

// ── Filled State ──────────────────────────────────────────────────────────────

function FilledState({ user, savedCount, foldersCount, notesCount, navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Continue reading */}
      {user.lastRead && (
        <section>
          <button
            onClick={() => navigate(`/reader/${user.lastRead.chapterId}`)}
            style={{
              width: '100%', background: 'var(--bg-brand-subtle)',
              border: '1px solid var(--border-brand)', borderRadius: 'var(--radius-lg)',
              padding: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '36px' }}>play_circle</span>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600, color: 'var(--text-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                Kontynuuj czytanie
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.lastRead.title}
              </div>
            </div>
            <span style={{ color: 'var(--text-brand)', flexShrink: 0 }}>
              <span className="material-symbols-outlined icon-sm">chevron_right</span>
            </span>
          </button>
        </section>
      )}

      {/* Resources */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Moje zasoby
        </h3>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
          <ResourceRow icon="folder" label="Moje foldery" value={foldersCount} onClick={() => navigate('/saved?tab=folders')} />
          <ResourceRow icon="bookmark" label="Zapisane elementy" value={savedCount} onClick={() => navigate('/saved')} />
          <ResourceRow icon="edit_note" label="Notatki" value={notesCount} onClick={() => navigate('/saved')} />
          <ResourceRow icon="schedule" label="Czas czytania" value={formatMinutes(user.readingMinutes)} isLast onClick={() => console.log('czas czytania')} />
        </div>
      </section>

      {/* Ostatnio używane */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Ostatnio używane
        </h3>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
          <ElearningListRow icon="play_circle" title="Niewydolność serca — przegląd" meta="Wideo · Kardiologia" onClick={() => navigate('/video/v1')} />
          <ElearningListRow icon="calculate" title="Kalkulator SCORE2" meta="Kalkulator · Kardiologia" isLast onClick={() => navigate('/calculator/score2')} />
        </div>
      </section>

      {/* Offline */}
      <OfflineCard ready={user.offlineReady} />
    </div>
  )
}

function ElearningListRow({ icon, title, meta, isLast, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: '56px', padding: '0 16px',
        background: 'none', border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
      }}
    >
      <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-sm">{icon}</span>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>{meta}</div>
      </div>
      <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
        <span className="material-symbols-outlined icon-sm">chevron_right</span>
      </span>
    </button>
  )
}

function OfflineCard({ ready }) {
  return (
    <section>
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-box)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <span style={{ color: ready ? 'var(--color-success)' : 'var(--text-tertiary)', flexShrink: 0 }}>
          <span className="material-symbols-outlined icon-md">{ready ? 'check_circle' : 'wifi_off'}</span>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {ready ? 'Textbook pobrany' : 'Pobierz Textbook na telefon'}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {ready ? 'Ostatnia sync: dziś' : 'Dostęp bez internetu'}
          </div>
        </div>
        {!ready && (
          <button
            onClick={() => console.log('offline download')}
            style={{
              background: 'none', border: '1.5px solid var(--interactive-primary)',
              borderRadius: 'var(--radius-pill-sm)', color: 'var(--interactive-primary)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
              padding: '6px 14px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            }}
          >
            Pobierz
          </button>
        )}
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MySpace() {
  const navigate = useNavigate()
  const [mockHasHistory, setMockHasHistory] = useState(MOCK_USER.hasHistory)
  const { saved, folders } = useSavedChapters()

  const savedWithNotes = saved.filter(s => s.note)

  const user = {
    ...MOCK_USER,
    hasHistory: mockHasHistory,
    lastRead: mockHasHistory
      ? { chapterId: 'cardiology-3-2', title: 'Kardiologia 3.2 — Niewydolność serca' }
      : null,
    readingMinutes: mockHasHistory ? 340 : 0,
    offlineReady: false,
  }

  const isEmpty = !user.hasHistory && saved.length === 0

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>
      {isEmpty
        ? <EmptyState navigate={navigate} />
        : <FilledState
            user={user}
            savedCount={saved.length}
            foldersCount={folders.length}
            notesCount={savedWithNotes.length}
            navigate={navigate}
          />
      }

      {import.meta.env.DEV && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setMockHasHistory(v => !v)}
            style={{
              background: 'none', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', padding: '8px 16px',
              fontFamily: 'var(--font-ui)', fontSize: '12px',
              color: 'var(--text-tertiary)', cursor: 'pointer',
            }}
          >
            DEV: przełącz stan ({mockHasHistory ? 'filled' : 'empty'})
          </button>
        </div>
      )}
    </div>
  )
}
