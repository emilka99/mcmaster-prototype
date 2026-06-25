import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../components/BottomSheet'
import { useOffline } from '../hooks/useOffline'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  name: 'Emilka Kowalska',
  initials: 'EK',
  email: 'emi@rozkw.it',
  emailChangeUrl: 'mailto:support@ebm.one',
  country: 'Poland',
  professionalStatus: 'Student (health sciences)',
  subscription: {
    type: 'ebm.one: all-in access',
    validFrom: '2026/06/03',
    validTo: '2026/09/03',
    activatedCode: null,
  },
  consents: {
    marketing: false,
    newsletter: false,
    dataProcessing: true,
  },
}

const PROFESSIONAL_STATUSES = [
  'Physician',
  'Nurse practitioner/registered nurse',
  'Pharmacist',
  'Other health care professional',
  'Student (health sciences)',
  'Other',
]

const COUNTRIES = [
  'Poland', 'Germany', 'United Kingdom', 'France', 'Netherlands',
  'Sweden', 'Norway', 'Denmark', 'Austria', 'Switzerland',
  'Spain', 'Italy', 'Portugal', 'Belgium', 'Czech Republic',
  'Hungary', 'Romania', 'Croatia', 'Ukraine', 'United States',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(/\//g, '-'))
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

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
      padding: '0 16px',
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
      margin: '0 16px',
    }}>
      {children}
    </div>
  )
}

function ListRow({ label, value, isLast, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: '52px',
        padding: '0 16px',
        background: 'none',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        color: 'var(--text-primary)',
      }}>
        {label}
      </span>
      {value && (
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginRight: '4px',
          maxWidth: '140px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'right',
        }}>
          {value}
        </span>
      )}
      {!disabled && (
        <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}><span className="material-symbols-outlined icon-sm">chevron_right</span></span>
      )}
    </button>
  )
}

function Checkbox({ checked, disabled, onChange, label, sublabel }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      style={{
        width: '100%',
        minHeight: '64px',
        padding: '0 16px',
        background: 'none',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        textAlign: 'left',
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        flexShrink: 0,
        borderRadius: '5px',
        border: checked ? 'none' : '1.5px solid var(--border-default)',
        background: checked ? 'var(--interactive-primary)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s',
      }}>
        {checked && <span className="material-symbols-outlined filled" style={{ fontSize: '14px', color: '#fff' }}>check</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '14px',
          color: 'var(--text-primary)',
          marginBottom: '2px',
          opacity: disabled ? 0.5 : 1,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          opacity: disabled ? 0.5 : 1,
        }}>
          {sublabel}
        </div>
      </div>
    </button>
  )
}

// ── Bottom sheet option list ──────────────────────────────────────────────────

