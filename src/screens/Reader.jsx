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
  lastReviewed: '15 Nov 2024',
  lastUpdated: '3 Feb 2025',
  contributors: [
    { name: 'Prof. Jan Kowalski', role: 'Author', institution: 'Uniwersytet Jagielloński' },
    { name: 'Dr Anna Nowak', role: 'Reviewer', institution: 'Gdański Uniwersytet Medyczny' },
    { name: 'Dr Piotr Wiśniewski', role: 'Editor', institution: 'Warszawski Uniwersytet Medyczny' },
  ],
  references: [
    '1. McDonagh TA, et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2021;42(36):3599-3726.',
    '2. Ponikowski P, et al. 2016 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2016;37(27):2129-2200.',
    '3. Yancy CW, et al. 2017 ACC/AHA/HFSA Focused Update of the 2013 ACCF/AHA Guideline for the Management of Heart Failure. J Am Coll Cardiol. 2017;70(6):776-803.',
  ],
  toc: [
    { id: 'def',   title: 'Definicja i klasyfikacja' },
    { id: 'etio',  title: 'Etiologia' },
    { id: 'path',  title: 'Patofizjologia' },
    { id: 'diag',  title: 'Diagnostyka' },
    { id: 'treat', title: 'Leczenie' },
    { id: 'prog',  title: 'Rokowanie' },
  ],
  content: `
    <section id="def">
      <h2>Definicja i klasyfikacja</h2>
      <p>Niewydolność serca (<abbr title="heart failure">NS</abbr>) jest zespołem klinicznym, w którym serce nie jest w stanie pompować wystarczającej ilości krwi, aby zaspokoić metaboliczne potrzeby organizmu, lub może to robić jedynie przy nieprawidłowo wysokim ciśnieniu napełniania.</p>
      <p>Klasyfikacja <abbr title="European Society of Cardiology">ESC</abbr> 2021 według <abbr title="left ventricular ejection fraction">LVEF</abbr>:</p>
      <ol>
        <li>Niewydolność serca z obniżoną frakcją wyrzutową (<abbr title="heart failure with reduced ejection fraction">HFrEF</abbr>): LVEF ≤ 40%
          <ol>
            <li>Kryterium podstawowe: objawy podmiotowe ± przedmiotowe</li>
            <li>Kryterium dodatkowe: LVEF ≤ 40% w badaniu obrazowym
              <ol>
                <li>Echokardiografia przezklatkowa (badanie z wyboru)</li>
                <li>Rezonans magnetyczny serca (złoty standard)</li>
                <li>Wentrykulografia izotopowa (alternatywa)</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>Niewydolność serca z łagodnie obniżoną frakcją wyrzutową (<abbr title="heart failure with mildly reduced ejection fraction">HFmrEF</abbr>): LVEF 41–49%</li>
        <li>Niewydolność serca z zachowaną frakcją wyrzutową (<abbr title="heart failure with preserved ejection fraction">HFpEF</abbr>): LVEF ≥ 50%</li>
      </ol>

      <h3>Klasyfikacja czynnościowa</h3>
      <p>Klasyfikacja <abbr title="New York Heart Association">NYHA</abbr> ocenia nasilenie objawów i tolerancję wysiłku:</p>
      <ul>
        <li><strong>Klasa I:</strong> bez ograniczenia aktywności fizycznej</li>
        <li><strong>Klasa II:</strong> niewielkie ograniczenie — duszność przy umiarkowanym wysiłku</li>
        <li><strong>Klasa III:</strong> znaczne ograniczenie — duszność przy minimalnym wysiłku</li>
        <li><strong>Klasa IV:</strong> objawy spoczynkowe lub przy najmniejszym wysiłku</li>
      </ul>

      <h4>Staging według ACC/AHA</h4>
      <p>Uzupełniający podział uwzględnia pacjentów bezobjawowych z grupy ryzyka (stadia A i B), co umożliwia wdrożenie prewencji przed rozwojem pełnoobjawowej choroby.</p>
    </section>

    <section id="etio">
      <h2>Etiologia</h2>
      <p>Najczęstszą przyczyną niewydolności serca w krajach wysokorozwiniętych jest choroba wieńcowa (<abbr title="coronary artery disease">CAD</abbr>), odpowiedzialna za około 60–70% przypadków HFrEF.</p>

      <h3>Przyczyny kardiologiczne</h3>
      <p>Kardiologiczne podłoże obejmuje:</p>
      <ul>
        <li>Chorobę niedokrwienną serca (zawał, przewlekłe niedokrwienie)</li>
        <li>Nadciśnienie tętnicze — prowadzi do przerostu lewej komory</li>
        <li>Kardiomiopatie: rozstrzeniowa, przerostowa, restrykcyjna, arytmogenna</li>
        <li>Wady zastawkowe: niedomykalność/zwężenie zastawki mitralnej lub aortalnej</li>
        <li>Zaburzenia rytmu serca: utrwalone migotanie przedsionków (<abbr title="atrial fibrillation">AF</abbr>), tachykardiomiopatia</li>
      </ul>

      <h3>Przyczyny pozasercowe</h3>
      <ul>
        <li>Nadczynność/niedoczynność tarczycy</li>
        <li>Niedokrwistość ciężkiego stopnia</li>
        <li>Choroby układowe (sarkoidoza, amyloidoza)</li>
        <li>Kardiotoksyczność leków (antracykliny, trastuzumab)</li>
      </ul>

      <h4>Czynniki wyzwalające zaostrzenie</h4>
      <p>U pacjentów ze stabilną NS zaostrzenie mogą wywołać: infekcje (zwłaszcza płucne), nieprzestrzeganie diety niskosodowej i zaleceń dotyczących płynów, odstawienie leków oraz epizody tachyarytmii.</p>
    </section>

    <section id="path">
      <h2>Patofizjologia</h2>
      <p>W odpowiedzi na zmniejszony rzut serca aktywowane są mechanizmy kompensacyjne: układ renina-angiotensyna-aldosteron (<abbr title="renin-angiotensin-aldosterone system">RAA</abbr>), układ współczulny oraz wydzielanie peptydów natriuretycznych.</p>
      <p>Długotrwała aktywacja tych układów prowadzi do niekorzystnej przebudowy mięśnia sercowego (remodeling), nasilając dysfunkcję serca i tworząc błędne koło niewydolności.</p>

      <h3>Mechanizmy neurohormonalne</h3>
      <p>Aktywacja układu <abbr title="renin-angiotensin-aldosterone">RAA</abbr> i układu współczulnego jest początkowo korzystna (podtrzymuje ciśnienie tętnicze i perfuzję narządów), jednak przewlekłe pobudzenie:</p>
      <ul>
        <li>Zwiększa obciążenie wstępne i następcze serca</li>
        <li>Powoduje retencję sodu i wody → obrzęki</li>
        <li>Nasila włóknienie i apoptozę kardiomiocytów</li>
        <li>Sprzyja arytmiom komorowym</li>
      </ul>

      <h3>Peptydy natriuretyczne</h3>
      <p><abbr title="B-type natriuretic peptide">BNP</abbr> i <abbr title="N-terminal proBNP">NT-proBNP</abbr> są wydzielane przez kardiomiocyty pod wpływem zwiększonego napięcia ścian komór. Wywołują efekty przeciwstawne do układu RAA: diurezę, natriurezę i rozkurcz naczyń.</p>
    </section>

    <section id="diag">
      <h2>Diagnostyka</h2>
      <p>Rozpoznanie NS opiera się na triasie: objawach podmiotowych, przedmiotowych oraz dowodach na dysfunkcję serca w badaniach dodatkowych.</p>

      <h3>Objawy podmiotowe i przedmiotowe</h3>
      <ul>
        <li>Duszność (dyspnoe) — szczególnie wysiłkowa, orthopnoe, duszność napadowa nocna (<abbr title="paroxysmal nocturnal dyspnea">PND</abbr>)</li>
        <li>Obrzęki kończyn dolnych (symetryczne, nasilające się wieczorem)</li>
        <li>Zmęczenie i nietolerancja wysiłku</li>
        <li>Trzeszczenia u podstawy płuc, rytm cwałowy S3</li>
        <li>Przepełnienie żył szyjnych (podwyższone <abbr title="jugular venous pressure">JVP</abbr>)</li>
      </ul>

      <h3>Badania dodatkowe</h3>
      <h4>Echokardiografia</h4>
      <p>Badanie z wyboru w pierwszym etapie diagnostyki. Ocenia:</p>
      <ul>
        <li>LVEF — kluczowy parametr klasyfikacyjny</li>
        <li>Geometrię i kurczliwość lewej komory</li>
        <li>Parametry napełniania (E/e' — wskaźnik ciśnienia rozkurczowego)</li>
        <li>Wady zastawkowe i ciśnienie w tętnicy płucnej</li>
      </ul>

      <h4>Peptydy natriuretyczne</h4>
      <p>Stężenie BNP &gt; 35 pg/ml lub NT-proBNP &gt; 125 pg/ml ma wysoką wartość diagnostyczną i prognostyczną. Wartości prawidłowe w dużym stopniu wykluczają NS jako przyczynę duszności.</p>

      <h4>Badania uzupełniające</h4>
      <p><abbr title="electrocardiogram">EKG</abbr>, RTG klatki piersiowej, morfologia, elektrolity, kreatynina, TSH, ferrytyna — umożliwiają identyfikację przyczyny i współistniejących chorób.</p>
    </section>

    <section id="treat">
      <h2>Leczenie</h2>
      <p>Podstawę leczenia HFrEF stanowi farmakoterapia oparta na czterech filarach o udowodnionym wpływie na przeżycie i redukcję hospitalizacji.</p>

      <h3>Cztery filary farmakoterapii HFrEF</h3>
      <ol>
        <li><strong>Inhibitory <abbr title="angiotensin-converting enzyme">ACE</abbr> lub <abbr title="angiotensin receptor-neprilysin inhibitor">ARNI</abbr></strong> (sakubitryl/walsartan — preferowany przy tolerancji)
          <ol>
            <li>Sakubitryl/walsartan: redukcja ryzyka śmierci CV o 20% vs enalapril (PARADIGM-HF)</li>
            <li>Inhibitory ACE: enalapril, ramipril, lizynopril — jeśli ARNI niedostępny</li>
          </ol>
        </li>
        <li><strong>Beta-adrenolityki</strong> — bisoprolol, karwedilol, metoprolol CR/XL
          <ol>
            <li>Titracja do maksymalnej tolerowanej dawki</li>
            <li>Nie odstawiać w zaostrzeniu — zmniejszyć dawkę lub utrzymać</li>
          </ol>
        </li>
        <li><strong>Antagoniści aldosteronu</strong> (<abbr title="mineralocorticoid receptor antagonist">MRA</abbr>): eplerenon, spironolakton</li>
        <li><strong>Inhibitory <abbr title="sodium-glucose co-transporter 2">SGLT2</abbr></strong>: dapagliflozyna, empagliflozyna — redukcja hospitalizacji i śmiertelności niezależnie od cukrzycy</li>
      </ol>

      <h3>Leczenie urządzeniami</h3>
      <h4>ICD — wszczepialny kardiowerter-defibrylator</h4>
      <p>Wskazany przy LVEF ≤ 35% po ≥ 3 miesiącach optymalnej farmakoterapii, gdy oczekiwana długość życia &gt; 1 rok (prewencja nagłego zgonu sercowego).</p>

      <h4>CRT — terapia resynchronizująca</h4>
      <p>Wskazana przy LVEF ≤ 35%, bloku lewej odnogi pęczka Hisa (<abbr title="left bundle branch block">LBBB</abbr>) i QRS ≥ 150 ms — poprawia LVEF i zmniejsza objawy.</p>

      <h3>Leczenie niefarmakologiczne</h3>
      <ul>
        <li>Ograniczenie spożycia sodu (&lt; 2 g/dobę) i płynów (1,5–2 l/dobę w zaawansowanej NS)</li>
        <li>Kontrola masy ciała — codzienny pomiar, alert przy przyroście &gt; 2 kg w 3 dni</li>
        <li>Rehabilitacja kardiologiczna (klasy NYHA I–III) — poprawa wydolności i jakości życia</li>
        <li>Szczepienia: grypa (corocznie), pneumokoki, COVID-19</li>
      </ul>
    </section>

    <section id="prog">
      <h2>Rokowanie</h2>
      <p>Rokowanie w niewydolności serca pozostaje poważne pomimo postępów terapeutycznych. Roczna śmiertelność w zaawansowanej NS (<abbr title="New York Heart Association">NYHA</abbr> IV) wynosi 50–75%.</p>

      <h3>Czynniki prognostyczne</h3>
      <p>Niekorzystne rokowanie wiąże się z:</p>
      <ul>
        <li>Niską LVEF (szczególnie &lt; 20%)</li>
        <li>Wysokim stężeniem NT-proBNP</li>
        <li>Częstymi hospitalizacjami z powodu zaostrzeń</li>
        <li>Współistniejącą przewlekłą chorobą nerek</li>
        <li>Niedokrwistością i hiponatremią</li>
      </ul>

      <h3>Wpływ leczenia na rokowanie</h3>
      <p>Wdrożenie czterech filarów farmakoterapii HFrEF (ARNI + beta-bloker + MRA + SGLT2i) poprawia LVEF (reverse remodeling u 30–40% chorych), zmniejsza liczbę hospitalizacji o ~50% i wydłuża życie o kilka lat w porównaniu z samym inhibitorem ACE.</p>
    </section>
  `,
}

