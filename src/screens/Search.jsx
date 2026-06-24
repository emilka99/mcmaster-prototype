export default function Search() {
  return (
    <div style={{ background: 'var(--bg-app)', padding: 'var(--spacing-6)', minHeight: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '28px', color: 'var(--text-primary)', marginBottom: 'var(--spacing-3)' }}>
        Szukaj
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-secondary)' }}>
        Tu będzie wyszukiwarka treści medycznych.
      </p>
    </div>
  )
}
