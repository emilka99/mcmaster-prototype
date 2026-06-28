import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'
import { useSavedChapters } from '../hooks/useSavedChapters'
import { OPEN_ACCESS_VIDEOS } from '../data/openAccessContent'

const SPECIALTY_ICONS = {
  'Cardiology':         { icon: 'cardiology',       color: '#7A003C' },
  'Neurology':          { icon: 'neurology',        color: '#185FA5' },
  'Endocrinology':      { icon: 'science',          color: '#0F6E56' },
  'Pulmonology':        { icon: 'air',              color: '#854F0B' },
  'Nephrology':         { icon: 'water_drop',       color: '#534AB7' },
  'Gastroenterology':   { icon: 'gastroenterology', color: '#185FA5' },
  'Rheumatology':       { icon: 'accessibility',    color: '#7A003C' },
  'Infectious diseases':{ icon: 'coronavirus',      color: '#C0392B' },
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

function QuickChips({ navigate }) {
  return (
    <section>
      <SectionLabel>Browse by specialty</SectionLabel>
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
  )
}

function OpenAccessSection({ navigate }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Open access
        </h3>
        <button
          onClick={() => navigate('/textbook?tab=elearning')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--interactive-primary)', fontWeight: 600 }}
        >
          See all
        </button>
      </div>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginLeft: 'calc(var(--spacing-6) * -1)', marginRight: 'calc(var(--spacing-6) * -1)', padding: '0 var(--spacing-6) 4px', scrollbarWidth: 'none' }}>
        {OPEN_ACCESS_VIDEOS.map(video => (
          <button
            key={video.id}
            onClick={() => navigate(`/video/${video.id}`)}
            style={{
              minWidth: '180px', maxWidth: '180px', flexShrink: 0,
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              height: '90px',
              background: video.thumbnailColor + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: video.thumbnailColor }}>play_circle</span>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--interactive-primary)', marginBottom: '4px' }}>
                {video.category}
              </span>
              <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {video.shortTitle}
              </p>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                {video.authors.join(', ')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

// ── Use case A: New user, no subscription ─────────────────────────────────────

function SubscriptionBanner({ navigate }) {
  return (
    <div style={{
      position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom))', left: '50%',
      transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '398px',
      background: '#7A003C', borderRadius: '12px',
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 4px 20px rgba(122,0,60,0.35)', zIndex: 90,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>menu_book</span>
      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
        Unlock the full textbook
      </span>
      <button
        onClick={() => navigate('/auth?tab=register')}
        style={{
          flexShrink: 0, height: '32px', padding: '0 14px',
          background: '#fff', color: '#7A003C',
          border: 'none', borderRadius: '16px',
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
        }}
      >
        Subscribe
      </button>
    </div>
  )
}

function NewNoSub({ navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '120px' }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {greeting()}
        </h1>
        <p className="onboarding-hint" style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Explore free e-learning content — or subscribe to unlock the full textbook.
        </p>
      </div>

      {/* Subscribe CTA — textbook teaser */}
      <div style={{
        background: 'linear-gradient(135deg, #7A003C 0%, #A0195A 100%)',
        borderRadius: 'var(--radius-xl)', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'rgba(255,255,255,0.9)' }}>menu_book</span>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
              McMaster Textbook
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: '#fff' }}>
              127 chapters · 20+ specialties
            </div>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}>
          Evidence-based clinical content written by McMaster experts. Updated continuously.
        </p>
        <button
          onClick={() => navigate('/reader/cardiology-3-2')}
          style={{
            height: '44px', background: '#fff', color: '#7A003C',
            border: 'none', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          Start reading
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>

      {/* Open access videos */}
      <OpenAccessSection navigate={navigate} />

      {/* Calculators */}
      <section>
        <SectionLabel>Free clinical calculators</SectionLabel>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'score2', label: 'SCORE2', sub: 'Cardiovascular risk' },
            { id: 'bmi',    label: 'BMI',    sub: 'Body mass index' },
            { id: 'hba1c',  label: 'HbA1c',  sub: 'Glucose control' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => navigate(`/calculator/${c.id}`)}
              style={{
                flex: 1, padding: '12px 8px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', color: 'var(--interactive-primary)', marginBottom: '3px' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'var(--text-secondary)' }}>{c.sub}</div>
            </button>
          ))}
        </div>
      </section>

      <QuickChips navigate={navigate} />
      <SubscriptionBanner navigate={navigate} />
    </div>
  )
}

// ── Use case B: New user, with subscription ───────────────────────────────────

function NewWithSub({ navigate }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {greeting()}
        </h1>
        <p className="onboarding-hint" style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Welcome to McMaster Textbook. Start exploring.
        </p>
      </div>

      {/* Start reading — featured card */}
      <button
        onClick={() => navigate('/reader/cardiology-3-2')}
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
            127 chapters across 20+ medical specialties, updated continuously.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--interactive-primary)' }}>
            Browse Textbook →
          </span>
        </div>
      </button>

      {/* E-learning */}
      <section>
        <SectionLabel>E-learning</SectionLabel>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { icon: 'play_circle', label: 'Videos', sub: '18 min avg', path: '/video/v1' },
            { icon: 'calculate',   label: 'Calculators', sub: 'Clinical tools', path: '/calculator/score2' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1, padding: '14px 12px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}
            >
              <span style={{ color: 'var(--interactive-primary)' }}>
                <span className="material-symbols-outlined icon-md">{item.icon}</span>
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>{item.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Open access videos */}
      <OpenAccessSection navigate={navigate} />

      <QuickChips navigate={navigate} />
    </div>
  )
}

// ── Use case C: Active user ───────────────────────────────────────────────────

function ActiveHome({ lastRead, saved, navigate }) {
  const notesCount = saved.filter(s => s.note).length
  const specInfo = lastRead ? SPECIALTY_ICONS[lastRead.specialty] : null

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '22px', color: 'var(--text-primary)' }}>
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
          <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-brand)', flexShrink: 0 }}>arrow_forward</span>
        </button>
      )}

      {/* Quick stats */}
      <section>
        <SectionLabel>My library</SectionLabel>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { value: saved.length, label: 'Saved' },
            { value: notesCount,   label: 'Notes' },
            { value: '5h 40m',     label: 'Reading' },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => navigate('/library')}
              style={{
                flex: 1, padding: '12px 8px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
                cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: 'var(--text-primary)' }}>
                {stat.value}
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Open access videos */}
      <OpenAccessSection navigate={navigate} />

      <QuickChips navigate={navigate} />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()
  const { lastRead } = useReadingHistory()
  const { saved } = useSavedChapters()
  const [hasSubscription] = useState(() => localStorage.getItem('hasSubscription') !== 'false')
  const isActive = !!lastRead || saved.length > 0

  if (isActive) {
    return <ActiveHome lastRead={lastRead} saved={saved} navigate={navigate} />
  }
  if (!hasSubscription) {
    return <NewNoSub navigate={navigate} />
  }
  return <NewWithSub navigate={navigate} />
}
