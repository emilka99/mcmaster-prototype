import { useNavigate, useLocation } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'

const NAV_ITEMS = [
  { path: '/',         label: 'Home',     icon: 'home' },
  { path: '/search',  label: 'Search',   icon: 'search' },
  { path: '/library', label: 'Library',  icon: 'bookmark' },
  { path: '/textbook',label: 'Textbook', icon: 'menu_book' },
]

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

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lastRead } = useReadingHistory()

  function isActive(path) {
    return pathname === path
  }

  const [left, right] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)]

  const specInfo = lastRead ? SPECIALTY_ICONS[lastRead.specialty] : null
  const fabTitle = lastRead
    ? (lastRead.title.length > 14 ? lastRead.title.slice(0, 14) + '…' : lastRead.title)
    : null

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      alignItems: 'flex-end',
      padding: '8px 0 calc(10px + env(safe-area-inset-bottom))',
    }}>
      {left.map(({ path, label, icon }) => (
        <NavItem
          key={path}
          label={label}
          active={isActive(path)}
          onClick={() => navigate(path)}
        >
          <span className="material-symbols-outlined icon-md">{icon}</span>
        </NavItem>
      ))}

      {/* FAB column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        {!lastRead ? (
          <button
            onClick={() => navigate('/textbook')}
            aria-label="Browse textbook"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--interactive-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-16px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(122, 0, 60, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>book_2</span>
          </button>
        ) : (
          <button
            onClick={() => navigate(`/reader/${lastRead.chapterId}`)}
            aria-label={`Continue reading ${lastRead.title}`}
            style={{
              height: '44px',
              borderRadius: '22px',
              padding: '0 14px 0 10px',
              gap: '6px',
              maxWidth: '140px',
              background: 'var(--interactive-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginTop: '-16px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(122, 0, 60, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px', flexShrink: 0, color: specInfo?.color || 'white' }}
            >
              {specInfo?.icon || 'book_2'}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'white',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {fabTitle}
            </span>
          </button>
        )}
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          color: 'var(--nav-inactive)',
          marginTop: '2px',
          textAlign: 'center',
        }}>
          {lastRead ? 'Continue' : 'Read'}
        </span>
      </div>

      {right.map(({ path, label, icon }) => (
        <NavItem
          key={path}
          label={label}
          active={isActive(path)}
          onClick={() => navigate(path)}
        >
          <span className="material-symbols-outlined icon-md">{icon}</span>
        </NavItem>
      ))}
    </nav>
  )
}

function NavItem({ label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        color: active ? 'var(--nav-active)' : 'var(--nav-inactive)',
        padding: '4px 0',
        position: 'relative',
      }}
    >
      {active && (
        <span style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'var(--nav-active)',
        }} />
      )}
      {children}
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        fontWeight: active ? 600 : 400,
        lineHeight: 1,
      }}>
        {label}
      </span>
    </button>
  )
}
