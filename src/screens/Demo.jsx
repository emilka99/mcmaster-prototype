import { useState } from 'react'

const PROTOTYPE_BASE = window.location.origin

const SCREEN_ROUTES = {
  home:      '/',
  reader:    '/reader/cardiology-3-2',
  search:    '/search',
  library:   '/library',
  elearning: '/textbook?tab=elearning',
}

function getIframeUrl(userType, access, screen, hideTips) {
  const params = new URLSearchParams({
    demo: 'true',
    userType,
    access,
    hideTips: hideTips ? 'true' : 'false',
    isLoggedIn: 'true',
  })
  const route = SCREEN_ROUTES[screen] || '/'
  const sep = route.includes('?') ? '&' : '?'
  return `${PROTOTYPE_BASE}${route}${sep}${params}`
}

// ── Demo panel ────────────────────────────────────────────────────────────────

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="demo-panel-section">
      <div className="demo-panel-label">{label}</div>
      {options.map(opt => (
        <label
          key={opt.value}
          className={`demo-option${value === opt.value ? ' active' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.icon && (
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-secondary)', flexShrink: 0 }}>
              {opt.icon}
            </span>
          )}
          <div>
            <div className="demo-option-label">{opt.label}</div>
            {opt.sub && <div className="demo-option-sub">{opt.sub}</div>}
          </div>
        </label>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Demo() {
  const [userType, setUserType] = useState('new')
  const [access, setAccess] = useState('with')
  const [screen, setScreen] = useState('home')
  const [hideTips, setHideTips] = useState(false)

  const iframeSrc = getIframeUrl(userType, access, screen, hideTips)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-app)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: 'var(--interactive-primary)' }}>
          McMaster
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-tertiary)' }}>
          / Demo
        </span>
      </div>

      <div className="demo-wrapper">
        {/* Phone frame */}
        <div className="phone-frame-wrapper">
          <div className="phone-frame">
            <div className="phone-notch" />
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              className="phone-screen"
              title="McMaster prototype"
            />
            <div className="phone-home-indicator" />
          </div>
        </div>

        {/* Panel */}
        <div className="demo-panel">
          <RadioGroup
            label="View as"
            name="userType"
            value={userType}
            onChange={setUserType}
            options={[
              { value: 'new',    label: 'New user',    sub: 'No history, no saved' },
              { value: 'active', label: 'Active user', sub: 'Has reading history & saved' },
            ]}
          />

          <RadioGroup
            label="Access"
            name="access"
            value={access}
            onChange={setAccess}
            options={[
              { value: 'with',    label: 'With subscription',    sub: 'Full access' },
              { value: 'without', label: 'Without subscription', sub: 'Limited — prompts to subscribe' },
            ]}
          />

          <RadioGroup
            label="Screen"
            name="screen"
            value={screen}
            onChange={setScreen}
            options={[
              { value: 'home',      label: 'Home',       icon: 'home' },
              { value: 'reader',    label: 'Reader',     icon: 'book_2' },
              { value: 'search',    label: 'Search',     icon: 'search' },
              { value: 'library',   label: 'Library',    icon: 'bookmark' },
              { value: 'elearning', label: 'E-learning', icon: 'play_circle' },
            ]}
          />

          {/* Mobile toggle */}
          <div className="demo-panel-section">
            <div className="demo-divider" />
            <div className="demo-toggle-row" onClick={() => setHideTips(v => !v)} role="button">
              <div>
                <div className="demo-toggle-label">Testing on mobile?</div>
                <div className="demo-toggle-sub">Hide all tips & dev helpers</div>
              </div>
              <div
                className={`demo-toggle${hideTips ? ' on' : ''}`}
                role="switch"
                aria-checked={hideTips}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .demo-wrapper {
          display: flex;
          gap: 32px;
          padding: 24px 20px;
          align-items: flex-start;
          max-width: 640px;
          margin: 0 auto;
        }

        .phone-frame-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-shrink: 0;
        }

        .phone-frame {
          width: 320px;
          height: 650px;
          border: 8px solid #1A1614;
          border-radius: 44px;
          overflow: hidden;
          position: relative;
          background: #1A1614;
          box-shadow:
            0 0 0 1px #333,
            0 24px 48px rgba(0,0,0,0.3);
        }

        .phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 28px;
          background: #1A1614;
          border-radius: 0 0 18px 18px;
          z-index: 10;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 36px;
        }

        .phone-home-indicator {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          z-index: 10;
        }

        .demo-panel {
          width: 220px;
          flex-shrink: 0;
        }

        .demo-panel-section {
          margin-bottom: 24px;
        }

        .demo-panel-label {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .demo-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .demo-option input[type="radio"] {
          display: none;
        }

        .demo-option.active {
          border-color: var(--interactive-primary);
          background: var(--bg-brand-subtle);
        }

        .demo-option-label {
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .demo-option-sub {
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 1px;
        }

        .demo-divider {
          border: none;
          border-top: 1px solid var(--border-subtle);
          margin-bottom: 16px;
        }

        .demo-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
        }

        .demo-toggle-label {
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .demo-toggle-sub {
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .demo-toggle {
          width: 44px;
          height: 26px;
          border-radius: 13px;
          background: var(--border-default);
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }

        .demo-toggle::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 3px;
          left: 3px;
          transition: transform 0.2s ease;
        }

        .demo-toggle.on {
          background: var(--interactive-primary);
        }

        .demo-toggle.on::after {
          transform: translateX(18px);
        }

        @media (max-width: 600px) {
          .demo-wrapper {
            flex-direction: column;
            align-items: center;
          }
          .demo-panel {
            width: 100%;
            max-width: 360px;
          }
        }
      `}</style>
    </div>
  )
}
