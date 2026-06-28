import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'
import { useSavedChapters } from '../hooks/useSavedChapters'
import { useOffline } from '../hooks/useOffline'
import BottomSheet from '../components/BottomSheet'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CHAPTER = {
  id: 'cardiology-3-2',
  title: 'Heart Failure',
  specialty: 'Cardiology',
  chapter: '3.2',
  readTime: '12 min',
  lastReviewed: '15 Nov 2024',
  lastUpdated: '3 Feb 2025',
  contributors: [
    { name: 'Prof. James Walker', role: 'Author', institution: 'McMaster University' },
    { name: 'Dr Sarah Mitchell', role: 'Reviewer', institution: 'University of Toronto' },
    { name: 'Dr David Chen', role: 'Editor', institution: 'McGill University' },
  ],
  references: [
    '1. McDonagh TA, et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2021;42(36):3599-3726.',
    '2. Ponikowski P, et al. 2016 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2016;37(27):2129-2200.',
    '3. Yancy CW, et al. 2017 ACC/AHA/HFSA Focused Update of the 2013 ACCF/AHA Guideline for the Management of Heart Failure. J Am Coll Cardiol. 2017;70(6):776-803.',
  ],
  toc: [
    { id: 'def',   title: 'Definition and Classification' },
    { id: 'etio',  title: 'Etiology' },
    { id: 'path',  title: 'Pathophysiology' },
    { id: 'diag',  title: 'Diagnosis' },
    { id: 'treat', title: 'Treatment' },
    { id: 'prog',  title: 'Prognosis' },
  ],
  content: `
    <section id="def">
      <h2>Definition and Classification</h2>
      <p>Heart failure (<abbr title="heart failure">HF</abbr>) is a clinical syndrome in which the heart is unable to pump sufficient blood to meet the metabolic needs of the body, or can only do so at an abnormally elevated filling pressure.</p>
      <p><abbr title="European Society of Cardiology">ESC</abbr> 2021 classification by <abbr title="left ventricular ejection fraction">LVEF</abbr>:</p>
      <ol>
        <li>Heart failure with reduced ejection fraction (<abbr title="heart failure with reduced ejection fraction">HFrEF</abbr>): LVEF ≤ 40%
          <ol>
            <li>Primary criterion: symptoms ± signs of HF</li>
            <li>Additional criterion: LVEF ≤ 40% on imaging
              <ol>
                <li>Transthoracic echocardiography (investigation of choice)</li>
                <li>Cardiac MRI (gold standard)</li>
                <li>Radionuclide ventriculography (alternative)</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>Heart failure with mildly reduced ejection fraction (<abbr title="heart failure with mildly reduced ejection fraction">HFmrEF</abbr>): LVEF 41–49%</li>
        <li>Heart failure with preserved ejection fraction (<abbr title="heart failure with preserved ejection fraction">HFpEF</abbr>): LVEF ≥ 50%</li>
      </ol>

      <h3>Functional Classification</h3>
      <p>The <abbr title="New York Heart Association">NYHA</abbr> classification assesses symptom severity and exercise tolerance:</p>
      <ul>
        <li><strong>Class I:</strong> no limitation of physical activity</li>
        <li><strong>Class II:</strong> slight limitation — dyspnoea on moderate exertion</li>
        <li><strong>Class III:</strong> marked limitation — dyspnoea on minimal exertion</li>
        <li><strong>Class IV:</strong> symptoms at rest or on minimal effort</li>
      </ul>

      <h4>ACC/AHA Staging</h4>
      <p>This complementary framework includes asymptomatic at-risk patients (Stages A and B), enabling preventive intervention before the development of overt symptomatic disease.</p>
    </section>

    <section id="etio">
      <h2>Etiology</h2>
      <p>The most common cause of heart failure in high-income countries is coronary artery disease (<abbr title="coronary artery disease">CAD</abbr>), accounting for approximately 60–70% of HFrEF cases.</p>

      <h3>Cardiac Causes</h3>
      <p>Cardiac aetiology includes:</p>
      <ul>
        <li>Ischaemic heart disease (myocardial infarction, chronic ischaemia)</li>
        <li>Arterial hypertension — leading to left ventricular hypertrophy</li>
        <li>Cardiomyopathies: dilated, hypertrophic, restrictive, arrhythmogenic</li>
        <li>Valvular disease: regurgitation/stenosis of the mitral or aortic valve</li>
        <li>Arrhythmias: persistent atrial fibrillation (<abbr title="atrial fibrillation">AF</abbr>), tachycardiomyopathy</li>
      </ul>

      <h3>Non-Cardiac Causes</h3>
      <ul>
        <li>Hyper- or hypothyroidism</li>
        <li>Severe anaemia</li>
        <li>Systemic diseases (sarcoidosis, amyloidosis)</li>
        <li>Cardiotoxic drugs (anthracyclines, trastuzumab)</li>
      </ul>

      <h4>Precipitating Factors</h4>
      <p>In patients with stable HF, decompensation may be triggered by: infections (particularly pulmonary), non-adherence to a low-sodium diet and fluid restrictions, withdrawal of medications, and episodes of tachyarrhythmia.</p>
    </section>

    <section id="path">
      <h2>Pathophysiology</h2>
      <p>In response to reduced cardiac output, compensatory mechanisms are activated: the renin–angiotensin–aldosterone system (<abbr title="renin-angiotensin-aldosterone system">RAAS</abbr>), the sympathetic nervous system, and release of natriuretic peptides.</p>
      <p>Sustained activation of these systems leads to adverse cardiac remodelling, further impairing cardiac function and creating a vicious cycle of worsening failure.</p>

      <h3>Neurohormonal Mechanisms</h3>
      <p>Activation of the <abbr title="renin-angiotensin-aldosterone">RAAS</abbr> and sympathetic nervous system is initially beneficial (maintaining blood pressure and organ perfusion), but chronic stimulation:</p>
      <ul>
        <li>Increases cardiac preload and afterload</li>
        <li>Causes sodium and water retention → oedema</li>
        <li>Promotes cardiomyocyte fibrosis and apoptosis</li>
        <li>Predisposes to ventricular arrhythmias</li>
      </ul>

      <h3>Natriuretic Peptides</h3>
      <p><abbr title="B-type natriuretic peptide">BNP</abbr> and <abbr title="N-terminal proBNP">NT-proBNP</abbr> are released by cardiomyocytes in response to increased ventricular wall stress. They exert effects opposing the RAAS: promoting diuresis, natriuresis, and vasodilation.</p>
    </section>

    <section id="diag">
      <h2>Diagnosis</h2>
      <p>The diagnosis of HF rests on a triad of: symptoms, signs, and evidence of cardiac dysfunction on investigation.</p>

      <h3>Symptoms and Signs</h3>
      <ul>
        <li>Dyspnoea — particularly on exertion, orthopnoea, paroxysmal nocturnal dyspnoea (<abbr title="paroxysmal nocturnal dyspnea">PND</abbr>)</li>
        <li>Bilateral ankle oedema (symmetrical, worsening in the evening)</li>
        <li>Fatigue and exercise intolerance</li>
        <li>Basal lung crepitations, third heart sound (S3 gallop)</li>
        <li>Elevated jugular venous pressure (<abbr title="jugular venous pressure">JVP</abbr>)</li>
      </ul>

      <h3>Investigations</h3>
      <h4>Echocardiography</h4>
      <p>The investigation of choice in the initial diagnostic workup. Assesses:</p>
      <ul>
        <li>LVEF — the key classification parameter</li>
        <li>Left ventricular geometry and contractility</li>
        <li>Filling pressures (E/e' — index of diastolic pressure)</li>
        <li>Valvular disease and pulmonary artery pressure</li>
      </ul>

      <h4>Natriuretic Peptides</h4>
      <p>BNP &gt; 35 pg/ml or NT-proBNP &gt; 125 pg/ml has high diagnostic and prognostic value. Normal values largely exclude HF as a cause of dyspnoea.</p>

      <h4>Additional Tests</h4>
      <p><abbr title="electrocardiogram">ECG</abbr>, chest X-ray, full blood count, electrolytes, creatinine, TSH, ferritin — allow identification of the underlying cause and comorbidities.</p>
    </section>

    <section id="treat">
      <h2>Treatment</h2>
      <p>The cornerstone of HFrEF management is pharmacotherapy based on four evidence-based pillars with proven mortality benefit and reduction in hospitalisation.</p>

      <h3>Four Pillars of HFrEF Pharmacotherapy</h3>
      <ol>
        <li><strong><abbr title="angiotensin-converting enzyme">ACE</abbr> inhibitors or <abbr title="angiotensin receptor-neprilysin inhibitor">ARNI</abbr></strong> (sacubitril/valsartan — preferred if tolerated)
          <ol>
            <li>Sacubitril/valsartan: 20% reduction in CV mortality vs enalapril (PARADIGM-HF)</li>
            <li>ACE inhibitors: enalapril, ramipril, lisinopril — if ARNI unavailable</li>
          </ol>
        </li>
        <li><strong>Beta-blockers</strong> — bisoprolol, carvedilol, metoprolol CR/XL
          <ol>
            <li>Titrate to maximum tolerated dose</li>
            <li>Do not withdraw in decompensation — reduce or maintain dose</li>
          </ol>
        </li>
        <li><strong>Mineralocorticoid receptor antagonists</strong> (<abbr title="mineralocorticoid receptor antagonist">MRA</abbr>): eplerenone, spironolactone</li>
        <li><strong><abbr title="sodium-glucose co-transporter 2">SGLT2</abbr> inhibitors</strong>: dapagliflozin, empagliflozin — reduce hospitalisation and mortality regardless of diabetes status</li>
      </ol>

      <h3>Device Therapy</h3>
      <h4>ICD — Implantable Cardioverter-Defibrillator</h4>
      <p>Indicated when LVEF ≤ 35% after ≥ 3 months of optimal medical therapy, with expected survival &gt; 1 year (primary prevention of sudden cardiac death).</p>

      <h4>CRT — Cardiac Resynchronisation Therapy</h4>
      <p>Indicated when LVEF ≤ 35%, left bundle branch block (<abbr title="left bundle branch block">LBBB</abbr>) and QRS ≥ 150 ms — improves LVEF and reduces symptoms.</p>

      <h3>Non-Pharmacological Management</h3>
      <ul>
        <li>Sodium restriction (&lt; 2 g/day) and fluid restriction (1.5–2 L/day in advanced HF)</li>
        <li>Daily weight monitoring — alert if weight increases &gt; 2 kg over 3 days</li>
        <li>Cardiac rehabilitation (NYHA Class I–III) — improves exercise capacity and quality of life</li>
        <li>Vaccinations: influenza (annual), pneumococcal, COVID-19</li>
      </ul>
    </section>

    <section id="prog">
      <h2>Prognosis</h2>
      <p>The prognosis of heart failure remains serious despite therapeutic advances. Annual mortality in advanced HF (<abbr title="New York Heart Association">NYHA</abbr> Class IV) is 50–75%.</p>

      <h3>Prognostic Factors</h3>
      <p>Poor prognosis is associated with:</p>
      <ul>
        <li>Low LVEF (especially &lt; 20%)</li>
        <li>Elevated NT-proBNP concentration</li>
        <li>Frequent hospitalisations for decompensation</li>
        <li>Comorbid chronic kidney disease</li>
        <li>Anaemia and hyponatraemia</li>
      </ul>

      <h3>Impact of Treatment on Prognosis</h3>
      <p>Implementation of the four-pillar HFrEF regimen (ARNI + beta-blocker + MRA + SGLT2i) improves LVEF (reverse remodelling in 30–40% of patients), reduces hospitalisations by ~50%, and extends life by several years compared with ACE inhibitor alone.</p>
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
            Table of contents
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '4px' }}>
            <span className="material-symbols-outlined icon-md">close</span>
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
        {chapter.specialty} · Chapter {chapter.chapter}
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
        <span className="material-symbols-outlined icon-sm">person</span>
        Contributors
        <span className="material-symbols-outlined icon-sm" style={{ transform: showContributors ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>expand_more</span>
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
          <span className="material-symbols-outlined icon-sm" style={{ transform: showReferences ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>expand_more</span>
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

  const { isSaved, saveChapter, removeChapter, addNote } = useSavedChapters()
  const { offlineState } = useOffline()

  const [showTOC, setShowTOC] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('def')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteText, setNoteText] = useState('')

  const saved = isSaved(MOCK_CHAPTER.id)

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
          aria-label="Back"
        >
          <span className="material-symbols-outlined icon-md">arrow_back</span>
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
            aria-label="Table of contents"
          >
            <span className="material-symbols-outlined icon-md">format_list_bulleted</span>
          </button>
          <button
            onClick={() => console.log('więcej opcji')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '6px', borderRadius: 'var(--radius-sm)' }}
            aria-label="More options"
          >
            <span className="material-symbols-outlined icon-md">more_vert</span>
          </button>
        </div>
      </header>

      {/* ── Sync outdated banner ── */}
      {offlineState.syncStatus === 'outdated' && (
        <div className="sync-banner" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px',
          background: 'var(--color-background-warning, #FFFBEB)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-text-warning, #B45309)', flexShrink: 0 }}>sync_problem</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-text-warning, #B45309)', lineHeight: 1.4 }}>
            This content may be outdated · last synced {offlineState.lastSync ? new Date(offlineState.lastSync).toLocaleDateString('en-GB') : '—'}
          </span>
        </div>
      )}

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
          {/* Zapisz */}
          <button
            onClick={() => saved ? removeChapter(MOCK_CHAPTER.id) : saveChapter(MOCK_CHAPTER)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: saved ? 'var(--interactive-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', fontSize: '13px',
              fontWeight: saved ? 600 : 500,
              padding: '0', flexShrink: 0,
              transition: 'color 0.15s',
            }}
          >
            <span className={`material-symbols-outlined icon-sm${saved ? ' filled' : ''}`}>bookmark</span>
            {saved ? 'Saved' : 'Save'}
          </button>

          {/* Progress */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '3px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#7A003C', borderRadius: '999px', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500, minWidth: '28px' }}>
              {progress}%
            </span>
          </div>

          {/* Notatka */}
          <button
            onClick={() => setShowNoteInput(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
              padding: '0', flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined icon-sm">edit_note</span>
            Note
          </button>
        </div>
      </div>

      {/* ── Note bottom sheet ── */}
      <BottomSheet
        isOpen={showNoteInput}
        onClose={() => setShowNoteInput(false)}
        title="Add note"
      >
        <div style={{ padding: '12px 20px 20px' }}>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Your notes for this chapter..."
            autoFocus
            style={{
              width: '100%',
              minHeight: '120px',
              border: '1.5px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              lineHeight: '1.6',
              resize: 'none',
              background: 'var(--bg-app)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => {
              if (!isSaved(MOCK_CHAPTER.id)) saveChapter(MOCK_CHAPTER)
              addNote(MOCK_CHAPTER.id, noteText)
              setShowNoteInput(false)
            }}
            style={{
              marginTop: '12px',
              width: '100%',
              height: '48px',
              background: 'var(--interactive-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save note
          </button>
        </div>
      </BottomSheet>

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
