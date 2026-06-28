import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSavedChapters } from '../hooks/useSavedChapters'
import BottomSheet from '../components/BottomSheet'

// ── Tabs ──────────────────────────────────────────────────────────────────────

function Tabs({ active, onChange }) {
  const tabs = [
    { id: 'saved',   icon: 'bookmark', label: 'Saved' },
    { id: 'folders', icon: 'folder',   label: 'Folders' },
  ]
  return (
    <div style={{ display: 'flex', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, height: '44px', background: 'none', border: 'none',
            borderBottom: active === tab.id ? '2px solid var(--interactive-primary)' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            fontWeight: active === tab.id ? 600 : 400, fontSize: '14px',
            color: active === tab.id ? 'var(--text-brand)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'color 0.15s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Mini stats bar ────────────────────────────────────────────────────────────

function MiniStats({ notesCount }) {
  return (
    <div style={{
      margin: '12px 16px',
      background: 'var(--bg-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>edit_note</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {notesCount} notes
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>schedule</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          5h 40m
        </span>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyAll({ navigate }) {
  const [hasSubscription] = useState(() => localStorage.getItem('hasSubscription') !== 'false')

  if (!hasSubscription) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 20px', gap: '20px' }}>
        {/* Subscribe prompt */}
        <div style={{
          background: 'linear-gradient(135deg, #7A003C 0%, #A0195A 100%)',
          borderRadius: 'var(--radius-xl)', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'rgba(255,255,255,0.9)' }}>menu_book</span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: '#fff' }}>
              Unlock the full textbook
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}>
            Subscribe to save chapters, create folders and build your personal medical library.
          </p>
          <button
            onClick={() => navigate('/reader/cardiology-3-2')}
            style={{
              height: '44px', background: '#fff', color: '#7A003C',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            Get full access
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Free e-learning CTA */}
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            In the meantime, explore free content
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/video/v1')}
              style={{
                height: '40px', padding: '0 20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
                color: 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>play_circle</span>
              Videos
            </button>
            <button
              onClick={() => navigate('/calculator/score2')}
              style={{
                height: '40px', padding: '0 20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
                color: 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calculate</span>
              Calculators
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 32px', textAlign: 'center' }}>
      <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }}>bookmark</span>
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        No saved chapters yet
      </p>
      <p className="onboarding-hint" style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
        Tap the bookmark icon while reading to save chapters here.
      </p>
      <button
        onClick={() => navigate('/reader/cardiology-3-2')}
        style={{
          height: '48px', padding: '0 28px',
          background: 'var(--interactive-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        Browse Textbook
        <span className="material-symbols-outlined icon-sm">arrow_forward</span>
      </button>
    </div>
  )
}

// ── Saved card ────────────────────────────────────────────────────────────────

function SavedCard({ item, onOpen, onRemove }) {
  const date = new Date(item.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-box)',
      marginBottom: '8px', overflow: 'hidden',
    }}>
      <button
        onClick={onOpen}
        style={{ flex: 1, padding: '14px 0 14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', minWidth: 0 }}
      >
        <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '10px', color: 'var(--text-brand)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
          {item.specialty}
        </span>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '4px' }}>
          {item.title}
        </div>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Chapter {item.chapterNum} · {item.readTime}
        </span>

        {item.note && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginTop: '8px', padding: '7px 10px', background: 'var(--bg-brand-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--text-brand)', flexShrink: 0 }}>edit_note</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.note}
            </span>
          </div>
        )}

        <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
          Saved {date}
        </span>
      </button>

      <button
        onClick={onRemove}
        aria-label="Remove from saved"
        style={{ width: '44px', alignSelf: 'stretch', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', flexShrink: 0 }}
      >
        <span className="material-symbols-outlined icon-sm">close</span>
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
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sygnet)',
        textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: folder.color + '20', color: folder.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
        <span className="material-symbols-outlined icon-lg">folder</span>
      </div>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.3, display: 'block', textAlign: 'center' }}>
        {folder.name}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        {count} ch.
      </span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Library() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { saved, folders, removeChapter, createFolder } = useSavedChapters()

  const [tab, setTab] = useState('saved')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const folderFilter = searchParams.get('folder')
  const displayedSaved = folderFilter ? saved.filter(s => s.folderId === folderFilter) : saved
  const notesCount = saved.filter(s => s.note).length

  function handleCreateFolder() {
    if (!newFolderName.trim()) return
    createFolder(newFolderName.trim())
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '24px', color: 'var(--text-primary)' }}>
          My Library
        </h1>
      </div>

      <Tabs active={tab} onChange={setTab} />
      <MiniStats notesCount={notesCount} />

      {/* Tab: Saved */}
      {tab === 'saved' && (
        <div style={{ padding: '0 16px' }}>
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

      {/* Tab: Folders */}
      {tab === 'folders' && (
        <div style={{ padding: '0 16px' }}>
          <button
            onClick={() => setShowCreateFolder(true)}
            style={{
              width: '100%', height: '44px',
              background: 'none', border: '1.5px dashed var(--border-default)',
              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
              color: 'var(--text-secondary)', marginBottom: '16px',
            }}
          >
            <span className="material-symbols-outlined icon-sm">add</span>
            New folder
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {folders.map(folder => {
              const count = saved.filter(s => s.folderId === folder.id).length
              return (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  count={count}
                  onClick={() => { setTab('saved'); navigate(`/library?folder=${folder.id}`) }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Create folder sheet */}
      <BottomSheet isOpen={showCreateFolder} onClose={() => setShowCreateFolder(false)} title="New folder">
        <div style={{ padding: '12px 20px 20px' }}>
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
            style={{
              width: '100%', height: '48px', padding: '0 14px',
              border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-primary)',
              background: 'var(--bg-app)', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleCreateFolder}
            style={{
              marginTop: '12px', width: '100%', height: '48px',
              background: 'var(--interactive-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
            }}
          >
            Create folder
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
