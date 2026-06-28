import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'
import { useSavedChapters } from '../hooks/useSavedChapters'
import { useOffline } from '../hooks/useOffline'
import ContentLayout from '../components/ContentLayout'

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

const RELATED_ELEARNING = [
  { id: 'v-ebm-founder', type: 'video', title: 'All you need to know about EBM', duration: '32 min' },
  { id: 'v-doacs-vte', type: 'video', title: 'DOACs for acute VTE', duration: '22 min' },
  { id: 'score2', type: 'calculator', title: 'SCORE2 Cardiac Risk Calculator' },
]

const PREV_CHAPTER = { id: 'cardiology-3-1', title: 'Cardiac Diagnostics' }
const NEXT_CHAPTER = { id: 'cardiology-4-1', title: 'Arterial Hypertension' }

// ── Reader CSS ────────────────────────────────────────────────────────────────

const READER_CSS = `
  .article-body {
    font-family: 'IBM Plex Sans', sans-serif;
    color: #222526;
  }

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

  .article-body p {
    font-size: 16px;
    line-height: 26px;
    color: #222526;
    margin-bottom: 12px;
  }

  .article-body ul,
  .article-body ol {
    padding-left: 24px;
    margin: 4px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .article-body ul { list-style-type: disc; }
  .article-body ol { list-style-type: decimal; }

  .article-body li {
    font-size: 16px;
    line-height: 24px;
    color: #222526;
  }

  .article-body li > ol,
  .article-body li > ul {
    margin-top: 6px;
    margin-bottom: 0;
  }

  .article-body ol ol { list-style-type: lower-alpha; }
  .article-body ol ol ol { list-style-type: lower-roman; }

  .article-body abbr {
    text-decoration: underline dotted;
    text-decoration-color: #A0AAAC;
    cursor: help;
  }

  .article-body strong {
    font-weight: 600;
    color: #222526;
  }

  .article-body section { display: block; }
  .article-body section:first-child h2 { margin-top: 0; }

  /* Topbar */
  .reader-topbar {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    z-index: 100;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    transition: transform 0.25s ease;
  }
  .reader-topbar.hidden {
    transform: translateX(-50%) translateY(-100%);
  }
  .reader-topbar-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 8px 0 4px;
  }
  .reader-back-btn,
  .reader-more-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    flex-shrink: 0;
  }
  .reader-back-btn:active,
  .reader-more-btn:active { background: var(--bg-subtle); }
  .reader-location {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-align: center;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 8px;
  }
  .reader-progress-bar {
    height: 3px;
    background: var(--border-subtle);
    width: 100%;
  }
  .reader-progress-fill {
    height: 100%;
    background: var(--interactive-primary);
    border-radius: 0 2px 2px 0;
    transition: width 0.1s linear;
  }

  /* Floating panel */
  .reader-floating-panel {
    position: fixed;
    bottom: calc(16px + env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 2px;
    background: var(--interactive-primary);
    border-radius: 999px;
    padding: 6px 10px;
    box-shadow: 0 4px 20px rgba(122, 0, 60, 0.35);
  }
  .floating-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 14px;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.85);
    cursor: pointer;
    transition: background 0.15s;
    min-width: 56px;
  }
  .floating-action:active,
  .floating-action.active {
    background: rgba(255,255,255,0.2);
    color: white;
  }
  .floating-action .material-symbols-outlined { font-size: 22px; }
  .floating-action-label {
    font-size: 10px;
    font-weight: 500;
    font-family: var(--font-ui);
    white-space: nowrap;
  }

  /* Drawers */
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 110;
  }
  .reader-drawer {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: var(--bg-surface);
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    z-index: 120;
    padding-bottom: env(safe-area-inset-bottom);
    animation: drawerUp 0.25s ease;
  }
  @keyframes drawerUp {
    from { transform: translateX(-50%) translateY(100%); }
    to   { transform: translateX(-50%) translateY(0); }
  }
  .drawer-handle {
    width: 36px;
    height: 4px;
    background: var(--border-default);
    border-radius: 2px;
    margin: 12px auto 0;
  }
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 0;
  }
  .drawer-title {
    font-family: var(--font-ui);
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }
  .drawer-close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-subtle);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: var(--text-secondary);
  }
  .drawer-content {
    padding: 12px 20px 24px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .drawer-footer {
    border-top: 1px solid var(--border-subtle);
    padding: 12px 20px 20px;
  }

  /* Save drawer */
  .folder-option {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 1px solid var(--border-subtle);
    text-align: left;
  }
  .folder-option:last-child { border-bottom: none; }
  .folder-option:active { opacity: 0.7; }
  .folder-option-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .folder-option-name {
    font-family: var(--font-ui);
    font-size: 15px;
    font-weight: 500;
    color: var(--text-primary);
    flex: 1;
  }
  .folder-check { font-size: 20px; color: var(--interactive-primary); }
  .unsave-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-ui);
    font-size: 14px;
    color: #C0392B;
  }

  /* Note drawer */
  .note-textarea {
    width: 100%;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: 12px;
    font-family: var(--font-ui);
    font-size: 15px;
    line-height: 1.6;
    resize: none;
    color: var(--text-primary);
    background: var(--bg-surface);
    margin-bottom: 12px;
    box-sizing: border-box;
  }
  .note-textarea:focus {
    outline: none;
    border-color: var(--interactive-primary);
  }
  .drawer-primary-btn {
    width: 100%;
    height: 48px;
    background: var(--interactive-primary);
    color: white;
    border: none;
    border-radius: 999px;
    font-family: var(--font-ui);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  /* TOC drawer */
  .toc-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 1px solid var(--border-subtle);
    text-align: left;
  }
  .toc-item:last-child { border-bottom: none; }
  .toc-item.active .toc-item-title {
    color: var(--interactive-primary);
    font-weight: 600;
  }
  .toc-dot, .toc-active-dot { font-size: 16px; flex-shrink: 0; color: var(--text-tertiary); }
  .toc-active-dot { color: var(--interactive-primary); }
  .toc-item-title {
    font-family: var(--font-ui);
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.3;
  }

  /* E-learning drawer */
  .elearning-drawer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 1px solid var(--border-subtle);
    text-align: left;
  }
  .elearning-drawer-item:last-child { border-bottom: none; }
  .elearning-item-icon { font-size: 22px; color: #185FA5; flex-shrink: 0; }
  .elearning-item-body { flex: 1; min-width: 0; }
  .elearning-item-title {
    display: block;
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.3;
  }
  .elearning-item-meta {
    display: block;
    font-family: var(--font-ui);
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }
  .elearning-item-hint {
    display: block;
    font-family: var(--font-ui);
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  /* Settings drawer */
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .setting-row:last-child { border-bottom: none; }
  .setting-label {
    font-family: var(--font-ui);
    font-size: 15px;
    color: var(--text-primary);
  }
  .font-size-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .font-size-controls button {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-default);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
  }
  .font-size-value {
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    min-width: 36px;
    text-align: center;
  }
  .toggle {
    width: 48px;
    height: 28px;
    border-radius: 999px;
    background: var(--border-default);
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle.on { background: var(--interactive-primary); }
  .toggle.on::after { transform: translateX(20px); }
`

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Reader() {
  const navigate = useNavigate()
  const { chapterId } = useParams()
  const { setLastRead } = useReadingHistory()
  const { isSaved, saveChapter, removeChapter, addNote, folders, createFolder } = useSavedChapters()
  const { offlineState } = useOffline()

  const [topbarVisible, setTopbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('def')
  const [activeDrawer, setActiveDrawer] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [fontSize, setFontSize] = useState(17)
  const [darkMode, setDarkMode] = useState(false)

  const HAS_ELEARNING = RELATED_ELEARNING.length > 0

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'reader-styles'
    style.textContent = READER_CSS
    if (!document.getElementById('reader-styles')) document.head.appendChild(style)
    return () => document.getElementById('reader-styles')?.remove()
  }, [])

  // Reading history
  useEffect(() => {
    setLastRead({ chapterId: MOCK_CHAPTER.id, title: MOCK_CHAPTER.title, specialty: MOCK_CHAPTER.specialty })
  }, [])

  // Scroll: progress + hide/show topbar
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      if (total > 0) setProgress(Math.round((currentY / total) * 100))
      if (currentY > lastScrollY && currentY > 60) {
        setTopbarVisible(false)
      } else {
        setTopbarVisible(true)
      }
      setLastScrollY(currentY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }) },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    MOCK_CHAPTER.toc.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const saved = isSaved(MOCK_CHAPTER.id)

  function closeDrawer() { setActiveDrawer(null) }

  return (
    <div style={{ background: darkMode ? '#1a1a1a' : 'var(--bg-app)', minHeight: '100dvh' }}>

      {/* ── Topbar ── */}
      <div className={`reader-topbar ${topbarVisible ? '' : 'hidden'}`}>
        <div className="reader-topbar-main">
          <button className="reader-back-btn" onClick={() => navigate(-1)} aria-label="Back">
            <span className="material-symbols-outlined icon-md">arrow_back</span>
          </button>
          <span className="reader-location">{MOCK_CHAPTER.specialty} · Ch. {MOCK_CHAPTER.chapter}</span>
          <button className="reader-more-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
            <span className="material-symbols-outlined icon-md">more_vert</span>
          </button>
        </div>
        <div className="reader-progress-bar">
          <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Sync banner ── */}
      {offlineState.syncStatus === 'outdated' && (
        <div className="sync-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', marginTop: '55px', background: '#FFFBEB', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="material-symbols-outlined icon-sm" style={{ color: '#B45309', flexShrink: 0 }}>sync_problem</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#B45309', lineHeight: 1.4 }}>
            This content may be outdated · last synced {offlineState.lastSync ? new Date(offlineState.lastSync).toLocaleDateString('en-GB') : '—'}
          </span>
        </div>
      )}

      {/* ── Article ── */}
      <div style={{ paddingTop: '55px', paddingBottom: '120px' }}>
        <ContentLayout
          badge={{ label: 'Premium', color: 'info' }}
          category={`${MOCK_CHAPTER.specialty} · Chapter ${MOCK_CHAPTER.chapter}`}
          title={MOCK_CHAPTER.title}
          lastReviewed="15 Nov 2024"
          lastUpdated="3 Feb 2025"
          authors={MOCK_CHAPTER.contributors}
          references={MOCK_CHAPTER.references}
          prevChapter={PREV_CHAPTER}
          nextChapter={NEXT_CHAPTER}
        >
          <div
            className="article-body"
            style={{ fontSize: `${fontSize}px`, color: darkMode ? '#e8e8e8' : undefined }}
            dangerouslySetInnerHTML={{ __html: MOCK_CHAPTER.content }}
          />
        </ContentLayout>
      </div>

      {/* ── Floating panel ── */}
      <div className="reader-floating-panel">
        <button
          className={`floating-action ${activeDrawer === 'save' ? 'active' : ''}`}
          onClick={() => setActiveDrawer(activeDrawer === 'save' ? null : 'save')}
        >
          <span className="material-symbols-outlined">{saved ? 'bookmark_added' : 'bookmark'}</span>
          <span className="floating-action-label">Save</span>
        </button>

        <button
          className={`floating-action ${activeDrawer === 'note' ? 'active' : ''}`}
          onClick={() => setActiveDrawer(activeDrawer === 'note' ? null : 'note')}
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span className="floating-action-label">Note</span>
        </button>

        <button
          className={`floating-action ${activeDrawer === 'toc' ? 'active' : ''}`}
          onClick={() => setActiveDrawer(activeDrawer === 'toc' ? null : 'toc')}
        >
          <span className="material-symbols-outlined">toc</span>
          <span className="floating-action-label">Contents</span>
        </button>

        {HAS_ELEARNING && (
          <button
            className={`floating-action ${activeDrawer === 'elearning' ? 'active' : ''}`}
            onClick={() => setActiveDrawer(activeDrawer === 'elearning' ? null : 'elearning')}
          >
            <span className="material-symbols-outlined">play_circle</span>
            <span className="floating-action-label">E-learning</span>
          </button>
        )}
      </div>

      {/* ── Drawer overlay ── */}
      {(activeDrawer || showSettings) && (
        <div className="drawer-overlay" onClick={() => { closeDrawer(); setShowSettings(false) }} />
      )}

      {/* ── Save drawer ── */}
      {activeDrawer === 'save' && (
        <div className="reader-drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <span className="drawer-title">Save to folder</span>
            <button className="drawer-close" onClick={closeDrawer}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div className="drawer-content">
            {(folders || [{ id: 'default', name: 'My Saved', color: '#7A003C' }]).map(folder => (
              <button
                key={folder.id}
                className="folder-option"
                onClick={() => { saveChapter(MOCK_CHAPTER, folder.id); closeDrawer() }}
              >
                <div className="folder-option-icon" style={{ background: folder.color + '20', color: folder.color }}>
                  <span className="material-symbols-outlined icon-sm">folder</span>
                </div>
                <span className="folder-option-name">{folder.name}</span>
                {saved && folder.id === 'default' && (
                  <span className="material-symbols-outlined folder-check">check_circle</span>
                )}
              </button>
            ))}
            <button
              className="folder-option"
              onClick={() => {
                const name = prompt('Folder name:')
                if (name && createFolder) {
                  const folder = createFolder(name)
                  saveChapter(MOCK_CHAPTER, folder.id)
                  closeDrawer()
                }
              }}
            >
              <div className="folder-option-icon" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined icon-sm">create_new_folder</span>
              </div>
              <span className="folder-option-name" style={{ color: 'var(--text-secondary)' }}>New folder…</span>
            </button>
          </div>
          {saved && (
            <div className="drawer-footer">
              <button className="unsave-btn" onClick={() => { removeChapter(MOCK_CHAPTER.id); closeDrawer() }}>
                <span className="material-symbols-outlined icon-sm">bookmark_remove</span>
                Remove from saved
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Note drawer ── */}
      {activeDrawer === 'note' && (
        <div className="reader-drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <span className="drawer-title">Add note</span>
            <button className="drawer-close" onClick={closeDrawer}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div className="drawer-content">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Your notes for this chapter…"
              className="note-textarea"
              autoFocus
              rows={5}
            />
            <button
              className="drawer-primary-btn"
              onClick={() => {
                if (!saved) saveChapter(MOCK_CHAPTER)
                addNote(MOCK_CHAPTER.id, noteText)
                closeDrawer()
              }}
            >
              Save note
            </button>
          </div>
        </div>
      )}

      {/* ── TOC drawer ── */}
      {activeDrawer === 'toc' && (
        <div className="reader-drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <span className="drawer-title">Table of contents</span>
            <button className="drawer-close" onClick={closeDrawer}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div className="drawer-content">
            {MOCK_CHAPTER.toc.map(section => (
              <button
                key={section.id}
                className={`toc-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  closeDrawer()
                }}
              >
                <span className={`material-symbols-outlined ${activeSection === section.id ? 'toc-active-dot' : 'toc-dot'}`}>
                  {activeSection === section.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span className="toc-item-title">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── E-learning drawer ── */}
      {activeDrawer === 'elearning' && (
        <div className="reader-drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <span className="drawer-title">Related e-learning</span>
            <button className="drawer-close" onClick={closeDrawer}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div className="drawer-content">
            {RELATED_ELEARNING.map(item => (
              <button
                key={item.id}
                className="elearning-drawer-item"
                onClick={() => {
                  closeDrawer()
                  navigate(item.type === 'video' ? `/video/${item.id}` : `/calculator/${item.id}`)
                }}
              >
                <span className={`material-symbols-outlined elearning-item-icon`}>
                  {item.type === 'video' ? 'play_circle' : 'calculate'}
                </span>
                <div className="elearning-item-body">
                  <span className="elearning-item-title">{item.title}</span>
                  {item.duration && <span className="elearning-item-meta">{item.duration}</span>}
                  <span className="elearning-item-hint">Tap back to return to this chapter</span>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-tertiary)' }}>chevron_right</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Settings drawer ── */}
      {showSettings && (
        <div className="reader-drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <span className="drawer-title">Reader settings</span>
            <button className="drawer-close" onClick={() => setShowSettings(false)}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div className="drawer-content">
            <div className="setting-row">
              <span className="setting-label">Text size</span>
              <div className="font-size-controls">
                <button onClick={() => setFontSize(s => Math.max(14, s - 1))}>
                  <span className="material-symbols-outlined icon-sm">text_decrease</span>
                </button>
                <span className="font-size-value">{fontSize}px</span>
                <button onClick={() => setFontSize(s => Math.min(22, s + 1))}>
                  <span className="material-symbols-outlined icon-sm">text_increase</span>
                </button>
              </div>
            </div>
            <div className="setting-row">
              <span className="setting-label">Dark mode</span>
              <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(d => !d)} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
