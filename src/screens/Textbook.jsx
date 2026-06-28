import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../components/BottomSheet'

// MOCK NAVIGATION HELPERS — swap when real IDs are available
const getMockChapterRoute = (_id) => '/reader/cardiology-heart-failure'
const getMockVideoRoute   = (_id) => '/video/v-ebm-founder'
const getMockCalcRoute    = (_id) => '/calculator/score2'

const ELEARNING_PER_SPECIALTY = {
  allergy: [
    { id: 'v-anaphylaxis', type: 'video', title: 'Anaphylaxis — clinical approach', duration: '14 min' },
  ],
  cardiovascular: [
    { id: 'v-doacs-vte', type: 'video', title: 'DOACs for acute VTE', duration: '22 min' },
    { id: 'v-ebm-founder', type: 'video', title: 'Heart Failure — Overview', duration: '18 min' },
    { id: 'score2', type: 'calculator', title: 'SCORE2 Risk Calculator' },
    { id: 'calc-grace', type: 'calculator', title: 'GRACE Score' },
  ],
  electrolyte: [
    { id: 'calc-sodium', type: 'calculator', title: 'Sodium correction calculator' },
    { id: 'v-acidbase', type: 'video', title: 'Acid-base disorders — an approach', duration: '19 min' },
  ],
  endocrinology: [
    { id: 'hba1c', type: 'calculator', title: 'HbA1c Converter' },
    { id: 'v-obesity-drugs', type: 'video', title: 'What to know about obesity before we talk about drugs', duration: '16 min' },
    { id: 'v-diabetes-update', type: 'video', title: 'Diabetes management update', duration: '20 min' },
  ],
  gastroenterology: [
    { id: 'v-gastro1', type: 'video', title: 'IBD — practical update', duration: '17 min' },
  ],
  hematology: [
    { id: 'v-doacs-vte', type: 'video', title: 'DOACs for acute VTE', duration: '22 min' },
    { id: 'calc-inr', type: 'calculator', title: 'INR target calculator' },
  ],
  infectious: [
    { id: 'v-h5n1', type: 'video', title: 'H5N1: An update', duration: '24 min' },
    { id: 'v-infect2', type: 'video', title: 'Antimicrobial stewardship', duration: '21 min' },
    { id: 'calc-abx', type: 'calculator', title: 'Antibiotic dose calculator' },
  ],
  nephrology: [
    { id: 'gfr', type: 'calculator', title: 'eGFR Calculator (CKD-EPI)' },
  ],
  neurology: [
    { id: 'v-stroke', type: 'video', title: 'Ischaemic stroke — acute management', duration: '20 min' },
    { id: 'calc-nihss', type: 'calculator', title: 'NIHSS Stroke Scale' },
  ],
  palliative: [
    { id: 'v-palliative', type: 'video', title: 'Opioid titration in palliative care', duration: '15 min' },
  ],
  psychiatry: [
    { id: 'v-psych', type: 'video', title: 'Anxiety disorders — overview', duration: '13 min' },
  ],
  respirology: [
    { id: 'v-asthma', type: 'video', title: 'Asthma — step-up therapy', duration: '16 min' },
    { id: 'v-copd', type: 'video', title: 'COPD exacerbation management', duration: '18 min' },
    { id: 'calc-pef', type: 'calculator', title: 'Peak Flow % predicted' },
  ],
  rheumatology: [
    { id: 'v-rheum', type: 'video', title: 'Early RA — treat to target', duration: '14 min' },
  ],
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_TEXTBOOK = [
  {
    id: 'allergy', name: 'Allergy and Immunology', chapterCount: 7, elearningCount: 1, type: 'specialty',
    chapters: [
      { id: 'allergy-rhinitis', name: 'Allergic Rhinitis', readTime: '14 min', hasVideo: false, hasCalculator: false, sections: [
        { id: 'allergy-rhinitis-def', title: 'Definition, Etiology, Pathogenesis' },
        { id: 'allergy-rhinitis-clinical', title: 'Clinical Features' },
        { id: 'allergy-rhinitis-diagnosis', title: 'Diagnosis' },
        { id: 'allergy-rhinitis-treatment', title: 'Treatment' },
      ]},
      { id: 'allergy-anaphylaxis', name: 'Anaphylaxis and Anaphylactic Shock', readTime: '18 min', hasVideo: true, hasCalculator: false, sections: [
        { id: 'allergy-anaphylaxis-def', title: 'Definition, Etiology, Pathogenesis' },
        { id: 'allergy-anaphylaxis-clinical', title: 'Clinical Features' },
        { id: 'allergy-anaphylaxis-diagnosis', title: 'Diagnosis' },
        { id: 'allergy-anaphylaxis-treatment', title: 'Treatment' },
        { id: 'allergy-anaphylaxis-prevention', title: 'Prevention' },
      ]},
      { id: 'allergy-angioedema', name: 'Angioedema', readTime: '10 min', hasVideo: false, hasCalculator: false, sections: [] },
      { id: 'allergy-food', name: 'Food Hypersensitivity', readTime: '12 min', hasVideo: false, hasCalculator: false, sections: [] },
      { id: 'allergy-immunodeficiency', name: 'Immunodeficiency Diseases', readTime: '20 min', hasVideo: false, hasCalculator: true, sections: [] },
      { id: 'allergy-serum', name: 'Serum Sickness', readTime: '8 min', hasVideo: false, hasCalculator: false, sections: [] },
      { id: 'allergy-urticaria', name: 'Urticaria', readTime: '11 min', hasVideo: false, hasCalculator: false, sections: [] },
    ],
  },
  {
    id: 'cardiovascular', name: 'Cardiovascular Diseases', chapterCount: 31, elearningCount: 4, type: 'specialty',
    chapters: [
      { id: 'cardiology-heart-failure', name: 'Heart Failure', readTime: '12 min', hasVideo: true, hasCalculator: true, sections: [
        { id: 'cardiology-hf-def', title: 'Definition, Etiology, Pathogenesis' },
        { id: 'cardiology-hf-clinical', title: 'Clinical Features' },
        { id: 'cardiology-hf-diagnosis', title: 'Diagnosis' },
        { id: 'cardiology-hf-treatment', title: 'Treatment' },
        { id: 'cardiology-hf-prognosis', title: 'Prognosis' },
      ]},
      { id: 'cardiology-hypertension', name: 'Arterial Hypertension', readTime: '15 min', hasVideo: true, hasCalculator: false, sections: [] },
      { id: 'cardiology-afib', name: 'Atrial Fibrillation', readTime: '22 min', hasVideo: false, hasCalculator: true, sections: [] },
      { id: 'cardiology-stable-cad', name: 'Stable Coronary Artery Disease', readTime: '18 min', hasVideo: false, hasCalculator: false, sections: [] },
      { id: 'cardiology-acs', name: 'Acute Coronary Syndromes', readTime: '25 min', hasVideo: true, hasCalculator: true, sections: [] },
    ],
  },
  { id: 'dermatology', name: 'Dermatology', chapterCount: 6, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'electrolyte', name: 'Electrolyte, Fluid, and Acid-Base Balance Disorders', chapterCount: 9, elearningCount: 2, type: 'specialty', chapters: [] },
  { id: 'endocrinology', name: 'Endocrinology', chapterCount: 14, elearningCount: 3, type: 'specialty', chapters: [
    { id: 'endo-diabetes2', name: 'Type 2 Diabetes Mellitus', readTime: '18 min', hasVideo: true, hasCalculator: true, sections: [
      { id: 'endo-dm2-def', title: 'Definition and Classification' },
      { id: 'endo-dm2-diagnosis', title: 'Diagnosis' },
      { id: 'endo-dm2-treatment', title: 'Treatment' },
      { id: 'endo-dm2-complications', title: 'Complications' },
    ]},
    { id: 'endo-hypothyroidism', name: 'Hypothyroidism', readTime: '14 min', hasVideo: false, hasCalculator: false, sections: [] },
    { id: 'endo-obesity', name: 'Obesity', readTime: '16 min', hasVideo: true, hasCalculator: true, sections: [] },
  ]},
  { id: 'gastroenterology', name: 'Gastroenterology', chapterCount: 16, elearningCount: 1, type: 'specialty', chapters: [] },
  { id: 'geriatrics', name: 'Geriatrics', chapterCount: 5, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'hematology', name: 'Hematology', chapterCount: 18, elearningCount: 2, type: 'specialty', chapters: [] },
  { id: 'infectious', name: 'Infectious Diseases', chapterCount: 22, elearningCount: 3, type: 'specialty', chapters: [] },
  { id: 'nephrology', name: 'Nephrology', chapterCount: 12, elearningCount: 1, type: 'specialty', chapters: [] },
  { id: 'neurology', name: 'Neurology', chapterCount: 15, elearningCount: 2, type: 'specialty', chapters: [
    { id: 'neuro-stroke', name: 'Ischaemic Stroke', readTime: '20 min', hasVideo: true, hasCalculator: false, sections: [
      { id: 'neuro-stroke-def', title: 'Definition, Etiology, Pathogenesis' },
      { id: 'neuro-stroke-clinical', title: 'Clinical Features' },
      { id: 'neuro-stroke-diagnosis', title: 'Diagnosis' },
      { id: 'neuro-stroke-treatment', title: 'Treatment' },
    ]},
    { id: 'neuro-hemorrhagic', name: 'Haemorrhagic Stroke', readTime: '14 min', hasVideo: false, hasCalculator: false, sections: [] },
    { id: 'neuro-epilepsy', name: 'Epilepsy', readTime: '19 min', hasVideo: false, hasCalculator: true, sections: [] },
  ]},
  { id: 'oncology', name: 'Oncology: Medical Complications of Treatment', chapterCount: 7, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'palliative', name: 'Palliative Care', chapterCount: 4, elearningCount: 1, type: 'specialty', chapters: [] },
  { id: 'pregnancy', name: 'Pregnancy-Related Conditions', chapterCount: 6, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'psychiatry', name: 'Psychiatry', chapterCount: 9, elearningCount: 1, type: 'specialty', chapters: [] },
  { id: 'respirology', name: 'Respirology', chapterCount: 19, elearningCount: 3, type: 'specialty', chapters: [] },
  { id: 'rheumatology', name: 'Rheumatology', chapterCount: 13, elearningCount: 1, type: 'specialty', chapters: [] },
  { id: 'toxicology', name: 'Toxicology and Addiction', chapterCount: 5, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'signs', name: 'Signs and Symptoms', chapterCount: 11, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'diagnostic', name: 'Noninvasive Diagnostic Tests', chapterCount: 8, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'procedures', name: 'Procedures', chapterCount: 6, elearningCount: 0, type: 'specialty', chapters: [] },
  { id: 'trauma', name: 'Trauma and Injuries', chapterCount: 4, elearningCount: 0, type: 'specialty', chapters: [] },
]

const REFERENCES = [{ id: 'abbreviations', name: 'Abbreviations' }]
const INFO_PAGES  = [
  { id: 'about', name: 'About' },
  { id: 'cme', name: 'CPD/CME credits' },
  { id: 'editors', name: 'Editors' },
  { id: 'grade', name: 'GRADE System' },
  { id: 'copyright', name: 'Copyright and Disclaimer' },
]

// ── E-learning mock ───────────────────────────────────────────────────────────

const MOCK_VIDEOS = [
  { id: 'v-ebm-founder', title: 'All you need to know about EBM', specialty: 'McMaster Perspective', duration: '32 min', color: '#7A003C' },
  { id: 'v-doacs-vte', title: 'DOACs for acute VTE', specialty: 'Cardiology', duration: '18 min', color: '#185FA5' },
  { id: 'v-h5n1', title: 'H5N1: An update', specialty: 'Infectious diseases', duration: '24 min', color: '#C0392B' },
  { id: 'v-obesity-drugs', title: 'Obesity before drugs', specialty: 'Endocrinology', duration: '15 min', color: '#0F6E56' },
]

const MOCK_CALCULATORS = [
  { id: 'score2', title: 'Cardiac Risk Calculator', subtitle: 'SCORE2 — 10-year risk', specialty: 'Cardiology' },
  { id: 'hba1c', title: 'HbA1c Converter', subtitle: 'mmol/mol ↔ %', specialty: 'Endocrinology' },
  { id: 'bmi', title: 'BMI Calculator', subtitle: 'Body Mass Index', specialty: 'General' },
  { id: 'gfr', title: 'eGFR Calculator', subtitle: 'CKD-EPI — kidney function', specialty: 'Nephrology' },
]

// ── Transition ────────────────────────────────────────────────────────────────

function useSlide(key) {
  const [visible, setVisible] = useState(true)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setVisible(false)
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(t)
  }, [key])
  return visible
}

