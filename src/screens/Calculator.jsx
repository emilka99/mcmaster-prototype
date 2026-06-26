import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ── SCORE2 calculator ─────────────────────────────────────────────────────────

function calcScore2({ age, sex, smoker, systolic, totalChol, hdl }) {
  const a = parseInt(age) || 55
  const sbp = parseInt(systolic) || 130
  const tc = parseFloat(totalChol) || 5.5
  const hdlVal = parseFloat(hdl) || 1.4

  // Simplified SCORE2 estimation (not a clinical tool)
  let base = (a - 40) * 0.12
  if (sex === 'M') base += 0.8
  if (smoker) base += 1.2
  base += (sbp - 120) * 0.018
  base += (tc - hdlVal - 3) * 0.15
  const risk = Math.max(1, Math.min(40, Math.round(base * 1.8)))

  let category, color, advice
  if (risk < 5) { category = 'Low'; color = '#16A34A'; advice = 'Lifestyle modification — physical activity, diet, smoking cessation.' }
  else if (risk < 10) { category = 'Moderate'; color = '#CA8A04'; advice = 'Consider pharmacological treatment; strict lifestyle modification.' }
  else if (risk < 20) { category = 'High'; color = '#EA580C'; advice = 'Lipid-lowering therapy recommended. LDL target < 1.8 mmol/l.' }
  else { category = 'Very high'; color = '#DC2626'; advice = 'Intensive statin therapy + ezetimibe. LDL target < 1.4 mmol/l.' }

  return { risk, category, color, advice }
}

// ── BMI calculator ────────────────────────────────────────────────────────────

function calcBMI({ weight, height }) {
  const w = parseFloat(weight)
  const h = parseFloat(height) / 100
  if (!w || !h) return null
  const bmi = w / (h * h)
  let category, color
  if (bmi < 18.5) { category = 'Underweight'; color = '#2563EB' }
  else if (bmi < 25) { category = 'Normal'; color = '#16A34A' }
  else if (bmi < 30) { category = 'Overweight'; color = '#CA8A04' }
  else { category = 'Obese'; color = '#DC2626' }
  return { bmi: bmi.toFixed(1), category, color }
}

// ── HbA1c calculator ──────────────────────────────────────────────────────────

function calcHba1c({ value, unit }) {
  const v = parseFloat(value)
  if (!v) return null
  if (unit === 'percent') {
    const mmol = Math.round((v - 2.15) * 10.929)
    return { percent: v.toFixed(1), mmol }
  } else {
    const pct = ((v / 10.929) + 2.15).toFixed(1)
    return { percent: pct, mmol: Math.round(v) }
  }
}

// ── eGFR calculator ───────────────────────────────────────────────────────────

function calcGFR({ creatinine, age, sex }) {
  const cr = parseFloat(creatinine)
  const a = parseInt(age) || 55
  if (!cr) return null
  const kappa = sex === 'F' ? 0.7 : 0.9
  const alpha = sex === 'F' ? -0.241 : -0.302
  const sexFactor = sex === 'F' ? 1.012 : 1
  const crRatio = cr / kappa
  const val = 142 * Math.pow(Math.min(crRatio, 1), alpha) * Math.pow(Math.max(crRatio, 1), -1.200) * Math.pow(0.9938, a) * sexFactor
  const egfr = Math.round(val)
  let stage, color
  if (egfr >= 90) { stage = 'G1 — Normal'; color = '#16A34A' }
  else if (egfr >= 60) { stage = 'G2 — Mildly decreased'; color = '#65A30D' }
  else if (egfr >= 45) { stage = 'G3a — Moderately decreased'; color = '#CA8A04' }
  else if (egfr >= 30) { stage = 'G3b — Severely decreased'; color = '#EA580C' }
  else if (egfr >= 15) { stage = 'G4 — Kidney failure'; color = '#DC2626' }
  else { stage = 'G5 — End-stage kidney disease'; color = '#7F1D1D' }
  return { egfr, stage, color }
}

// ── Config ────────────────────────────────────────────────────────────────────

const CALC_META = {
  score2: { title: 'SCORE2 Calculator', subtitle: '10-year cardiovascular risk', specialty: 'Cardiology' },
  hba1c:  { title: 'HbA1c Converter', subtitle: 'mmol/mol ↔ %', specialty: 'Endocrinology' },
  bmi:    { title: 'BMI Calculator', subtitle: 'Body Mass Index + interpretation', specialty: 'General' },
  gfr:    { title: 'eGFR Calculator', subtitle: 'CKD-EPI — kidney function', specialty: 'Nephrology' },
}

// ── Form field ────────────────────────────────────────────────────────────────

function Field({ label, unit, value, onChange, type = 'number', min, max, placeholder }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
        color: 'var(--text-secondary)', marginBottom: '6px',
      }}>
        {label}{unit ? <span style={{ fontWeight: 400 }}> ({unit})</span> : ''}
      </label>
      <input
        type={type}
        inputMode="decimal"
        min={min} max={max}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: '48px', padding: '0 14px',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-ui)', fontSize: '16px',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />
    </div>
  )
}

function SegmentControl({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
        color: 'var(--text-secondary)', marginBottom: '6px',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', gap: '8px',
      }}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, height: '44px',
              background: value === opt.value ? 'var(--interactive-primary)' : 'var(--bg-surface)',
              color: value === opt.value ? '#fff' : 'var(--text-secondary)',
              border: '1.5px solid',
              borderColor: value === opt.value ? 'var(--interactive-primary)' : 'var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({ children }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginTop: '24px',
    }}>
      {children}
    </div>
  )
}

