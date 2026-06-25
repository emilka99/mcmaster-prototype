import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOffline } from '../hooks/useOffline'
import BottomSheet from '../components/BottomSheet'

const SPECIALTIES_WITH_SIZE = [
  { id: 'cardiology',      name: 'Kardiologia',         sizeMB: 52, chapterCount: 24 },
  { id: 'neurology',       name: 'Neurologia',           sizeMB: 48, chapterCount: 18 },
  { id: 'endocrinology',   name: 'Endokrynologia',       sizeMB: 38, chapterCount: 15 },
  { id: 'pulmonology',     name: 'Pulmonologia',         sizeMB: 31, chapterCount: 12 },
  { id: 'nephrology',      name: 'Nefrologia',           sizeMB: 35, chapterCount: 14 },
  { id: 'gastroenterology',name: 'Gastroenterologia',    sizeMB: 44, chapterCount: 17 },
  { id: 'rheumatology',    name: 'Reumatologia',         sizeMB: 29, chapterCount: 11 },
  { id: 'infectiology',    name: 'Choroby zakaźne',      sizeMB: 41, chapterCount: 16 },
]

const FREQ_OPTIONS = [
  { value: '6h',     label: 'Co 6 godzin', hint: 'zalecane' },
  { value: '24h',    label: 'Co 24 godziny', hint: null },
  { value: 'manual', label: 'Tylko ręcznie', hint: null },
]

