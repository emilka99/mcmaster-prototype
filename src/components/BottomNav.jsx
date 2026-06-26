import { useNavigate, useLocation } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'

const NAV_ITEMS = [
  { path: '/',         label: 'My Space', icon: 'grid_view' },
  { path: '/search',  label: 'Search',   icon: 'search' },
  { path: '/textbook',label: 'Textbook', icon: 'menu_book' },
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
          color: '#fff',
        }}
        aria-label="Continue reading"
      >
        <span className="material-symbols-outlined icon-md">book_2</span>
      </button>

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
