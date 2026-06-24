import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReadingHistory } from '../hooks/useReadingHistory'

export default function Reader() {
  const navigate = useNavigate()
  const { chapterId } = useParams()
  const { setLastRead } = useReadingHistory()

  useEffect(() => {
    setLastRead({ chapterId, title: 'Rozdział testowy' })
  }, [chapterId])

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh', padding: 'var(--spacing-6)' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          color: 'var(--text-brand)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        ← Wróć
      </button>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '28px', color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
        Rozdział: {chapterId}
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '18px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        Tu będzie treść rozdziału podręcznika EBM.
      </p>
    </div>
  )
}