// ── Reader styles ─────────────────────────────────────────────────────────────
// Typography values from McMaster Textbook Figma (W39bi52JWJlHJiGRANwHIx, node 1:1018)
// H2 color override: #8E6D52 (Figma) → #7A003C (brand requirement)

const READER_CSS = `
  .article-body {
    font-family: 'IBM Plex Sans', sans-serif;
    color: #222526;
  }

  /* ── H2 ── */
  .article-body h2 {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 26px;
    color: #7A003C;
    letter-spacing: -0.4px;
    text-transform: uppercase;
    border-top: 2px solid #7A003C;
    border-bottom: 2px solid #7A003C;
    padding: 10px 0;
    margin: 56px 0 24px;
  }

  /* ── H3 ── */
  .article-body h3 {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 19px;
    font-weight: 700;
    line-height: 22px;
    color: #8E6D52;
    letter-spacing: -0.4px;
    border-bottom: 1px solid #8E6D52;
    padding: 6px 0;
    margin: 28px 0 14px;
  }

  /* ── H4 ── */
  .article-body h4 {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    color: #8E6D52;
    letter-spacing: -0.4px;
    border-left: 5px solid #8E6D52;
    padding: 2px 0 2px 14px;
    margin: 20px 0 10px;
  }

  /* ── Paragraphs ── */
  .article-body p {
    font-size: 16px;
    line-height: 26px;
    color: #222526;
    margin-bottom: 12px;
  }

  /* ── Lists ── */
  .article-body ul,
  .article-body ol {
    padding-left: 24px;
    margin: 4px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .article-body ul {
    list-style-type: disc;
  }

  .article-body ol {
    list-style-type: decimal;
  }

  .article-body li {
    font-size: 16px;
    line-height: 24px;
    color: #222526;
  }

  /* Nested lists */
  .article-body li > ol,
  .article-body li > ul {
    margin-top: 6px;
    margin-bottom: 0;
  }

  .article-body ol ol {
    list-style-type: lower-alpha;
  }

  .article-body ol ol ol {
    list-style-type: lower-roman;
  }

  /* ── Medical abbreviations ── */
  .article-body abbr {
    text-decoration: underline dotted;
    text-decoration-color: #A0AAAC;
    cursor: help;
  }

  /* ── Strong ── */
  .article-body strong {
    font-weight: 600;
    color: #222526;
  }

  /* ── Section spacing ── */
  .article-body section {
    display: block;
  }

  .article-body section:first-child h2 {
    margin-top: 0;
  }
`

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

