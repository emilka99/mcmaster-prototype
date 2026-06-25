import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSavedChapters } from '../hooks/useSavedChapters'
import BottomSheet from '../components/BottomSheet'

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBookmark = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M10 7H30C31.1 7 32 7.9 32 9V35L20 28L8 35V9C8 7.9 8.9 7 10 7Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
  </svg>
)

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const IconNote = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="3" y1="4" x2="9" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="3" y1="6.5" x2="9" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="3" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const IconFolder = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M3 7C3 6.4 3.4 6 4 6H11L14 9H24C24.6 9 25 9.4 25 10V21C25 21.6 24.6 22 24 22H4C3.4 22 3 21.6 3 21V7Z"
      stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ── Tabs ──────────────────────────────────────────────────────────────────────

function Tabs({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '0',
    }}>
      {[
        { id: 'all', label: 'Wszystkie' },
        { id: 'folders', label: 'Foldery' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, height: '44px',
            background: 'none', border: 'none',
            borderBottom: active === tab.id ? '2px solid var(--interactive-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontWeight: active === tab.id ? 600 : 400,
            fontSize: '14px',
            color: active === tab.id ? 'var(--text-brand)' : 'var(--text-secondary)',
            transition: 'color 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyAll({ navigate }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '64px 32px', textAlign: 'center',
    }}>
      <span style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        <IconBookmark />
      </span>
      <p style={{
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px',
        color: 'var(--text-primary)', marginBottom: '8px',
      }}>
        Nie masz jeszcze zapisanych rozdziałów
      </p>
      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '14px',
        color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5,
      }}>
        Podczas czytania kliknij ikonę zakładki
      </p>
      <button
        onClick={() => navigate('/textbook')}
        style={{
          height: '48px', padding: '0 28px',
          background: 'var(--interactive-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
          cursor: 'pointer',
        }}
      >
        Przeglądaj Textbook →
      </button>
    </div>
  )
}

// ── Saved card ────────────────────────────────────────────────────────────────

function SavedCard({ item, onOpen, onRemove }) {
  const date = new Date(item.savedAt).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-box)',
      marginBottom: '8px',
      overflow: 'hidden',
    }}>
      {/* Main clickable area */}
      <button
        onClick={onOpen}
        style={{
          flex: 1, padding: '14px 0 14px 16px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          minWidth: 0,
        }}
      >
        <span style={{
          display: 'inline-block',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '10px',
          color: 'var(--text-brand)', textTransform: 'uppercase', letterSpacing: '0.07em',
          marginBottom: '4px',
        }}>
          {item.specialty}
        </span>
        <div style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
          color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '4px',
        }}>
          {item.title}
        </div>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '12px',
          color: 'var(--text-secondary)',
        }}>
          Rozdział {item.chapterNum} · {item.readTime}
        </span>

        {item.note && (
          <div style={{
            display: 'flex', gap: '6px', alignItems: 'flex-start',
            marginTop: '8px', padding: '7px 10px',
            background: 'var(--bg-brand-subtle)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{ color: 'var(--text-brand)', flexShrink: 0, marginTop: '1px' }}>
              <IconNote />
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '12px',
              color: 'var(--text-secondary)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.note}
            </span>
          </div>
        )}

        <span style={{
          display: 'block', fontFamily: 'var(--font-ui)', fontSize: '11px',
          color: 'var(--text-tertiary)', marginTop: '8px',
        }}>
          Zapisano {date}
        </span>
      </button>

      {/* Remove button */}
      <button
        onClick={onRemove}
        style={{
          width: '44px', alignSelf: 'stretch',
          background: 'none', border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-tertiary)', flexShrink: 0,
        }}
        aria-label="Usuń z zapisanych"
      >
        <IconX />
      </button>
    </div>
  )
}

// ── Folder card ───────────────────────────────────────────────────────────────

function FolderCard({ folder, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '16px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sygnet)',
        textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      }}
    >
      <div style={{
        width: '48px', height: '48px',
        borderRadius: 'var(--radius-lg)',
        background: folder.color + '20',
        color: folder.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '2px',
      }}>
        <IconFolder />
      </div>
      <span style={{
        fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
        color: 'var(--text-primary)', lineHeight: 1.3,
        display: 'block', textAlign: 'center',
      }}>
        {folder.name}
      </span>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: '11px',
        color: 'var(--text-secondary)',
      }}>
        {count} rozdz.
      </span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Saved() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { saved, folders, removeChapter, createFolder } = useSavedChapters()

  const [tab, setTab] = useState('all')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // Filter by folder if ?folder= param present
  const folderFilter = searchParams.get('folder')
  const displayedSaved = folderFilter
    ? saved.filter(s => s.folderId === folderFilter)
    : saved

  function handleCreateFolder() {
    if (!newFolderName.trim()) return
    createFolder(newFolderName.trim())
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>

      <Tabs active={tab} onChange={setTab} />

      {/* ── Tab: Wszystkie ── */}
      {tab === 'all' && (
        <div style={{ padding: '16px 16px 0' }}>
          {displayedSaved.length === 0
            ? <EmptyAll navigate={navigate} />
            : displayedSaved.map(item => (
                <SavedCard
                  key={item.id}
                  item={item}
                  onOpen={() => navigate(`/reader/${item.id}`)}
                  onRemove={() => removeChapter(item.id)}
                />
              ))
          }
        </div>
      )}

      {/* ── Tab: Foldery ── */}
      {tab === 'folders' && (
        <div style={{ padding: '16px' }}>
          {/* Nowy folder */}
          <button
            onClick={() => setShowCreateFolder(true)}
            style={{
              width: '100%', height: '44px',
              background: 'none',
              border: '1.5px dashed var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
            }}
          >
            <IconPlus />
            Nowy folder
          </button>

          {/* Grid 2 kolumny */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
          }}>
            {folders.map(folder => {
              const count = saved.filter(s => s.folderId === folder.id).length
              return (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  count={count}
                  onClick={() => {
                    setTab('all')
                    navigate(`/saved?folder=${folder.id}`)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ── Create folder sheet ── */}
      <BottomSheet
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        title="Nowy folder"
      >
        <div style={{ padding: '12px 20px 20px' }}>
          <input
            type="text"
            placeholder="Nazwa folderu"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
            style={{
              width: '100%', height: '48px', padding: '0 14px',
              border: '1.5px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)', fontSize: '16px',
              color: 'var(--text-primary)',
              background: 'var(--bg-app)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleCreateFolder}
            style={{
              marginTop: '12px', width: '100%', height: '48px',
              background: 'var(--interactive-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Utwórz folder
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
