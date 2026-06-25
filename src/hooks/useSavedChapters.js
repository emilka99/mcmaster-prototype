import { useState } from 'react'

const SAVED_KEY = 'savedChapters'
const FOLDERS_KEY = 'folders'
const DEFAULT_FOLDERS = [{ id: 'default', name: 'Wszystkie zapisane', color: '#7A003C' }]

export function useSavedChapters() {
  const [saved, setSaved] = useState(() =>
    JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  )
  const [folders, setFolders] = useState(() =>
    JSON.parse(localStorage.getItem(FOLDERS_KEY) || JSON.stringify(DEFAULT_FOLDERS))
  )

  const saveChapter = (chapter, folderId = 'default') => {
    const entry = {
      id: chapter.id,
      title: chapter.title,
      specialty: chapter.specialty,
      chapterNum: chapter.chapter,
      readTime: chapter.readTime,
      savedAt: new Date().toISOString(),
      folderId,
      note: null,
    }
    const updated = [entry, ...saved.filter(s => s.id !== chapter.id)]
    setSaved(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  }

  const removeChapter = (chapterId) => {
    const updated = saved.filter(s => s.id !== chapterId)
    setSaved(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  }

  const isSaved = (chapterId) => saved.some(s => s.id === chapterId)

  const addNote = (chapterId, noteText) => {
    const updated = saved.map(s =>
      s.id === chapterId ? { ...s, note: noteText || null } : s
    )
    setSaved(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  }

  const createFolder = (name, color = '#7A003C') => {
    const folder = { id: Date.now().toString(), name, color }
    const updated = [...folders, folder]
    setFolders(updated)
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
    return folder
  }

  return { saved, folders, saveChapter, removeChapter, isSaved, addNote, createFolder }
}