function formatLastSync(iso) {
  if (!iso) return null
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) {
    return `dziś, ${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
  }
  if (diffDays === 1) return 'wczoraj'
  return `${diffDays} dni temu`
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      style={{
        position: 'relative',
        width: '44px',
        height: '26px',
        borderRadius: '13px',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        background: checked ? 'var(--interactive-primary)' : 'var(--border-default)',
        transition: 'background 0.2s ease',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '20px' : '2px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

// ── Checkbox row ──────────────────────────────────────────────────────────────

function SpecialtyRow({ specialty, checked, isLast, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '100%', height: '52px', padding: '0 16px',
        background: 'none', border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
        textAlign: 'left',
      }}
    >
      <div style={{
        width: '20px', height: '20px', flexShrink: 0,
        borderRadius: '5px',
        border: checked ? 'none' : '1.5px solid var(--border-default)',
        background: checked ? 'var(--interactive-primary)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}>
        {checked && (
          <span className="material-symbols-outlined filled" style={{ fontSize: '14px', color: '#fff' }}>check</span>
        )}
      </div>
      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
        {specialty.name}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)', marginRight: '8px' }}>
        {specialty.sizeMB} MB
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '24px', textAlign: 'right' }}>
        {specialty.chapterCount}
      </span>
    </button>
  )
}

// ── Status card ───────────────────────────────────────────────────────────────

function StatusCard({ offlineState, startDownload }) {
  const { syncStatus, lastSync, totalSizeMB, downloadedSpecialties } = offlineState
  const [mockProgress, setMockProgress] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (syncStatus === 'syncing') {
      setMockProgress(0)
      intervalRef.current = setInterval(() => {
        setMockProgress(p => {
          if (p >= 95) { clearInterval(intervalRef.current); return 95 }
          return p + Math.floor(Math.random() * 8 + 3)
        })
      }, 300)
    } else {
      clearInterval(intervalRef.current)
      if (syncStatus === 'upToDate') setMockProgress(100)
    }
    return () => clearInterval(intervalRef.current)
  }, [syncStatus])

  if (syncStatus === 'idle') {
    return (
      <div style={{
        background: 'var(--bg-subtle)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', padding: '16px',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
      }}>
        <span className="material-symbols-outlined icon-md" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>wifi_off</span>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>
            Tryb offline niedostępny
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Pobierz treści żeby czytać offline
          </div>
        </div>
      </div>
    )
  }

  if (syncStatus === 'syncing') {
    return (
      <div style={{
        background: 'var(--color-background-info, #EFF6FF)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '16px',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--interactive-primary)', flexShrink: 0, animation: 'spin 1.2s linear infinite' }}>sync</span>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
              Synchronizowanie...
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Nie zamykaj aplikacji
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${mockProgress}%`, background: 'var(--interactive-primary)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)', minWidth: '32px', textAlign: 'right' }}>
            {mockProgress}%
          </span>
        </div>
      </div>
    )
  }

  if (syncStatus === 'outdated') {
    return (
      <div style={{
        background: 'var(--color-background-warning, #FFFBEB)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '16px',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-text-warning, #B45309)', flexShrink: 0 }}>sync_problem</span>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Treści mogą być nieaktualne
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Ostatnia sync: {formatLastSync(lastSync)} · Zaktualizuj kiedy masz Wi-Fi
            </div>
          </div>
        </div>
        <button
          onClick={() => startDownload(downloadedSpecialties)}
          style={{
            height: '36px', padding: '0 16px',
            background: 'var(--interactive-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
          }}
        >
          Synchronizuj teraz
        </button>
      </div>
    )
  }

  // upToDate
  return (
    <div style={{
      background: 'var(--color-background-success, #F0FDF4)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: '16px',
      display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <span className="material-symbols-outlined filled icon-md" style={{ color: 'var(--color-text-success, #15803D)', flexShrink: 0 }}>check_circle</span>
      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>
          Treści zsynchronizowane
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Ostatnia sync: {formatLastSync(lastSync)} · {totalSizeMB} MB ·{' '}
          {downloadedSpecialties.includes('all') ? 'Textbook pełny' : `${downloadedSpecialties.length} specjalności`}
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Offline() {
  const navigate = useNavigate()
  const { offlineState, startDownload, updateSettings, clearDownload, isDownloaded, isAll } = useOffline()

  const [selected, setSelected] = useState([])
  const [showFreqSheet, setShowFreqSheet] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const { settings, syncStatus } = offlineState
  const isSyncing = syncStatus === 'syncing'

  function toggleSpecialty(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const selectedSizeMB = selected.reduce((acc, id) => {
    const sp = SPECIALTIES_WITH_SIZE.find(s => s.id === id)
    return acc + (sp?.sizeMB || 0)
  }, 0)

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%', paddingBottom: selected.length > 0 ? '96px' : '24px' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: '52px', padding: '0 16px',
        display: 'flex', alignItems: 'center',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-brand)', display: 'flex', alignItems: 'center', padding: '4px', width: '40px', flexShrink: 0 }}
        >
          <span className="material-symbols-outlined icon-md">arrow_back</span>
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
          Tryb offline
        </span>
        <div style={{ width: '40px' }} />
      </header>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* SEKCJA 1 — Status */}
        <StatusCard offlineState={offlineState} startDownload={startDownload} />

        {/* SEKCJA 2 — Pobierz wszystko */}
        <section>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>download</span>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  Cały Textbook
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  487 MB · 127 rozdziałów
                </div>
              </div>
            </div>

            {isAll && !isSyncing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Pobrano
                </span>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'none', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-pill-sm)', padding: '5px 12px',
                    fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600,
                    color: 'var(--color-error, #DC2626)', cursor: 'pointer',
                  }}
                >
                  <span className="material-symbols-outlined icon-sm">delete</span>
                  Usuń
                </button>
              </div>
            ) : (
              <button
                onClick={() => !isSyncing && startDownload(['all'])}
                disabled={isSyncing}
                style={{
                  width: '100%', height: '44px',
                  background: isSyncing ? 'var(--border-default)' : 'var(--interactive-primary)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <span className="material-symbols-outlined icon-sm">download</span>
                Pobierz wszystko
              </button>
            )}
          </div>
        </section>

        {/* SEKCJA 3 — Wybierz specjalności */}
        <section>
          <h3 style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
            color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '10px',
          }}>
            Lub wybierz specjalności
          </h3>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
            {SPECIALTIES_WITH_SIZE.map((sp, i) => (
              <SpecialtyRow
                key={sp.id}
                specialty={sp}
                checked={selected.includes(sp.id)}
                isLast={i === SPECIALTIES_WITH_SIZE.length - 1}
                onChange={() => toggleSpecialty(sp.id)}
              />
            ))}
          </div>
        </section>

        {/* SEKCJA 4 — Ustawienia sync */}
        <section>
          <h3 style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
            color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '10px',
          }}>
            Ustawienia synchronizacji
          </h3>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)', overflow: 'hidden' }}>
            {/* Auto sync */}
            <div style={{
              display: 'flex', alignItems: 'center', height: '52px', padding: '0 16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)', textAlign: 'left' }}>
                Automatyczna sync
              </span>
              <Toggle checked={settings.autoSync} onChange={() => updateSettings({ autoSync: !settings.autoSync })} />
            </div>
            {/* WiFi only */}
            <div style={{
              display: 'flex', alignItems: 'center', height: '52px', padding: '0 16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)', textAlign: 'left' }}>
                Tylko przez Wi-Fi
              </span>
              <Toggle checked={settings.wifiOnly} onChange={() => updateSettings({ wifiOnly: !settings.wifiOnly })} />
            </div>
            {/* Frequency */}
            <button
              onClick={() => setShowFreqSheet(true)}
              style={{
                width: '100%', height: '52px', padding: '0 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
              }}
            >
              <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-primary)' }}>
                Częstotliwość
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', marginRight: '4px' }}>
                {FREQ_OPTIONS.find(f => f.value === settings.frequency)?.label}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>
                <span className="material-symbols-outlined icon-sm">chevron_right</span>
              </span>
            </button>
          </div>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)',
            lineHeight: 1.6, marginTop: '12px', padding: '0 4px',
          }}>
            Automatyczna synchronizacja działa tylko gdy masz połączenie z internetem. Dla użytkowników z ograniczonym transferem danych zalecamy sync tylko przez Wi-Fi i częstotliwość ręczną.
          </p>
        </section>

      </div>

      {/* Sticky bottom CTA — pobierz wybrane */}
      {selected.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '430px', zIndex: 100,
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--glass-border)',
        }}>
          <button
            onClick={() => { startDownload(selected); setSelected([]) }}
            disabled={isSyncing}
            style={{
              width: '100%', height: '52px',
              background: 'var(--interactive-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <span className="material-symbols-outlined icon-sm">download</span>
            Pobierz wybrane ({selected.length}) · ~{selectedSizeMB} MB
          </button>
        </div>
      )}

      {/* Frequency bottom sheet */}
      <BottomSheet isOpen={showFreqSheet} onClose={() => setShowFreqSheet(false)} title="Częstotliwość synchronizacji">
        <div>
          {FREQ_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => { updateSettings({ frequency: opt.value }); setShowFreqSheet(false) }}
              style={{
                width: '100%', height: '52px', padding: '0 20px',
                background: 'none', border: 'none',
                borderBottom: i < FREQ_OPTIONS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: settings.frequency === opt.value ? 600 : 400, color: settings.frequency === opt.value ? 'var(--interactive-primary)' : 'var(--text-primary)' }}>
                {opt.label}{opt.hint && <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', fontSize: '13px' }}> ({opt.hint})</span>}
              </span>
              {settings.frequency === opt.value && (
                <span style={{ color: 'var(--interactive-primary)' }}>
                  <span className="material-symbols-outlined icon-md">check</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Clear confirm bottom sheet */}
      <BottomSheet isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Usuń pobrane treści">
        <div style={{ padding: '12px 20px 20px' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Usunięcie usuwa wszystkie pobrane treści z urządzenia. Treści online nadal będą dostępne.
          </p>
          <button
            onClick={() => { clearDownload(); setShowClearConfirm(false) }}
            style={{
              width: '100%', height: '48px',
              background: 'var(--color-error, #DC2626)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
            }}
          >
            Usuń pobrane treści
          </button>
          <button
            onClick={() => setShowClearConfirm(false)}
            style={{
              width: '100%', height: '48px', marginTop: '8px',
              background: 'none', border: 'none',
              fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '15px',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            Anuluj
          </button>
        </div>
      </BottomSheet>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
