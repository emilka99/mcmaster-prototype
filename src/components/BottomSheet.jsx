import { useEffect } from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

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
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: isOpen
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(100%)',
          width: '100%',
          maxWidth: '430px',
          maxHeight: '70vh',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
          zIndex: 201,
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{
            width: '36px', height: '4px',
            background: 'var(--border-default)',
            borderRadius: '2px',
          }} />
        </div>

        {/* Title */}
        {title && (
          <div style={{
            padding: '14px 20px 12px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '16px',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {title}
          </div>
        )}

        {/* Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0 env(safe-area-inset-bottom, 16px)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
