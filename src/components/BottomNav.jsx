import { useNavigate, useLocation } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'

const IconGrid = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="12" y="2" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="2" y="12" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="12" y="12" width="8" height="8" rx="1.5" fill="currentColor"/>
  </svg>
)

const IconSearch = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="9.5" cy="9.5" r="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="14" y1="14" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const IconBook = ({ white }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M4 5C4 5 8 4 13 7C18 4 22 5 22 5V20C22 20 18 19 13 22C8 19 4 20 4 20V5Z"
      stroke={white ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinejoin="round"/>
    <line x1="13" y1="7" x2="13" y2="22" stroke={white ? '#fff' : 'currentColor'} strokeWidth="2"/>
  </svg>
)

const IconStack = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="15" width="16" height="3" rx="1" fill="currentColor"/>
    <rect x="3" y="9.5" width="16" height="3" rx="1" fill="currentColor"/>
    <rect x="3" y="4" width="16" height="3" rx="1" fill="currentColor"/>
  </svg>
)

const NAV_ITEMS = [
  { path: '/',         label: 'My Space', Icon: IconGrid },
  { path: '/search',  label: 'Szukaj',   Icon: IconSearch },
  { path: '/textbook',label: 'Textbook', Icon: IconStack },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lastRead } = useReadingHistory()

  function handleFAB() {
    if (lastRead) {
      navigate(`/reader/${lastRead.chapterId}`)
    } else {
      navigate('/textbook')
    }
  }

  function isActive(path) {
    return pathname === path
  }

  const [left, right] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      zIndex: 100,
      height: '64px',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
      {/* Left two items */}
      {left.map(({ path, label, Icon }) => (
        <NavItem
          key={path}
          label={label}
          active={isActive(path)}
          onClick={() => navigate(path)}
        >
          <Icon />
        </NavItem>
      ))}

      {/* FAB */}
      <button
        onClick={handleFAB}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--interactive-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-16px',
          flexShrink: 0,
          boxShadow: '0 4px 16px rgba(122, 0, 60, 0.35)',
        }}
        aria-label="Continue reading"
      >
        <IconBook white />
      </button>

      {/* Right item */}
      {right.map(({ path, label, Icon }) => (
        <NavItem
          key={path}
          label={label}
          active={isActive(path)}
          onClick={() => navigate(path)}
        >
          <Icon />
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
        padding: '6px 12px',
        position: 'relative',
        minWidth: '60px',
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
