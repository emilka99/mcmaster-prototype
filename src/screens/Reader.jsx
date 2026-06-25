import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CHAPTER = {
  id: 'cardiology-3-2',
  title: 'Niewydolność serca',
  specialty: 'Kardiologia',
  chapter: '3.2',
  readTime: '12 min',
  toc: [
    { id: 'def',   title: 'Definicja i klasyfikacja' },
    { id: 'etio',  title: 'Etiologia' },
    { id: 'path',  title: 'Patofizjologia' },
    { id: 'diag',  title: 'Diagnostyka' },
    { id: 'treat', title: 'Leczenie' },
    { id: 'prog',  title: 'Rokowanie' },
  ],
  content: `
    <h2 id="def">Definicja i klasyfikacja</h2>
    <p>Niewydolność serca (NS) jest zespołem klinicznym, w którym serce nie jest w stanie pompować wystarczającej ilości krwi, aby zaspokoić metaboliczne potrzeby organizmu, lub może to robić jedynie przy nieprawidłowo wysokim ciśnieniu napełniania.</p>
    <p>Klasyfikacja według frakcji wyrzutowej lewej komory (LVEF) obejmuje niewydolność serca z obniżoną frakcją wyrzutową (HFrEF, LVEF ≤ 40%), z łagodnie obniżoną frakcją wyrzutową (HFmrEF, LVEF 41–49%) oraz z zachowaną frakcją wyrzutową (HFpEF, LVEF ≥ 50%).</p>

    <h2 id="etio">Etiologia</h2>
    <p>Najczęstszą przyczyną niewydolności serca w krajach wysokorozwiniętych jest choroba wieńcowa, odpowiedzialna za około 60–70% przypadków HFrEF. Inne istotne przyczyny to nadciśnienie tętnicze, kardiomiopatie (rozstrzeniowa, przerostowa, restrykcyjna), wady zastawkowe serca oraz zaburzenia rytmu serca.</p>

    <h2 id="path">Patofizjologia</h2>
    <p>W odpowiedzi na zmniejszony rzut serca aktywowane są mechanizmy kompensacyjne: układ renina-angiotensyna-aldosteron (RAA), układ współczulny oraz wydzielanie peptydów natriuretycznych. Długotrwała aktywacja tych układów prowadzi do niekorzystnej przebudowy mięśnia sercowego (remodeling), nasilając dysfunkcję serca.</p>

    <h2 id="diag">Diagnostyka</h2>
    <p>Rozpoznanie niewydolności serca opiera się na objawach klinicznych (duszność, obrzęki, nietolerancja wysiłku), badaniu fizykalnym oraz badaniach dodatkowych. Kluczowe znaczenie ma echokardiografia, pozwalająca ocenić funkcję skurczową i rozkurczową serca oraz frakcję wyrzutową.</p>
    <p>Stężenie peptydów natriuretycznych (BNP, NT-proBNP) ma wartość diagnostyczną i prognostyczną — ich podwyższone wartości potwierdzają rozpoznanie i korelują z ciężkością choroby.</p>

    <h2 id="treat">Leczenie</h2>
    <p>Podstawę leczenia HFrEF stanowi farmakoterapia oparta na czterech grupach leków o udowodnionym wpływie na rokowanie: inhibitory ACE lub sakubitryl/walsartan (ARNI), beta-adrenolityki, antagoniści aldosteronu oraz inhibitory SGLT2. Każdy pacjent z HFrEF powinien otrzymać wszystkie cztery klasy leków, o ile nie ma przeciwwskazań.</p>

    <h2 id="prog">Rokowanie</h2>
    <p>Rokowanie w niewydolności serca pozostaje poważne — roczna śmiertelność w zaawansowanej NS wynosi 50%. Wdrożenie pełnej terapii opartej na dowodach znacząco poprawia przeżycie i jakość życia pacjentów.</p>
  `,
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="4" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const IconMore = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="4.5" r="1.5" fill="currentColor"/>
    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="10" cy="15.5" r="1.5" fill="currentColor"/>
  </svg>
)

const IconBookmark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 3H14C14.6 3 15 3.4 15 4V16L9 12.5L3 16V4C3 3.4 3.4 3 4 3Z"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)

const IconNote = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="5" y1="6.5" x2="13" y2="6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="5" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="5" y1="12.5" x2="9" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

// ── Reader styles injected into <head> ────────────────────────────────────────

