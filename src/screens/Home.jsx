import { useNavigate } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'
import { useSavedChapters } from '../hooks/useSavedChapters'
import { useOffline } from '../hooks/useOffline'

const SPECIALTY_ICONS = {
  'Cardiology':         { icon: 'cardiology',    color: '#7A003C' },
  'Neurology':          { icon: 'neurology',     color: '#185FA5' },
  'Endocrinology':      { icon: 'science',       color: '#0F6E56' },
  'Pulmonology':        { icon: 'air',           color: '#854F0B' },
  'Nephrology':         { icon: 'water_drop',    color: '#534AB7' },
  'Gastroenterology':   { icon: 'gastroenterology', color: '#185FA5' },
  'Rheumatology':       { icon: 'accessibility', color: '#7A003C' },
  'Infectious diseases':{ icon: 'coronavirus',   color: '#C0392B' },
}

const QUICK_SPECIALTIES = ['Cardiology', 'Neurology', 'Endocrinology', 'Pulmonology']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
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

function ElearningCard({ icon, title, meta, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '14px 12px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}
    >
      <span style={{ color: 'var(--interactive-primary)' }}>
        <span className="material-symbols-outlined icon-md">{icon}</span>
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
        {title}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {meta}
      </span>
    </button>
  )
}

function StatCard({ value, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px 8px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
        cursor: 'pointer', textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </button>
  )
}

function DiscoverSection({ navigate }) {
  return (
    <section>
      <SectionLabel>Discover</SectionLabel>
      <div style={{ display: 'flex', gap: '10px' }}>
        <ElearningCard
          icon="play_circle"
          title="Videos"
          meta="18 min avg"
          onClick={() => navigate('/video/v1')}
        />
        <ElearningCard
          icon="calculate"
          title="Calculators"
          meta="Clinical tools"
          onClick={() => navigate('/calculator/score2')}
        />
      </div>
    </section>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyHome({ navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Greeting */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '24px',
          color: 'var(--text-primary)', marginBottom: '6px',
        }}>
          {greeting()}
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-secondary)' }}>
          Welcome to McMaster Textbook
        </p>
      </div>

      {/* Featured card */}
      <button
        onClick={() => navigate('/textbook')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--bg-brand-subtle), white)',
          border: '1px solid rgba(122, 0, 60, 0.2)',
          borderRadius: 'var(--radius-xl)', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}
      >
        <span style={{ color: 'var(--interactive-primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>menu_book</span>
        </span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Start reading
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Browse 127 chapters across 20+ medical specialties
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--interactive-primary)' }}>
            Browse Textbook →
          </span>
        </div>
      </button>

      {/* Discover */}
      <DiscoverSection navigate={navigate} />

      {/* Quick access */}
      <section>
        <SectionLabel>Quick access</SectionLabel>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {QUICK_SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              style={{
                flexShrink: 0, height: '34px', padding: '0 14px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
                color: 'var(--text-secondary)', cursor: 'pointer',
                boxShadow: 'var(--shadow-box)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Filled state ──────────────────────────────────────────────────────────────

function FilledHome({ lastRead, saved, folders, navigate }) {
  const notesCount = saved.filter(s => s.note).length
  const specInfo = lastRead ? SPECIALTY_ICONS[lastRead.specialty] : null

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Greeting */}
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '22px',
        color: 'var(--text-primary)',
      }}>
        {greeting()}, back to work?
      </h1>

      {/* Continue reading */}
      {lastRead && (
        <button
          onClick={() => navigate(`/reader/${lastRead.chapterId}`)}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: 'var(--bg-brand-subtle)',
            border: '1.5px solid var(--interactive-primary)',
            borderRadius: 'var(--radius-xl)', padding: '20px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '28px', color: specInfo?.color || 'var(--interactive-primary)', flexShrink: 0 }}
          >
            {specInfo?.icon || 'book_2'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600, color: 'var(--text-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
              Continue reading
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              {lastRead.specialty}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {lastRead.title}
            </div>
          </div>
          <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-brand)', flexShrink: 0 }}>
            arrow_forward
          </span>
        </button>
      )}

      {/* Quick stats */}
      <section>
        <SectionLabel>My library</SectionLabel>
        <div style={{ display: 'flex', gap: '8px' }}>
          <StatCard value={saved.length} label="Saved" onClick={() => navigate('/library')} />
          <StatCard value={notesCount} label="Notes" onClick={() => navigate('/library')} />
          <StatCard value="5h 40m" label="Reading" onClick={() => navigate('/library')} />
        </div>
      </section>

      {/* Discover */}
      <DiscoverSection navigate={navigate} />

      {/* Quick access */}
      <section>
        <SectionLabel>Quick access</SectionLabel>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {QUICK_SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              style={{
                flexShrink: 0, height: '34px', padding: '0 14px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
                color: 'var(--text-secondary)', cursor: 'pointer',
                boxShadow: 'var(--shadow-box)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()
  const { lastRead } = useReadingHistory()
  const { saved, folders } = useSavedChapters()

  const hasHistory = !!lastRead || saved.length > 0

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>
      {hasHistory
        ? <FilledHome lastRead={lastRead} saved={saved} folders={folders} navigate={navigate} />
        : <EmptyHome navigate={navigate} />
      }
    </div>
  )
}
