import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '56px',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '20px',
        color: 'var(--text-brand)',
        letterSpacing: '-0.01em',
      }}>
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
        JK
      </button>
    </header>
  )
}
