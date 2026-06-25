import { useNavigate } from 'react-router-dom'

const MOCK_USER = {
  name: 'Jan Kowalski',
  initials: 'JK',
  email: 'j.kowalski@uj.edu.pl',
  accessType: 'institutional',
  institution: 'Uniwersytet Jagielloński',
  subscriptionStatus: 'active',
  memberSince: '2024',
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 4.5C2 3.9 2.4 3.5 3 3.5H7L9 5.5H15C15.6 5.5 16 5.9 16 6.5V13.5C16 14.1 15.6 14.5 15 14.5H3C2.4 14.5 2 14.1 2 13.5V4.5Z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
)

const IconBookmark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 3H14C14.6 3 15 3.4 15 4V16L9 12.5L3 16V4C3 3.4 3.4 3 4 3Z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
)

const IconNote = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <line x1="5" y1="6.5" x2="13" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="12.5" x2="9" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M9 2C9 2 6.5 5 6.5 9s2.5 7 2.5 7M9 2c0 0 2.5 3 2.5 7S9 16 9 16"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2a5 5 0 0 0-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 0 0-5-5Z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    <path d="M7.5 14.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)

const IconCloud = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M13.5 13H4.5a3 3 0 1 1 .6-5.9A4 4 0 1 1 13.5 9v0a2.5 2.5 0 0 1 0 5v-1Z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
)

const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
    <line x1="2" y1="7.5" x2="16" y2="7.5" stroke="currentColor" strokeWidth="1.7"/>
    <rect x="4" y="10" width="3" height="1.5" rx="0.5" fill="currentColor"/>
  </svg>
)

const IconHelp = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M6.8 7a2.2 2.2 0 0 1 4.3.7c0 1.5-2.1 2-2.1 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <circle cx="9" cy="13" r="0.8" fill="currentColor"/>
  </svg>
)

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      fontSize: '11px',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '10px',
      paddingLeft: '4px',
    }}>
      {children}
    </h3>
  )
}

function ListCard({ children }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-box)',
      overflow: 'hidden',
      marginBottom: '28px',
    }}>
      {children}
    </div>
  )
}

function ListRow({ icon, label, value, isLast, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: '52px',
        padding: '0 16px',
        background: 'none',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
      }}
    >
      <span style={{ color: danger ? 'var(--color-error)' : 'var(--text-secondary)', flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        color: danger ? 'var(--color-error)' : 'var(--text-primary)',
      }}>
        {label}
      </span>
      {value && (
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-tertiary)',
          marginRight: '6px',
        }}>
          {value}
        </span>
      )}
      <span style={{ color: 'var(--text-tertiary)', fontSize: '16px', flexShrink: 0 }}>›</span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate()
  const user = MOCK_USER

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh' }}>

      {/* TopBar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '52px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-brand)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            width: '40px',
            flexShrink: 0,
          }}
        >
          <IconBack />
        </button>

        <span style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '16px',
          color: 'var(--text-primary)',
        }}>
          Profil
        </span>

        <div style={{ width: '40px' }} />
      </header>

      {/* Content */}
      <div style={{ padding: '0 16px 40px', paddingTop: '52px' }}>

        {/* Avatar + user info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '32px',
          paddingBottom: '32px',
          gap: '10px',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--interactive-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '24px',
            marginBottom: '4px',
            flexShrink: 0,
          }}>
            {user.initials}
          </div>

          <div style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '18px',
            color: 'var(--text-primary)',
          }}>
            {user.name}
          </div>

          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            {user.email}
          </div>

          {user.accessType === 'institutional' ? (
            <span style={{
              background: 'var(--bg-brand-subtle)',
              color: 'var(--text-brand)',
              borderRadius: 'var(--radius-pill-sm)',
              padding: '4px 12px',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 500,
              marginTop: '2px',
            }}>
              Dostęp instytucjonalny · {user.institution.split(' ')[1] || user.institution}
            </span>
          ) : (
            <span style={{
              background: '#f0faf7',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-pill-sm)',
              padding: '4px 12px',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 500,
              marginTop: '2px',
            }}>
              Subskrypcja aktywna
            </span>
          )}
        </div>

        <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '28px' }} />

        {/* Moje treści */}
        <SectionLabel>Moje treści</SectionLabel>
        <ListCard>
          <ListRow icon={<IconFolder />} label="Moje foldery" onClick={() => navigate('/')} />
          <ListRow icon={<IconBookmark />} label="Zapisane elementy" onClick={() => navigate('/')} />
          <ListRow icon={<IconNote />} label="Notatki" isLast onClick={() => navigate('/')} />
        </ListCard>

        {/* Ustawienia */}
        <SectionLabel>Ustawienia</SectionLabel>
        <ListCard>
          <ListRow
            icon={<IconGlobe />}
            label="Język interfejsu"
            value="Polski"
            onClick={() => console.log('język — NIE W MVP')}
          />
          <ListRow
            icon={<IconBell />}
            label="Powiadomienia"
            onClick={() => console.log('powiadomienia')}
          />
          <ListRow
            icon={<IconCloud />}
            label="Offline — zarządzaj"
            isLast
            onClick={() => navigate('/')}
          />
        </ListCard>

        {/* Konto */}
        <SectionLabel>Konto</SectionLabel>
        <ListCard>
          <ListRow
            icon={<IconCard />}
            label="Zarządzaj subskrypcją"
            onClick={() => console.log('→ web, poza aplikacją')}
          />
          <ListRow
            icon={<IconHelp />}
            label="Pomoc i wsparcie"
            isLast
            onClick={() => console.log('pomoc')}
          />
        </ListCard>

        {/* Wyloguj */}
        <button
          onClick={() => console.log('wyloguj')}
          style={{
            width: '100%',
            height: '48px',
            background: 'none',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--color-error)',
            cursor: 'pointer',
            marginBottom: '24px',
          }}
        >
          Wyloguj się
        </button>

        {/* Footer */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          padding: '0 0 16px',
        }}>
          McMaster Textbook · wersja 0.1.0
        </p>
      </div>
    </div>
  )
}
