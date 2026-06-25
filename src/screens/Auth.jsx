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

const RODO_TEXT = `Administratorem Twoich danych osobowych jest ebm.one sp. z o.o. z siedzibą w Polsce. Twoje dane przetwarzamy w celu świadczenia usług edukacyjnych (art. 6 ust. 1 lit. b RODO), realizacji obowiązków prawnych (art. 6 ust. 1 lit. c RODO) oraz na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO) w zakresie komunikacji marketingowej. Dane przechowujemy przez czas trwania umowy oraz przez okres wymagany przepisami prawa. Masz prawo do dostępu, sprostowania, usunięcia, ograniczenia przetwarzania oraz przeniesienia swoich danych, a także prawo wniesienia sprzeciwu i skargi do Prezesa UODO. Podanie danych oznaczonych * jest dobrowolne, lecz niezbędne do korzystania z platformy.`

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
      setError('Wprowadź adres e-mail i hasło.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        email,
        name: 'Jan Kowalski',
        initials: 'JK',
      }))
      onSuccess()
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Label required>E-mail</Label>
        <Input type="email" value={email} onChange={setEmail} placeholder="adres@email.com" />
      </div>

      <div>
        <Label required>Hasło</Label>
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
            Zapamiętaj mnie
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
          Zapomniałeś hasła?
        </button>
      </div>

      <FieldError msg={error} />

      <PrimaryBtn onClick={handleLogin} loading={loading}>
        {loading ? 'Logowanie...' : 'Zaloguj się'}
      </PrimaryBtn>
    </div>
  )
}

// ── Tab: Register ─────────────────────────────────────────────────────────────

function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: 'Dane' },
    { n: 2, label: 'Status' },
    { n: 3, label: 'Zgody' },
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
    if (!email || !country) { setStep1Error('Uzupełnij wszystkie wymagane pola.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setStep1Error('Podaj prawidłowy adres e-mail.'); return }
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
            <Label required>Adres e-mail</Label>
            <Input type="email" value={email} onChange={setEmail} placeholder="adres@email.com" />
          </div>

          <div>
            <Label required>Kraj praktyki</Label>
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
            Dalej <span className="material-symbols-outlined icon-sm">arrow_forward</span>
          </PrimaryBtn>
        </div>
      )}

      {/* ── KROK 2 ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ marginBottom: '4px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Kim jesteś?
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Potrzebujemy tej informacji do celów statystycznych.
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
              <span className="material-symbols-outlined icon-sm">arrow_back</span> Wróć
            </OutlineBtn>
            <div style={{ flex: 1 }}>
              <PrimaryBtn onClick={() => setStep(3)} disabled={!profStatus}>
                Dalej <span className="material-symbols-outlined icon-sm">arrow_forward</span>
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── KROK 3 ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Wymagane zgody
          </h3>

          <ConsentCheckbox required checked={consentTerms} onChange={() => setConsentTerms(v => !v)}>
            Zapoznałem/am się i akceptuję{' '}
            <span onClick={e => { e.stopPropagation(); console.log('→ regulamin') }} style={{ color: 'var(--interactive-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              regulamin
            </span>
            .
          </ConsentCheckbox>

          <ConsentCheckbox required checked={consentPrivacy} onChange={() => setConsentPrivacy(v => !v)}>
            Zapoznałem/am się z{' '}
            <span onClick={e => { e.stopPropagation(); console.log('→ polityka') }} style={{ color: 'var(--interactive-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              polityką prywatności
            </span>
            , w tym ze sposobem gromadzenia i przetwarzania moich danych osobowych.
          </ConsentCheckbox>

          <ConsentCheckbox required checked={consentTruth} onChange={() => setConsentTruth(v => !v)}>
            Potwierdzam, że wszystkie podane przeze mnie informacje są prawdziwe i dokładne. Rozumiem, że platforma jest zasobem edukacyjnym dla pracowników ochrony zdrowia.
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
                Komunikacja i newslettery
              </span>
              <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', transform: showOptional ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                expand_more
              </span>
            </button>

            {showOptional && (
              <>
                <ConsentCheckbox checked={optMarketing} onChange={() => setOptMarketing(v => !v)}>
                  Chcę otrzymywać okazjonalne oferty marketingowe od ebm.one.
                </ConsentCheckbox>
                <ConsentCheckbox checked={optNewsletter} onChange={() => setOptNewsletter(v => !v)}>
                  Chcę otrzymywać komunikaty od platformy ebm.one.
                </ConsentCheckbox>
                <ConsentCheckbox checked={optMcMaster} onChange={() => setOptMcMaster(v => !v)}>
                  Chcę otrzymywać aktualności o McMaster Textbook (EN).
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
                Informacja o przetwarzaniu danych
              </span>
              <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', transform: showRodo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                expand_more
              </span>
            </button>
            {showRodo && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.6, marginTop: '8px' }}>
                {RODO_TEXT}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <OutlineBtn onClick={() => setStep(2)}>
              <span className="material-symbols-outlined icon-sm">arrow_back</span> Wróć
            </OutlineBtn>
            <div style={{ flex: 1 }}>
              <PrimaryBtn onClick={handleRegister} disabled={!requiredOk} loading={loading}>
                {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
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
    if (!code.trim()) { setError('Wprowadź kod dostępu.'); return }
    setError(null)
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        email: '',
        name: 'Użytkownik',
        initials: 'UK',
        activatedCode: code.trim().toUpperCase(),
      }))
      onSuccess()
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        Masz kod dostępu? Wpisz go poniżej żeby aktywować subskrypcję.
      </p>

      <div>
        <Label>Kod dostępu</Label>
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
        {loading ? 'Aktywowanie...' : 'Aktywuj kod'}
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
          Nie masz kodu? Zarejestruj się
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
    { id: 'login',    label: 'Zaloguj się' },
    { id: 'register', label: 'Zarejestruj się' },
    { id: 'redeem',   label: 'Kod dostępu', icon: 'card_giftcard' },
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
          const isRedeem = t.id === 'redeem'
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: isRedeem ? '0 0 auto' : 1,
                height: isRedeem ? '38px' : '44px',
                padding: isRedeem ? '0 12px' : '0 8px',
                border: 'none', cursor: 'pointer',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                fontFamily: 'var(--font-ui)',
                fontWeight: active ? 600 : 500,
                fontSize: isRedeem ? '13px' : '14px',
                background: active ? 'var(--bg-surface)' : 'var(--interactive-primary)',
                color: active ? 'var(--interactive-primary)' : 'rgba(255,255,255,0.9)',
                opacity: active ? 1 : (isRedeem ? 0.75 : 0.85),
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                transition: 'opacity 0.15s',
              }}
            >
              {isRedeem && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>card_giftcard</span>}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Form card */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: tab === 'login' ? '0 var(--radius-xl) var(--radius-xl) var(--radius-xl)'
                    : tab === 'register' ? '0 0 var(--radius-xl) var(--radius-xl)'
                    : 'var(--radius-xl)',
        margin: '0 16px',
        padding: '24px 20px 32px',
        boxShadow: '0 8px 40px rgba(80, 30, 20, 0.12)',
      }}>
        {tab === 'login' && <LoginTab onSuccess={onSuccess} />}
        {tab === 'register' && <RegisterTab onSuccess={onSuccess} />}
        {tab === 'redeem' && <RedeemTab onSwitchToRegister={() => setTab('register')} onSuccess={onSuccess} />}
      </div>

      <div style={{ height: '40px' }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
