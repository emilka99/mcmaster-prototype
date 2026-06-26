import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSavedChapters } from '../hooks/useSavedChapters'
import { useOffline } from '../hooks/useOffline'

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
        Start your McMaster journey
      </h2>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '16px', lineHeight: 1.6,
        color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px',
      }}>
        Browse the textbook, save chapters and build your personal medical library.
      </p>

      {/* Promo cards */}
      <div style={{
        display: 'flex', gap: '12px', overflowX: 'auto',
        marginLeft: 'calc(var(--spacing-6) * -1)', marginRight: 'calc(var(--spacing-6) * -1)',
        padding: '0 var(--spacing-6) 4px', scrollbarWidth: 'none', marginBottom: '24px',
      }}>
        <PromoCard icon="search" title="Quick search" desc="Find answers in seconds" onClick={() => navigate('/search')} />
        <PromoCard icon="menu_book" title="Browse Textbook" desc="Cardiology, neurology and 20+ specialties" onClick={() => navigate('/textbook')} />
        <PromoCard icon="wifi_off" title="Offline mode" desc="Download the full textbook to your device" onClick={() => navigate('/offline')} />
      </div>

      {/* E-learning */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Explore learning materials
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ElearningRow icon="play_circle" title="Educational videos" subtitle="Cardiology, neurology and more" onClick={() => navigate('/video/v1')} />
          <ElearningRow icon="calculate" title="Clinical calculators" subtitle="SCORE2, BMI, HbA1c, eGFR and more" onClick={() => navigate('/calculator/score2')} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          Browse Textbook
          <span className="material-symbols-outlined icon-sm">arrow_forward</span>
        </button>
        <button
          onClick={() => navigate('/auth')}
          style={{
            width: '100%', height: '52px',
            background: 'none', color: 'var(--interactive-primary)',
            border: '1.5px solid var(--interactive-primary)', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span className="material-symbols-outlined icon-sm">login</span>
          Log in
        </button>
      </div>
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
                Continue reading
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
          My library
        </h3>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
          <ResourceRow icon="folder" label="My folders" value={foldersCount} onClick={() => navigate('/saved?tab=folders')} />
          <ResourceRow icon="bookmark" label="Saved items" value={savedCount} onClick={() => navigate('/saved')} />
          <ResourceRow icon="edit_note" label="Notes" value={notesCount} onClick={() => navigate('/saved')} />
          <ResourceRow icon="schedule" label="Reading time" value={formatMinutes(user.readingMinutes)} isLast onClick={() => console.log('reading time')} />
        </div>
      </section>

      {/* Ostatnio używane */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Recently used
        </h3>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
          <ElearningListRow icon="play_circle" title="Heart Failure — Overview" meta="Video · Cardiology" onClick={() => navigate('/video/v1')} />
          <ElearningListRow icon="calculate" title="SCORE2 Calculator" meta="Calculator · Cardiology" isLast onClick={() => navigate('/calculator/score2')} />
        </div>
      </section>

      {/* Offline */}
      <OfflineCard navigate={navigate} />
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

function OfflineCard({ navigate }) {
  const { isDownloaded, offlineState } = useOffline()
  const { syncStatus, totalSizeMB, lastSync } = offlineState

  const isOutdated = syncStatus === 'outdated'
  const isOk = isDownloaded && !isOutdated

  let bg = 'var(--bg-subtle)'
  let icon = 'wifi_off'
  let iconColor = 'var(--text-tertiary)'
  let title = 'Download Textbook offline'
  let sub = 'Read without internet — 487 MB'
  let btnLabel = 'Download'

  if (isOutdated) {
    bg = 'var(--color-background-warning, #FFFBEB)'
    icon = 'sync_problem'
    iconColor = 'var(--color-text-warning, #B45309)'
    title = 'Content may be outdated'
    sub = lastSync ? `Last synced: ${new Date(lastSync).toLocaleDateString('en-GB')}` : ''
    btnLabel = 'Update'
  } else if (isOk) {
    bg = 'var(--color-background-success, #F0FDF4)'
    icon = 'check_circle'
    iconColor = 'var(--color-text-success, #15803D)'
    title = 'Offline ready'
    sub = `${totalSizeMB} MB · ${lastSync ? new Date(lastSync).toLocaleDateString('en-GB') : ''}`
    btnLabel = 'Manage'
  }

  return (
    <section>
      <div style={{
        background: bg, border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span className={`material-symbols-outlined icon-md${isOk ? ' filled' : ''}`} style={{ color: iconColor, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {title}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {sub}
          </div>
        </div>
        <button
          onClick={() => navigate('/offline')}
          style={{
            background: 'none', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-pill-sm)',
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '12px',
            color: 'var(--text-secondary)',
            padding: '6px 14px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {btnLabel}
        </button>
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
      ? { chapterId: 'cardiology-3-2', title: 'Cardiology 3.2 — Heart Failure' }
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
            DEV: toggle state ({mockHasHistory ? 'filled' : 'empty'})
          </button>
        </div>
      )}
    </div>
  )
}
