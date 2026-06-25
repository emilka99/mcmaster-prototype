import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSavedChapters } from '../hooks/useSavedChapters'
import BottomSheet from '../components/BottomSheet'

// ── Tabs ──────────────────────────────────────────────────────────────────────

function Tabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
      {[
        { id: 'all', label: 'Wszystkie' },
        { id: 'folders', label: 'Foldery' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, height: '44px', background: 'none', border: 'none',
            borderBottom: active === tab.id ? '2px solid var(--interactive-primary)' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            fontWeight: active === tab.id ? 600 : 400, fontSize: '14px',
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 32px', textAlign: 'center' }}>
      <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }}>bookmark</span>
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        Nie masz jeszcze zapisanych rozdziałów
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
        Podczas czytania kliknij ikonę zakładki
      </p>
      <button
        onClick={() => navigate('/textbook')}
        style={{
          height: '48px', padding: '0 28px',
          background: 'var(--interactive-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        Przeglądaj Textbook
        <span className="material-symbols-outlined icon-sm">arrow_forward</span>
      </button>
    </div>
  )
}

// ── Saved card ────────────────────────────────────────────────────────────────

function SavedCard({ item, onOpen, onRemove }) {
  const date = new Date(item.savedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })

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
          Rozdział {item.chapterNum} · {item.readTime}
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
          Zapisano {date}
        </span>
      </button>

      <button
        onClick={onRemove}
        aria-label="Usuń z zapisanych"
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

  const folderFilter = searchParams.get('folder')
  const displayedSaved = folderFilter ? saved.filter(s => s.folderId === folderFilter) : saved

  function handleCreateFolder() {
    if (!newFolderName.trim()) return
    createFolder(newFolderName.trim())
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100%' }}>

      <Tabs active={tab} onChange={setTab} />

      {/* Tab: Wszystkie */}
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

      {/* Tab: Foldery */}
      {tab === 'folders' && (
        <div style={{ padding: '16px' }}>
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
            Nowy folder
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {folders.map(folder => {
              const count = saved.filter(s => s.folderId === folder.id).length
              return (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  count={count}
                  onClick={() => { setTab('all'); navigate(`/saved?folder=${folder.id}`) }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Create folder sheet */}
      <BottomSheet isOpen={showCreateFolder} onClose={() => setShowCreateFolder(false)} title="Nowy folder">
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
            Utwórz folder
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