const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconPerson = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 12c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

// ── TOC Panel ─────────────────────────────────────────────────────────────────

function TOCPanel({ toc, activeSection, open, onClose }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
        width: '100%', maxWidth: '430px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        zIndex: 201, transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
        maxHeight: '60vh', display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
            Spis treści
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '4px' }}>
            <IconClose />
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {toc.map(section => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: isActive ? '#7A003C' : 'var(--border-default)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#7A003C' : 'var(--text-primary)',
                  flex: 1,
                }}>
                  {section.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── Article header ────────────────────────────────────────────────────────────

function ArticleHeader({ chapter }) {
  const [showContributors, setShowContributors] = useState(false)

  return (
    <div style={{
      background: '#F2E4D6',
      padding: '24px 20px 20px',
      marginBottom: '0',
    }}>
      {/* Specialty tag */}
      <span style={{
        display: 'inline-block',
        fontFamily: 'var(--font-ui)',
        fontWeight: 600,
        fontSize: '11px',
        color: '#7A003C',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '10px',
      }}>
        {chapter.specialty} · Rozdział {chapter.chapter}
      </span>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: '28px',
        lineHeight: '1.2',
        letterSpacing: '-0.5px',
        color: '#7A003C',
        marginBottom: '14px',
      }}>
        {chapter.title}
      </h1>

      {/* Last reviewed / updated */}
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        lineHeight: '18px',
        color: '#7A003C',
        marginBottom: '14px',
        opacity: 0.85,
      }}>
        <span><strong>Last reviewed:</strong> {chapter.lastReviewed}</span>
        <span style={{ display: 'block' }}><strong>Last updated:</strong> {chapter.lastUpdated}</span>
      </div>

      {/* Contributors toggle */}
      <button
        onClick={() => setShowContributors(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: '1px solid #7A003C',
          borderRadius: '24px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: '#7A003C',
        }}
      >
        <IconPerson />
        Contributors
        <IconChevron open={showContributors} />
      </button>

      {/* Expanded contributors */}
      {showContributors && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chapter.contributors.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.55)',
              borderRadius: '8px',
              padding: '10px 12px',
            }}>
              <div style={{
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', color: '#7A003C',
              }}>
                {c.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#594535', marginTop: '2px',
              }}>
                {c.role} · {c.institution}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── References section ────────────────────────────────────────────────────────