function OptionList({ options, selected, onSelect }) {
  return (
    <div>
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            width: '100%',
            height: '52px',
            padding: '0 20px',
            background: 'none',
            border: 'none',
            borderBottom: i < options.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            color: selected === opt ? 'var(--interactive-primary)' : 'var(--text-primary)',
            fontWeight: selected === opt ? 600 : 400,
          }}>
            {opt}
          </span>
          {selected === opt && (
            <span style={{ color: 'var(--interactive-primary)' }}>
              <span className="material-symbols-outlined icon-md">check</span>
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate()

  const [country, setCountry] = useState(MOCK_USER.country)
  const [status, setStatus] = useState(MOCK_USER.professionalStatus)
  const [consents, setConsents] = useState(MOCK_USER.consents)
  const { isDownloaded, offlineState } = useOffline()

  const [sheet, setSheet] = useState(null) // 'country' | 'status' | null

  const sub = MOCK_USER.subscription
  const isActive = sub?.validTo && new Date(sub.validTo.replace(/\//g, '-')) > new Date()

  function toggleConsent(key) {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }))
  }

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
          <span className="material-symbols-outlined icon-md">arrow_back</span>
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

      <div style={{ paddingBottom: '40px' }}>

        {/* ── SEKCJA 1: Premium banner ───────────────────────────────── */}
        {isActive && (
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--interactive-primary), #4A0080)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 20px',
              color: '#fff',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}>
                <span className="material-symbols-outlined filled icon-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>star</span>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.02em',
                }}>
                  Premium access
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '12px',
              }}>
                Ważny do {formatDate(sub.validTo)}
              </div>
              <button
                onClick={() => console.log('→ web store')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Odnów subskrypcję
              <span className="material-symbols-outlined icon-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SEKCJA 2: Moje konto ───────────────────────────────────── */}
        <div style={{ padding: '28px 0 0' }}>
          <SectionLabel>Moje konto</SectionLabel>

          {/* Avatar + user info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 16px 24px',
            gap: '8px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--interactive-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '22px',
              flexShrink: 0,
              marginBottom: '4px',
            }}>
              {MOCK_USER.initials}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '17px',
              color: 'var(--text-primary)',
            }}>
              {MOCK_USER.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}>
              {MOCK_USER.email}
            </div>
          </div>

          <ListCard>
            <ListRow
              label="Kraj praktyki"
              value={country}
              onClick={() => setSheet('country')}
            />
            <ListRow
              label="Status zawodowy"
              value={status}
              onClick={() => setSheet('status')}
            />
            <ListRow
              label="Zmień hasło"
              onClick={() => console.log('zmień hasło')}
            />
            <ListRow
              label="Zamówienia"
              isLast
              onClick={() => console.log('→ zamówienia')}
            />
          </ListCard>
        </div>

        {/* ── SEKCJA 2b: Ustawienia ─────────────────────────────────── */}
        <div style={{ padding: '28px 0 0' }}>
          <SectionLabel>Ustawienia</SectionLabel>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden', margin: '0 16px' }}>
            <button
              onClick={() => navigate('/offline')}
              style={{
                width: '100%', height: '52px', padding: '0 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
              }}
            >
              <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>wifi_off</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)' }}>
                Tryb offline
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '14px', marginRight: '4px',
                color: isDownloaded ? 'var(--color-text-success, #15803D)' : 'var(--text-tertiary)',
                maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right',
              }}>
                {isDownloaded ? `Pobrano · ${offlineState.totalSizeMB} MB` : 'Nie pobrano'}
              </span>
              <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-sm">chevron_right</span>
              </span>
            </button>
          </div>
        </div>

        {/* ── SEKCJA 3: Dostęp ──────────────────────────────────────── */}
        <div style={{ padding: '28px 0 0' }}>
          <SectionLabel>Mój dostęp</SectionLabel>
          <ListCard>
            <button
              onClick={() => console.log('szczegóły dostępu')}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  marginBottom: '3px',
                }}>
                  {sub.type}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}>
                  {formatDate(sub.validFrom)} – {formatDate(sub.validTo)}
                </div>
                {sub.activatedCode && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill-sm)',
                  }}>
                    {sub.activatedCode}
                  </span>
                )}
              </div>
              <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}><span className="material-symbols-outlined icon-sm">chevron_right</span></span>
            </button>
          </ListCard>
        </div>

        {/* ── SEKCJA 4: Zgody ───────────────────────────────────────── */}
        <div style={{ padding: '28px 0 0' }}>
          <SectionLabel>Zgody i komunikacja</SectionLabel>
          <ListCard>
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <Checkbox
                checked={consents.dataProcessing}
                disabled
                label="Przetwarzanie danych osobowych"
                sublabel="Wymagane do korzystania z usługi"
              />
            </div>
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <Checkbox
                checked={consents.marketing}
                onChange={() => toggleConsent('marketing')}
                label="Marketing i komunikacja"
                sublabel="Zgoda na materiały promocyjne"
              />
            </div>
            <Checkbox
              checked={consents.newsletter}
              onChange={() => toggleConsent('newsletter')}
              label="Newsletter"
              sublabel="Aktualności i nowości medyczne"
            />
          </ListCard>
        </div>

        {/* ── Wyloguj ───────────────────────────────────────────────── */}
        <div style={{ padding: '28px 16px 0' }}>
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
            }}
          >
            Wyloguj się
          </button>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          padding: '20px 0 0',
        }}>
          McMaster Textbook · v0.1.0
        </p>
      </div>

      {/* ── Bottom sheets ──────────────────────────────────────────── */}

      <BottomSheet
        isOpen={sheet === 'country'}
        onClose={() => setSheet(null)}
        title="Kraj praktyki"
      >
        <OptionList
          options={COUNTRIES}
          selected={country}
          onSelect={v => { setCountry(v); setSheet(null) }}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={sheet === 'status'}
        onClose={() => setSheet(null)}
        title="Status zawodowy"
      >
        <OptionList
          options={PROFESSIONAL_STATUSES}
          selected={status}
          onSelect={v => { setStatus(v); setSheet(null) }}
        />
      </BottomSheet>

    </div>
  )
}
