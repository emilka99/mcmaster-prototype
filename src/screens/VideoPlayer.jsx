import { useNavigate, useParams } from 'react-router-dom'

const MOCK_VIDEOS = {
  v1: {
    id: 'v1',
    title: 'Niewydolność serca — przegląd',
    specialty: 'Kardiologia',
    duration: '18 min',
    color: '#7A003C',
    chapters: [
      { time: '0:00', label: 'Definicja i epidemiologia' },
      { time: '3:20', label: 'Patofizjologia' },
      { time: '7:45', label: 'Objawy kliniczne' },
      { time: '11:10', label: 'Diagnostyka' },
      { time: '14:30', label: 'Leczenie farmakologiczne' },
      { time: '16:50', label: 'Rokowanie' },
    ],
    description: 'Kompleksowy przegląd niewydolności serca — od patofizjologii po nowoczesne strategie leczenia. Materiał oparty na wytycznych ESC 2023.',
  },
  v2: {
    id: 'v2',
    title: 'Udar mózgu — diagnostyka',
    specialty: 'Neurologia',
    duration: '24 min',
    color: '#185FA5',
    chapters: [
      { time: '0:00', label: 'Klasyfikacja udarów' },
      { time: '5:00', label: 'Objawy i skale kliniczne' },
      { time: '10:00', label: 'Diagnostyka obrazowa' },
      { time: '16:00', label: 'Postępowanie w fazie ostrej' },
      { time: '20:00', label: 'Profilaktyka wtórna' },
    ],
    description: 'Diagnostyka różnicowa udaru mózgu z naciskiem na neuroobrازowanie i leczenie trombolityczne.',
  },
  v3: {
    id: 'v3',
    title: 'Cukrzyca typu 2',
    specialty: 'Endokrynologia',
    duration: '15 min',
    color: '#0F6E56',
    chapters: [
      { time: '0:00', label: 'Patogeneza' },
      { time: '4:00', label: 'Kryteria rozpoznania' },
      { time: '7:30', label: 'Farmakoterapia — algorytm' },
      { time: '11:00', label: 'Powikłania i monitoring' },
    ],
    description: 'Aktualne wytyczne diagnostyki i leczenia cukrzycy typu 2 z uwzględnieniem nowych grup leków.',
  },
  v4: {
    id: 'v4',
    title: 'Astma oskrzelowa',
    specialty: 'Pulmonologia',
    duration: '12 min',
    color: '#854F0B',
    chapters: [
      { time: '0:00', label: 'Definicja i fenotopy' },
      { time: '3:00', label: 'Diagnostyka — spirometria' },
      { time: '7:00', label: 'Stopniowanie leczenia GINA' },
      { time: '10:00', label: 'Zaostrzenia i postępowanie' },
    ],
    description: 'Astma w ujęciu praktycznym — od fenotypowania po dobór terapii zgodnie z wytycznymi GINA 2023.',
  },
}

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconPlay = ({ color }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="23" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" strokeOpacity="0.3"/>
    <path d="M20 16L34 24L20 32V16Z" fill={color}/>
  </svg>
)

const IconChapter = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7 4.5V7.5L9 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

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
          <IconBack />
        </button>
        <span style={{
          flex: 1, textAlign: 'center',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          padding: '0 8px',
        }}>
          Wideo
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
          <IconPlay color={video.color} />
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
          Spis treści
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
                <IconChapter />
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