function ReferencesSection({ references }) {
  const [showReferences, setShowReferences] = useState(false)

  return (
    <div style={{
      marginTop: '48px',
      borderTop: '2px solid #7A003C',
      paddingTop: '16px',
    }}>
      <button
        onClick={() => setShowReferences(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          marginBottom: showReferences ? '16px' : '0',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          fontSize: '14px',
          color: '#7A003C',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          References
        </span>
        <span style={{ color: '#7A003C' }}>
          <IconChevron open={showReferences} />
        </span>
      </button>

      {showReferences && (
        <ol style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {references.map((ref, i) => (
            <li key={i} style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              lineHeight: '20px',
              color: '#6B7374',
            }}>
              {ref}
            </li>
          ))}
        </ol>
      )}
    </div>
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

  // Inject reader CSS
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
      entries => {
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

      {/* ── TopBar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: '52px', padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-brand)', display: 'flex', alignItems: 'center', padding: '4px', flexShrink: 0 }}
          aria-label="Wróć"
        >
          <IconBack />
        </button>

        <span style={{
          flex: 1, textAlign: 'center',
          fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '14px',
          color: 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {MOCK_CHAPTER.specialty} · {MOCK_CHAPTER.chapter}
        </span>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => setShowTOC(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '6px', borderRadius: 'var(--radius-sm)' }}
            aria-label="Spis treści"
          >
            <IconList />
          </button>
          <button
            onClick={() => console.log('więcej opcji')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '6px', borderRadius: 'var(--radius-sm)' }}
            aria-label="Więcej opcji"
          >
            <IconMore />
          </button>
        </div>
      </header>

      {/* ── Article header (beige, outside main padding) ── */}
      <ArticleHeader chapter={MOCK_CHAPTER} />

      {/* ── Separator line ── */}
      <div style={{ height: '1px', background: '#E5D1C0' }} />

      {/* ── Article body ── */}
      <main style={{ padding: '8px 20px 140px', maxWidth: '680px', margin: '0 auto' }}>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: MOCK_CHAPTER.content }}
        />
        <ReferencesSection references={MOCK_CHAPTER.references} />
      </main>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px', zIndex: 100,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--glass-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ height: '52px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => console.log('zapisz rozdział')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500, padding: '0', flexShrink: 0 }}
          >
            <IconBookmark />
            Zapisz
          </button>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '3px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#7A003C', borderRadius: '999px', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500, minWidth: '28px' }}>
              {progress}%
            </span>
          </div>

          <button
            onClick={() => console.log('notatka')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500, padding: '0', flexShrink: 0 }}
          >
            <IconNote />
            Notatka
          </button>
        </div>
      </div>

      {/* ── TOC panel ── */}
      <TOCPanel
        toc={MOCK_CHAPTER.toc}
        activeSection={activeSection}
        open={showTOC}
        onClose={() => setShowTOC(false)}
      />
    </div>
  )
}