// ── Calculator screens ────────────────────────────────────────────────────────

function Score2Form() {
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('M')
  const [smoker, setSmoker] = useState('N')
  const [systolic, setSystolic] = useState('')
  const [totalChol, setTotalChol] = useState('')
  const [hdl, setHdl] = useState('')

  const canCalc = age && systolic && totalChol && hdl
  const result = canCalc ? calcScore2({ age, sex, smoker: smoker === 'Y', systolic, totalChol, hdl }) : null

  return (
    <div>
      <Field label="Age" unit="years" value={age} onChange={setAge} min={40} max={75} placeholder="e.g. 55" />
      <SegmentControl label="Sex" options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} value={sex} onChange={setSex} />
      <SegmentControl label="Smoking" options={[{ value: 'N', label: 'No' }, { value: 'Y', label: 'Yes' }]} value={smoker} onChange={setSmoker} />
      <Field label="Systolic BP" unit="mmHg" value={systolic} onChange={setSystolic} placeholder="e.g. 130" />
      <Field label="Total cholesterol" unit="mmol/l" value={totalChol} onChange={setTotalChol} placeholder="e.g. 5.5" />
      <Field label="HDL cholesterol" unit="mmol/l" value={hdl} onChange={setHdl} placeholder="e.g. 1.4" />

      {result && (
        <ResultCard>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '48px',
              color: result.color, lineHeight: 1,
            }}>
              {result.risk}%
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
              color: result.color, marginTop: '4px',
            }}>
              {result.category} risk
            </div>
          </div>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)',
            lineHeight: 1.6, textAlign: 'center',
          }}>
            {result.advice}
          </p>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-tertiary)',
            textAlign: 'center', marginTop: '12px',
          }}>
            Estimated result — not for clinical use
          </p>
        </ResultCard>
      )}
    </div>
  )
}

function BmiForm() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const result = weight && height ? calcBMI({ weight, height }) : null

  return (
    <div>
      <Field label="Weight" unit="kg" value={weight} onChange={setWeight} placeholder="e.g. 75" />
      <Field label="Height" unit="cm" value={height} onChange={setHeight} placeholder="e.g. 175" />
      {result && (
        <ResultCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '48px',
              color: result.color, lineHeight: 1,
            }}>
              {result.bmi}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-tertiary)',
              marginBottom: '6px',
            }}>
              kg/m²
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
              color: result.color,
            }}>
              {result.category}
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  )
}

function Hba1cForm() {
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('percent')
  const result = value ? calcHba1c({ value, unit }) : null

  return (
    <div>
      <SegmentControl
        label="Input unit"
        options={[{ value: 'percent', label: '% (NGSP)' }, { value: 'mmol', label: 'mmol/mol' }]}
        value={unit}
        onChange={u => { setUnit(u); setValue('') }}
      />
      <Field
        label={unit === 'percent' ? 'HbA1c in %' : 'HbA1c in mmol/mol'}
        value={value}
        onChange={setValue}
        placeholder={unit === 'percent' ? 'e.g. 7.5' : 'e.g. 58'}
      />
      {result && (
        <ResultCard>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '32px',
                color: 'var(--text-primary)',
              }}>
                {result.percent}%
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)' }}>NGSP</div>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '24px', color: 'var(--text-tertiary)', alignSelf: 'center' }}>↔</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '32px',
                color: 'var(--text-primary)',
              }}>
                {result.mmol}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)' }}>mmol/mol</div>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  )
}

function GfrForm() {
  const [creatinine, setCreatinine] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('M')
  const result = creatinine && age ? calcGFR({ creatinine, age, sex }) : null

  return (
    <div>
      <Field label="Creatinine" unit="mg/dl" value={creatinine} onChange={setCreatinine} placeholder="e.g. 1.1" />
      <Field label="Age" unit="years" value={age} onChange={setAge} placeholder="e.g. 60" />
      <SegmentControl label="Sex" options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} value={sex} onChange={setSex} />
      {result && (
        <ResultCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '48px',
              color: result.color, lineHeight: 1,
            }}>
              {result.egfr}
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
              ml/min/1.73 m²
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px', color: result.color }}>
              {result.stage}
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  )
}

const CALC_FORMS = { score2: Score2Form, hba1c: Hba1cForm, bmi: BmiForm, gfr: GfrForm }

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Calculator() {
  const { calcId } = useParams()
  const navigate = useNavigate()
  const meta = CALC_META[calcId] || CALC_META['score2']
  const Form = CALC_FORMS[calcId] || Score2Form

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh' }}>

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
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-brand)', display: 'flex', alignItems: 'center',
            padding: '4px', width: '40px', flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined icon-md">arrow_back</span>
        </button>
        <span style={{
          flex: 1, textAlign: 'center',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
          color: 'var(--text-primary)',
        }}>
          Calculator
        </span>
        <div style={{ width: '40px' }} />
      </header>

      {/* Content */}
      <div style={{ padding: '20px 16px 48px' }}>

        <span style={{
          display: 'inline-block',
          background: 'var(--bg-brand-subtle)',
          color: 'var(--text-brand)',
          fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 'var(--radius-pill-sm)',
          marginBottom: '10px',
        }}>
          {meta.specialty}
        </span>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '22px',
          color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '4px',
        }}>
          {meta.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}>
          {meta.subtitle}
        </p>

        <Form />
      </div>
    </div>
  )
}
