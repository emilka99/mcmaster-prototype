import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const initials = user?.initials || user?.name?.substring(0, 2).toUpperCase() || '?'

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      zIndex: 100,
      height: '60px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    }}>
      <span
        onClick={() => navigate('/')}
        style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', letterSpacing: '-0.3px' }}
      >
        McMaster
      </span>

      <button
        onClick={() => navigate('/profile')}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--interactive-primary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {initials}
      </button>
    </header>
  )
}
