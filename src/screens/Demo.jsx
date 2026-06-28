import { useState, useEffect } from 'react'
import './Demo.css'

const PROTOTYPE_BASE = window.location.origin

const SCREEN_ROUTES = {
  home:      '/',
  reader:    '/reader/cardiology-3-2',
  search:    '/search',
  library:   '/library',
  elearning: '/textbook?tab=elearning',
}

function getIframeUrl(userType, access, screen, hideTips) {
  const route = SCREEN_ROUTES[screen] || '/'
  const sep = route.includes('?') ? '&' : '?'
  const params = new URLSearchParams({
    demo: 'true',
    userType,
    access,
    hideTips: hideTips ? 'true' : 'false',
  })
  return `${PROTOTYPE_BASE}${route}${sep}${params}`
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="demo-panel-section">
      <div className="demo-panel-label">{label}</div>
      {options.map(opt => (
        <label
          key={opt.value}
          className={`demo-option${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ display: 'none' }}
          />
          {opt.icon && (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: 'var(--text-secondary)', flexShrink: 0, marginTop: '1px' }}
            >
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

export default function Demo() {
  const [userType, setUserType] = useState('new')
  const [access, setAccess]     = useState('with')
  const [screen, setScreen]     = useState('home')
  const [hideTips, setHideTips] = useState(false)

  useEffect(() => {
    document.body.classList.add('demo-mode')
    return () => document.body.classList.remove('demo-mode')
  }, [])

  const iframeSrc = getIframeUrl(userType, access, screen, hideTips)

  // Mobile mode — full-screen iframe, no phone frame or panel
  if (hideTips) {
    return (
      <div className="demo-mobile-fullscreen">
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          className="demo-mobile-iframe"
          title="McMaster prototype"
        />
        <button
          className="demo-exit-mobile"
          onClick={() => setHideTips(false)}
          title="Back to demo controls"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
        </button>
      </div>
    )
  }

  return (
    <div className="demo-page">
      <div className="demo-phone-col">
        <div className="phone-frame">
          <div className="phone-screen-wrapper">
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              className="phone-screen"
              title="McMaster prototype"
            />
          </div>
        </div>
      </div>

      <div className="demo-panel-col">
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
            { value: 'without', label: 'Without subscription', sub: 'Limited' },
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
          <div
            className="demo-toggle-row"
            onClick={() => setHideTips(v => !v)}
            role="button"
          >
            <div>
              <div className="demo-toggle-label">Test on mobile</div>
              <div className="demo-toggle-sub">Full screen — share link with phone</div>
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
  )
}
