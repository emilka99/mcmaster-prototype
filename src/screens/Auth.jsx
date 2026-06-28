import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const COUNTRIES = [
  'Poland', 'Germany', 'United Kingdom', 'France', 'Netherlands',
  'Sweden', 'Norway', 'Denmark', 'Austria', 'Switzerland',
  'Spain', 'Italy', 'Portugal', 'Belgium', 'Czech Republic',
  'Hungary', 'Romania', 'Croatia', 'Ukraine', 'United States',
  'Canada', 'Australia',
]

const PROFESSIONAL_STATUSES = [
  'Physician',
  'Nurse practitioner/registered nurse',
  'Pharmacist',
  'Other health care professional',
  'Student (health sciences)',
  'Other',
]

const GDPR_TEXT = `The data controller for your personal data is ebm.one sp. z o.o. based in Poland. We process your data for the purpose of providing educational services (Art. 6(1)(b) GDPR), fulfilling legal obligations (Art. 6(1)(c) GDPR), and on the basis of your consent (Art. 6(1)(a) GDPR) for marketing communications. Data is retained for the duration of the contract and for the period required by law. You have the right to access, rectify, erase, restrict processing, and port your data, as well as the right to object and to lodge a complaint with the supervisory authority. Fields marked * are optional but necessary to use the platform.`

// ── Shared field components ───────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label style={{
      display: 'block',
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
      color: 'var(--text-secondary)', marginBottom: '6px',
    }}>
      {children}{required && <span style={{ color: 'var(--color-error, #DC2626)' }}> *</span>}
    </label>
  )
}