// ── Level 1 — Specialties ─────────────────────────────────────────────────────

function SpecialtiesView({ onSelect, tab, setTab, navigate, onElearningBadge }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const isSearching = q.length > 0
  const filtered = MOCK_TEXTBOOK.filter(s => s.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Textbook
      </h1>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
        padding: '0 12px', height: '44px', border: '1px solid var(--border-default)',
        borderRadius: '999px', background: 'var(--bg-surface)',
      }}>
        <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>search</span>
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Find a specialty..."
          style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-ui)', fontSize: '15px', background: 'transparent', color: 'var(--text-primary)' }}
        />
        {q && (
          <button onClick={() => { setQ(''); inputRef.current?.focus() }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px', color: 'var(--text-tertiary)' }}>
            <span className="material-symbols-outlined icon-sm">close</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      {!isSearching && (
        <div style={{ display: 'flex', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px', marginLeft: '-16px', marginRight: '-16px' }}>
          {[
            { id: 'textbook', label: 'Textbook', icon: 'menu_book' },
            { id: 'elearning', label: 'E-learning', icon: 'play_circle' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, height: '40px', background: 'none', border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--interactive-primary)' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: tab === t.id ? 600 : 400,
              fontSize: '14px', color: tab === t.id ? 'var(--text-brand)' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Textbook tab / search */}
      {(tab === 'textbook' || isSearching) && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {filtered.map(s => (
              <button key={s.id} onClick={() => onSelect(s)} style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '14px 12px', background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sygnet)', cursor: 'pointer', minHeight: '80px', textAlign: 'left',
              }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {s.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {s.chapterCount} ch.
                  </span>
                  {s.elearningCount > 0 && (
                    <button
                      onClick={e => { e.stopPropagation(); onElearningBadge(s) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '2px',
                        fontSize: '11px', fontFamily: 'var(--font-ui)', color: '#185FA5',
                        background: '#E6F1FB', border: 'none', borderRadius: '999px',
                        padding: '2px 7px', cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>play_circle</span>
                      {s.elearningCount}
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>search_off</span>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px' }}>No specialties match "{q}"</p>
              <button onClick={() => setQ('')} style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--interactive-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear search</button>
            </div>
          )}

          {!isSearching && (
            <>
              {/* References */}
              <div style={{ marginBottom: '8px' }}>
                {REFERENCES.map(ref => (
                  <div key={ref.id} onClick={() => navigate(`/textbook/${ref.id}`)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px',
                  }}>
                    <span className="material-symbols-outlined icon-sm">list_alt</span>
                    <span style={{ flex: 1 }}>{ref.name}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-tertiary)' }}>chevron_right</span>
                  </div>
                ))}
              </div>
              {/* Info links */}
              <div style={{ paddingBottom: '24px' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>More</span>
                {INFO_PAGES.map((page, i) => (
                  <div key={page.id} onClick={() => navigate(`/textbook/${page.id}`)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0', borderBottom: i < INFO_PAGES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    <span>{page.name}</span>
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)' }}>chevron_right</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* E-learning tab */}
      {tab === 'elearning' && !isSearching && <ELearningView navigate={navigate} />}
    </div>
  )
}

// ── Level 2 — Chapters ────────────────────────────────────────────────────────

function ChaptersView({ specialty, onBack, navigate, onElearningBadge }) {
  const [expanded, setExpanded] = useState({})

  function toggle(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const chapters = specialty.chapters

  return (
    <div>

      {/* Sticky back header — full-bleed via negative margin */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', position: 'sticky', top: '60px', zIndex: 50,
        margin: '0 -16px',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--interactive-primary)',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
        }}>
          <span className="material-symbols-outlined icon-sm">arrow_back</span>
          Textbook
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {specialty.name}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', margin: '0 -16px' }}>
        <span>{specialty.chapterCount} chapters</span>
        {specialty.elearningCount > 0 && (
          <button
            onClick={() => onElearningBadge(specialty)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#185FA5', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '12px',
              background: '#E6F1FB', border: 'none', borderRadius: '999px',
              padding: '3px 10px', cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_circle</span>
            {specialty.elearningCount} e-learning
          </button>
        )}
      </div>

      {/* Chapters list */}
      {chapters.length > 0 ? (
        <div style={{ paddingBottom: '80px' }}>
          {chapters.map(chapter => (
            <div key={chapter.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>

              {/* Chapter row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0', minHeight: '60px', gap: '8px' }}>
                <div
                  onClick={() => navigate(getMockChapterRoute(chapter.id))}
                  style={{ flex: 1, padding: '14px 0', cursor: 'pointer' }}
                >
                  <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                    {chapter.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)' }}>{chapter.readTime}</span>
                    {chapter.hasVideo && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(getMockVideoRoute(chapter.id)) }}
                        title="Watch related video"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: '#E6F1FB', border: 'none', borderRadius: '999px',
                          padding: '4px 8px', minHeight: '28px', minWidth: '44px',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#185FA5' }}>play_circle</span>
                      </button>
                    )}
                    {chapter.hasCalculator && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(getMockCalcRoute(chapter.id)) }}
                        title="Open related calculator"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: '#E6F1FB', border: 'none', borderRadius: '999px',
                          padding: '4px 8px', minHeight: '28px', minWidth: '44px',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#185FA5' }}>calculate</span>
                      </button>
                    )}
                  </div>
                </div>

                {chapter.sections.length > 0 && (
                  <button
                    onClick={() => toggle(chapter.id)}
                    aria-label={expanded[chapter.id] ? 'Collapse' : 'Expand'}
                    style={{
                      flexShrink: 0, width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-subtle)', border: 'none', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', color: 'var(--text-secondary)',
                    }}
                  >
                    <span className="material-symbols-outlined icon-sm">
                      {expanded[chapter.id] ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                )}
              </div>

              {/* Sections — expanded inline */}
              {expanded[chapter.id] && chapter.sections.length > 0 && (
                <div style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
                  {chapter.sections.map((section, i) => (
                    <div
                      key={section.id}
                      onClick={() => navigate(`${getMockChapterRoute(chapter.id)}#${section.id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 0 10px 20px',
                        borderBottom: i < chapter.sections.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-tertiary)', flexShrink: 0 }}>subdirectory_arrow_right</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.3 }}>
                        {section.title}
                      </span>
                      <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-tertiary)' }}>chevron_right</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '36px', marginBottom: '12px' }}>menu_book</span>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px' }}>Content coming soon</p>
        </div>
      )}
    </div>
  )
}

// ── E-learning view ───────────────────────────────────────────────────────────

function ELearningView({ navigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Video
        </h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginLeft: '-16px', marginRight: '-16px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {MOCK_VIDEOS.map(v => (
            <button key={v.id} onClick={() => navigate(getMockVideoRoute(v.id))} style={{
              width: '200px', flexShrink: 0, background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', cursor: 'pointer', textAlign: 'left', padding: 0,
            }}>
              <div style={{ height: '112px', background: v.color + '26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '36px', color: v.color }}>play_circle</span>
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '6px' }}>
                  {v.title}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {v.specialty} · {v.duration}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Calculators
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MOCK_CALCULATORS.map(c => (
            <button key={c.id} onClick={() => navigate(getMockCalcRoute(c.id))} style={{
              width: '100%', height: '64px', padding: '0 16px',
              background: 'var(--bg-surface)', border: 'none',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
            }}>
              <span style={{ color: 'var(--interactive-primary)', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-sm">calculate</span>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>{c.specialty} · {c.subtitle}</div>
              </div>
              <span style={{ color: 'var(--text-tertiary)' }}>
                <span className="material-symbols-outlined icon-sm">chevron_right</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Slide pane ────────────────────────────────────────────────────────────────

function SlidePane({ viewKey, children }) {
  const visible = useSlide(viewKey)
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(24px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}>
      {children}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Textbook() {
  const navigate = useNavigate()
  const [view, setView] = useState('specialties')
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [tab, setTab] = useState('textbook')
  const [elearningPreview, setElearningPreview] = useState(null)

  function selectSpecialty(s) {
    setSelectedSpecialty(s)
    setView('chapters')
  }

  function goToSpecialties() {
    setView('specialties')
    setSelectedSpecialty(null)
  }

  function openElearningBadge(specialty) {
    setElearningPreview({
      specialtyName: specialty.name,
      items: ELEARNING_PER_SPECIALTY[specialty.id] || [],
    })
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%', padding: view === 'chapters' ? '0 16px' : 'var(--spacing-4) var(--spacing-4) var(--spacing-6)' }}>

      {view === 'specialties' && (
        <SlidePane viewKey="specialties">
          <SpecialtiesView
            onSelect={selectSpecialty}
            tab={tab} setTab={setTab}
            navigate={navigate}
            onElearningBadge={openElearningBadge}
          />
        </SlidePane>
      )}

      {view === 'chapters' && selectedSpecialty && (
        <SlidePane viewKey={`chapters-${selectedSpecialty.id}`}>
          <ChaptersView
            specialty={selectedSpecialty}
            onBack={goToSpecialties}
            navigate={navigate}
            onElearningBadge={openElearningBadge}
          />
        </SlidePane>
      )}

      {/* E-learning drawer */}
      <BottomSheet
        isOpen={!!elearningPreview}
        onClose={() => setElearningPreview(null)}
        title={elearningPreview ? `E-learning · ${elearningPreview.specialtyName}` : ''}
      >
        {elearningPreview?.items.length === 0 && (
          <div style={{ padding: '24px 20px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-tertiary)' }}>
            No e-learning content available yet.
          </div>
        )}
        {elearningPreview?.items.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setElearningPreview(null)
              navigate(item.type === 'video' ? getMockVideoRoute(item.id) : getMockCalcRoute(item.id))
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px', cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: item.type === 'video' ? '#185FA5' : 'var(--interactive-primary)', flexShrink: 0 }}>
              {item.type === 'video' ? 'play_circle' : 'calculate'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {item.title}
              </div>
              {item.duration && (
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {item.duration}
                </div>
              )}
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-tertiary)', flexShrink: 0 }}>chevron_right</span>
          </div>
        ))}
      </BottomSheet>
    </div>
  )
}
