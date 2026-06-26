import { useNavigate, useParams } from 'react-router-dom'

const MOCK_VIDEOS = {
  v1: {
    id: 'v1',
    title: 'Heart Failure — Overview',
    specialty: 'Cardiology',
    duration: '18 min',
    color: '#7A003C',
    chapters: [
      { time: '0:00', label: 'Definition and epidemiology' },
      { time: '3:20', label: 'Pathophysiology' },
      { time: '7:45', label: 'Clinical presentation' },
      { time: '11:10', label: 'Diagnosis' },
      { time: '14:30', label: 'Pharmacological treatment' },
      { time: '16:50', label: 'Prognosis' },
    ],
    description: 'A comprehensive overview of heart failure — from pathophysiology to modern management strategies. Based on ESC 2023 guidelines.',
  },
  v2: {
    id: 'v2',
    title: 'Stroke — Diagnosis',
    specialty: 'Neurology',
    duration: '24 min',
    color: '#185FA5',
    chapters: [
      { time: '0:00', label: 'Stroke classification' },
      { time: '5:00', label: 'Symptoms and clinical scales' },
      { time: '10:00', label: 'Neuroimaging' },
      { time: '16:00', label: 'Acute phase management' },
      { time: '20:00', label: 'Secondary prevention' },
    ],
    description: 'Differential diagnosis of stroke with emphasis on neuroimaging and thrombolytic treatment.',
  },
  v3: {
    id: 'v3',
    title: 'Type 2 Diabetes',
    specialty: 'Endocrinology',
    duration: '15 min',
    color: '#0F6E56',
    chapters: [
      { time: '0:00', label: 'Pathogenesis' },
      { time: '4:00', label: 'Diagnostic criteria' },
      { time: '7:30', label: 'Pharmacotherapy — algorithm' },
      { time: '11:00', label: 'Complications and monitoring' },
    ],
    description: 'Current guidelines for diagnosis and treatment of type 2 diabetes including newer drug classes.',
  },
  v4: {
    id: 'v4',
    title: 'Bronchial Asthma',
    specialty: 'Pulmonology',
    duration: '12 min',
    color: '#854F0B',
    chapters: [
      { time: '0:00', label: 'Definition and phenotypes' },
      { time: '3:00', label: 'Diagnosis — spirometry' },
      { time: '7:00', label: 'GINA stepwise treatment' },
      { time: '10:00', label: 'Exacerbations and management' },
    ],
    description: 'Asthma in clinical practice — from phenotyping to therapy selection per GINA 2023 guidelines.',
  },
}


export default function VideoPlayer() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const video = MOCK_VIDEOS[videoId] || MOCK_VIDEOS['v1']

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

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
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          padding: '0 8px',
        }}>
          Video
        </span>
        <div style={{ width: '40px' }} />
      </header>

      {/* Player area */}
      <div style={{
        aspectRatio: '16/9',
        background: video.color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', flexShrink: 0,
      }}>
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => {}}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: '64px', color: video.color }}>play_circle</span>
        </button>

        {/* Duration badge */}
        <span style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'rgba(0,0,0,0.55)',
          color: '#fff',
          fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500,
          padding: '3px 8px', borderRadius: '4px',
        }}>
          {video.duration}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px 40px', flex: 1 }}>

        {/* Specialty chip */}
        <span style={{
          display: 'inline-block',
          background: 'var(--bg-brand-subtle)',
          color: 'var(--text-brand)',
          fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 'var(--radius-pill-sm)',
          marginBottom: '10px',
        }}>
          {video.specialty}
        </span>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px',
          color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '10px',
        }}>
          {video.title}
        </h1>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)',
          lineHeight: 1.6, marginBottom: '28px',
        }}>
          {video.description}
        </p>

        {/* Chapters */}
        <h2 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '11px',
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Chapters
        </h2>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-box)',
          overflow: 'hidden',
        }}>
          {video.chapters.map((ch, i) => (
            <button
              key={i}
              style={{
                width: '100%', height: '52px', padding: '0 16px',
                background: 'none', border: 'none',
                borderBottom: i < video.chapters.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-sm">schedule</span>
              </span>
              <span style={{
                flex: 1,
                fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-primary)',
              }}>
                {ch.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-tertiary)',
                flexShrink: 0,
              }}>
                {ch.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