const READER_CSS = `
  .reader-content h2 {
    font-family: var(--font-ui);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 32px 0 12px;
    padding-top: 12px;
    border-top: 2px solid var(--interactive-primary);
    line-height: 1.3;
  }
  .reader-content p {
    font-family: var(--font-ui);
    font-size: 17px;
    line-height: 1.75;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .reader-content abbr,
  .reader-content .term {
    color: var(--interactive-primary);
    text-decoration: underline dotted;
    cursor: help;
  }
`

// ── TOC Panel ─────────────────────────────────────────────────────────────────

function TOCPanel({ toc, activeSection, open, onClose }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
          width: '100%',
          maxWidth: '430px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
          zIndex: 201,
          transition: 'transform 0.3s ease',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Panel header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '16px',
            color: 'var(--text-primary)',
          }}>
            Spis treści
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <IconClose />
          </button>
        </div>

        {/* TOC list */}
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {toc.map((section, i) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--interactive-primary)' : 'var(--border-default)',
                  flexShrink: 0,
                  marginTop: '1px',
                }} />
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--interactive-primary)' : 'var(--text-primary)',
                  flex: 1,
                }}>
                  {section.title}
                </span>
                {isActive && (
                  <span style={{ color: 'var(--interactive-primary)', fontSize: '16px' }}>←</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Reader() {
  const navigate = useNavigate()
  const { chapterId } = useParams()
  const { setLastRead } = useReadingHistory()

  const [showTOC, setShowTOC] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('def')

  // Inject reader CSS once
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'reader-styles'
    style.textContent = READER_CSS
    if (!document.getElementById('reader-styles')) {
      document.head.appendChild(style)
    }
    return () => document.getElementById('reader-styles')?.remove()
  }, [])

  // Save reading history
  useEffect(() => {
    setLastRead({
      chapterId: MOCK_CHAPTER.id,
      title: MOCK_CHAPTER.title,
      specialty: MOCK_CHAPTER.specialty,
    })
  }, [])

  // Scroll progress
  useEffect(() => {
    function handleScroll() {
      const scrolled = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      if (total > 0) setProgress(Math.round((scrolled / total) * 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    MOCK_CHAPTER.toc.forEach(section => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh' }}>

      {/* ── Reader TopBar ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '52px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
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
            flexShrink: 0,
          }}
          aria-label="Wróć"
        >
          <IconBack />
        </button>

        <span style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
          fontSize: '14px',
          color: 'var(--text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {MOCK_CHAPTER.specialty} · {MOCK_CHAPTER.chapter}
        </span>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => setShowTOC(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Spis treści"
          >
            <IconList />
          </button>
          <button
            onClick={() => console.log('więcej opcji')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Więcej opcji"
          >
            <IconMore />
          </button>
        </div>
      </header>

      {/* ── Chapter content ── */}
      <main style={{
        padding: '28px 20px 140px',
        maxWidth: '680px',
        margin: '0 auto',
      }}>
        {/* Chapter header */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '11px',
            color: 'var(--interactive-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {MOCK_CHAPTER.specialty}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: '26px',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}>
          {MOCK_CHAPTER.title}
        </h1>

        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '0',
        }}>
          Rozdział {MOCK_CHAPTER.chapter} · {MOCK_CHAPTER.readTime} czytania
        </p>

        <hr style={{
          border: 'none',
          borderTop: '1px solid var(--border-subtle)',
          margin: '20px 0',
        }} />

        {/* Content */}
        <div
          className="reader-content"
          dangerouslySetInnerHTML={{ __html: MOCK_CHAPTER.content }}
        />
      </main>

      {/* ── Reader BottomBar ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        zIndex: 100,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--glass-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{
          height: '52px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Save */}
          <button
            onClick={() => console.log('zapisz rozdział')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '0',
              flexShrink: 0,
            }}
          >
            <IconBookmark />
            Zapisz
          </button>

          {/* Progress */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '3px',
              background: 'var(--border-subtle)',
              borderRadius: '999px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--interactive-primary)',
                borderRadius: '999px',
                transition: 'width 0.2s ease',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontWeight: 500,
              minWidth: '28px',
            }}>
              {progress}%
            </span>
          </div>

          {/* Note */}
          <button
            onClick={() => console.log('notatka')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '0',
              flexShrink: 0,
            }}
          >
            <IconNote />
            Notatka
          </button>
        </div>
      </div>

      {/* ── TOC Panel ── */}
      <TOCPanel
        toc={MOCK_CHAPTER.toc}
        activeSection={activeSection}
        open={showTOC}
        onClose={() => setShowTOC(false)}
      />
    </div>
  )
}