function Input({ value, onChange, type = 'text', placeholder, style: extraStyle, ...rest }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', height: '52px', padding: '0 16px',
        background: 'var(--bg-app)',
        border: `1.5px solid ${focused ? 'var(--interactive-primary)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-primary)',
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        ...extraStyle,
      }}
      {...rest}
    />
  )
}

function PrimaryBtn({ children, onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', height: '52px',
        background: disabled || loading ? 'var(--border-default)' : 'var(--interactive-primary)',
        color: '#fff', border: 'none', borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'background 0.15s',
      }}
    >
      {loading && (
        <span className="material-symbols-outlined icon-sm" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
      )}
      {children}
    </button>
  )
}

function OutlineBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: '52px', padding: '0 24px',
        background: 'none',
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
        color: 'var(--text-secondary)', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
      <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-error, #DC2626)', flexShrink: 0 }}>error</span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-error, #DC2626)' }}>{msg}</span>
    </div>
  )
}

function ConsentCheckbox({ checked, onChange, children, required }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '100%', padding: '10px 0',
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left',
      }}
    >
      <div style={{
        width: '20px', height: '20px', flexShrink: 0, marginTop: '1px',
        borderRadius: '5px',
        border: checked ? 'none' : '1.5px solid var(--border-default)',
        background: checked ? 'var(--interactive-primary)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}>
        {checked && <span className="material-symbols-outlined filled" style={{ fontSize: '14px', color: '#fff' }}>check</span>}
      </div>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>
        {required && <span style={{ color: 'var(--color-error, #DC2626)', fontWeight: 600 }}>* </span>}
        {children}
      </span>
    </button>
  )
}

// ── Tab: Login ────────────────────────────────────────────────────────────────

function LoginTab({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setError(null)
    if (!email || !password) {
      setError('Please enter your email address and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        email,
        name: 'John Smith',
        initials: 'JS',
      }))
      onSuccess()
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Label required>E-mail</Label>
        <Input type="email" value={email} onChange={setEmail} placeholder="address@email.com" />
      </div>

      <div>
        <Label required>Password</Label>
        <div style={{ position: 'relative' }}>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            style={{ paddingRight: '48px' }}
          />
          <button
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', display: 'flex', padding: '4px',
            }}
          >
            <span className="material-symbols-outlined icon-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setRememberMe(v => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', padding: 0,
          }}
        >
          <div style={{
            width: '18px', height: '18px', flexShrink: 0, borderRadius: '4px',
            border: rememberMe ? 'none' : '1.5px solid var(--border-default)',
            background: rememberMe ? 'var(--interactive-primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {rememberMe && <span className="material-symbols-outlined filled" style={{ fontSize: '12px', color: '#fff' }}>check</span>}
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Remember me
          </span>
        </button>

        <button
          onClick={() => console.log('reset hasła')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: '14px',
            color: 'var(--interactive-primary)', fontWeight: 500, padding: 0,
          }}
        >
          Forgotten password?
        </button>
      </div>

      <FieldError msg={error} />

      <PrimaryBtn onClick={handleLogin} loading={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </PrimaryBtn>
    </div>
  )
}

// ── Tab: Register ─────────────────────────────────────────────────────────────

function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: 'Details' },
    { n: 2, label: 'Status' },
    { n: 3, label: 'Consents' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0', marginBottom: '24px' }}>
      {steps.map((s, i) => {
        const state = step > s.n ? 'done' : step === s.n ? 'active' : 'pending'
        return (
          <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-ui)',
                background: state === 'active' ? 'var(--interactive-primary)'
                           : state === 'done' ? 'var(--color-success, #16A34A)'
                           : 'var(--border-default)',
                color: state === 'pending' ? 'var(--text-secondary)' : '#fff',
                transition: 'background 0.2s',
              }}>
                {state === 'done'
                  ? <span className="material-symbols-outlined filled" style={{ fontSize: '14px', color: '#fff' }}>check</span>
                  : s.n
                }
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: '40px', height: '2px',
                  background: step > s.n ? 'var(--color-success, #16A34A)' : 'var(--border-default)',
                  transition: 'background 0.2s',
                }} />
              )}
            </div>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: step === s.n ? 600 : 400,
              color: state === 'active' ? 'var(--interactive-primary)' : 'var(--text-tertiary)',
            }}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function RegisterTab({ onSuccess }) {
  const [step, setStep] = useState(1)

  // Step 1
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('Poland')
  const [step1Error, setStep1Error] = useState(null)

  // Step 2
  const [profStatus, setProfStatus] = useState('')

  // Step 3
  const [consentTerms, setConsentTerms] = useState(false)
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentTruth, setConsentTruth] = useState(false)
  const [optMarketing, setOptMarketing] = useState(false)
  const [optNewsletter, setOptNewsletter] = useState(false)
  const [optMcMaster, setOptMcMaster] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const [showRodo, setShowRodo] = useState(false)
  const [loading, setLoading] = useState(false)

  function goStep2() {
    if (!email || !country) { setStep1Error('Please fill in all required fields.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setStep1Error('Please enter a valid email address.'); return }
    setStep1Error(null)
    setStep(2)
  }

  function handleRegister() {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      const initials = email.substring(0, 2).toUpperCase()
      localStorage.setItem('user', JSON.stringify({
        email,
        name: email.split('@')[0],
        initials,
        country,
        professionalStatus: profStatus,
        consents: { marketing: optMarketing, newsletter: optNewsletter, mcmaster: optMcMaster, dataProcessing: true },
      }))
      onSuccess()
    }, 1500)
  }

  const requiredOk = consentTerms && consentPrivacy && consentTruth

  return (
    <div>
      <StepIndicator step={step} />

      {/* ── KROK 1 ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <Label required>Email address</Label>
            <Input type="email" value={email} onChange={setEmail} placeholder="address@email.com" />
          </div>

          <div>
            <Label required>Country of practice</Label>
            <div style={{ position: 'relative' }}>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width: '100%', height: '52px', padding: '0 40px 0 16px',
                  background: 'var(--bg-app)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-primary)',
                  outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined icon-sm" style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)', pointerEvents: 'none',
              }}>expand_more</span>
            </div>
          </div>

          <FieldError msg={step1Error} />

          <PrimaryBtn onClick={goStep2}>
            Next <span className="material-symbols-outlined icon-sm">arrow_forward</span>
          </PrimaryBtn>
        </div>
      )}

      {/* ── KROK 2 ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ marginBottom: '4px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              What is your role?
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              We need this information for statistical purposes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PROFESSIONAL_STATUSES.map(opt => {
              const active = profStatus === opt
              return (
                <button
                  key={opt}
                  onClick={() => setProfStatus(opt)}
                  style={{
                    width: '100%', height: '52px', padding: '0 16px',
                    background: active ? 'var(--bg-brand-subtle)' : 'var(--bg-app)',
                    border: `1.5px solid ${active ? 'var(--interactive-primary)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    textAlign: 'left', transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{
                    width: '18px', height: '18px', flexShrink: 0, borderRadius: '50%',
                    border: `2px solid ${active ? 'var(--interactive-primary)' : 'var(--border-default)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--interactive-primary)' }} />}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-ui)', fontSize: '15px',
                    color: active ? 'var(--interactive-primary)' : 'var(--text-primary)',
                    fontWeight: active ? 600 : 400, flex: 1,
                  }}>
                    {opt}
                  </span>
                  {active && <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--interactive-primary)' }}>check</span>}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <OutlineBtn onClick={() => setStep(1)}>
              <span className="material-symbols-outlined icon-sm">arrow_back</span> Back
            </OutlineBtn>
            <div style={{ flex: 1 }}>
              <PrimaryBtn onClick={() => setStep(3)} disabled={!profStatus}>
                Next <span className="material-symbols-outlined icon-sm">arrow_forward</span>
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── KROK 3 ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Required consents
          </h3>

          <ConsentCheckbox required checked={consentTerms} onChange={() => setConsentTerms(v => !v)}>
            I have read and accept the{' '}
            <span onClick={e => { e.stopPropagation(); console.log('→ regulamin') }} style={{ color: 'var(--interactive-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              terms of service
            </span>
            .
          </ConsentCheckbox>

          <ConsentCheckbox required checked={consentPrivacy} onChange={() => setConsentPrivacy(v => !v)}>
            I have read the{' '}
            <span onClick={e => { e.stopPropagation(); console.log('→ polityka') }} style={{ color: 'var(--interactive-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              privacy policy
            </span>
            , including how my personal data is collected and processed.
          </ConsentCheckbox>

          <ConsentCheckbox required checked={consentTruth} onChange={() => setConsentTruth(v => !v)}>
            I confirm that all information I have provided is true and accurate. I understand that this platform is an educational resource for healthcare professionals.
          </ConsentCheckbox>

          {/* Opcjonalne */}
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <button
              onClick={() => setShowOptional(v => !v)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '4px 0', marginBottom: showOptional ? '8px' : '0',
              }}
            >
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>
                Communication & newsletters
              </span>
              <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', transform: showOptional ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                expand_more
              </span>
            </button>

            {showOptional && (
              <>
                <ConsentCheckbox checked={optMarketing} onChange={() => setOptMarketing(v => !v)}>
                  I would like to receive occasional marketing offers from ebm.one.
                </ConsentCheckbox>
                <ConsentCheckbox checked={optNewsletter} onChange={() => setOptNewsletter(v => !v)}>
                  I would like to receive platform communications from ebm.one.
                </ConsentCheckbox>
                <ConsentCheckbox checked={optMcMaster} onChange={() => setOptMcMaster(v => !v)}>
                  I would like to receive updates about McMaster Textbook.
                </ConsentCheckbox>
              </>
            )}
          </div>

          {/* RODO */}
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <button
              onClick={() => setShowRodo(v => !v)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0',
              }}
            >
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Data processing information
              </span>
              <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', transform: showRodo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                expand_more
              </span>
            </button>
            {showRodo && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.6, marginTop: '8px' }}>
                {GDPR_TEXT}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <OutlineBtn onClick={() => setStep(2)}>
              <span className="material-symbols-outlined icon-sm">arrow_back</span> Back
            </OutlineBtn>
            <div style={{ flex: 1 }}>
              <PrimaryBtn onClick={handleRegister} disabled={!requiredOk} loading={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab: Redeem ───────────────────────────────────────────────────────────────

function RedeemTab({ onSwitchToRegister, onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleRedeem() {
    if (!code.trim()) { setError('Please enter a redeem code.'); return }
    setError(null)
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        email: '',
        name: 'User',
        initials: 'US',
        activatedCode: code.trim().toUpperCase(),
      }))
      onSuccess()
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        Enter your redeem code below to activate your subscription.
      </p>

      <div>
        <Label>Redeem code</Label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX"
          style={{
            width: '100%', height: '52px', padding: '0 16px',
            background: 'var(--bg-app)',
            border: '1.5px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-ui)', fontSize: '20px', fontWeight: 600,
            color: 'var(--text-primary)', outline: 'none',
            textAlign: 'center', letterSpacing: '0.1em',
            boxSizing: 'border-box', textTransform: 'uppercase',
          }}
        />
        <FieldError msg={error} />
      </div>

      <PrimaryBtn onClick={handleRedeem} loading={loading}>
        {loading ? 'Activating...' : 'Activate code'}
      </PrimaryBtn>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: '14px',
            color: 'var(--interactive-primary)', fontWeight: 500,
          }}
        >
          Don't have a code? Register
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'login'
  const [tab, setTab] = useState(defaultTab)

  function onSuccess() {
    navigate('/')
  }

  const TABS = [
    { id: 'login',    label: 'Log in' },
    { id: 'register', label: 'Register' },
  ]

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #F9EEF3 0%, #FDF5F8 50%, #F0ECEB 100%)',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', padding: '48px 24px 24px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '28px',
          color: 'var(--interactive-primary)', letterSpacing: '-0.02em', marginBottom: '4px',
        }}>
          McMaster
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Textbook of Internal Medicine
        </div>
      </div>

      {/* Tabs row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: '0 16px', gap: '4px' }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                height: '44px',
                padding: '0 8px',
                border: 'none', cursor: 'pointer',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                fontFamily: 'var(--font-ui)',
                fontWeight: active ? 600 : 500,
                fontSize: '14px',
                background: active ? 'var(--bg-surface)' : 'var(--interactive-primary)',
                color: active ? 'var(--interactive-primary)' : 'rgba(255,255,255,0.9)',
                opacity: active ? 1 : 0.85,
                transition: 'opacity 0.15s',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Form card */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: tab === 'login' ? '0 var(--radius-xl) var(--radius-xl) var(--radius-xl)'
                    : '0 0 var(--radius-xl) var(--radius-xl)',
        margin: '0 16px',
        padding: '24px 20px 28px',
        boxShadow: '0 8px 40px rgba(80, 30, 20, 0.12)',
      }}>
        {tab === 'login' && <LoginTab onSuccess={onSuccess} />}
        {tab === 'register' && <RegisterTab onSuccess={onSuccess} />}
      </div>

      {/* Redeem code link */}
      {tab !== 'redeem' && (
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 16px' }}>
          {tab === 'redeem' ? null : (
            <button
              onClick={() => setTab('redeem')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontSize: '13px',
                color: 'var(--text-secondary)',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>card_giftcard</span>
              Have a redeem code?
            </button>
          )}
        </div>
      )}

      {/* Redeem panel — inline, below tabs */}
      {tab === 'redeem' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          margin: '8px 16px 0',
          padding: '20px 20px 24px',
          boxShadow: '0 8px 40px rgba(80, 30, 20, 0.12)',
        }}>
          <button
            onClick={() => setTab('login')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)',
              marginBottom: '16px', padding: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Back
          </button>
          <RedeemTab onSwitchToRegister={() => setTab('register')} onSuccess={onSuccess} />
        </div>
      )}

      <div style={{ height: '40px' }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
