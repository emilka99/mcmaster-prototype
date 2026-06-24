import { useState } from 'react'

const STORAGE_KEY = 'mcmaster_last_read'

export function useReadingHistory() {
  const [lastRead, setLastReadState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  function setLastRead(value) {
    setLastReadState(value)
    try {
      if (value === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }
    } catch {
      // localStorage unavailable
    }
  }

  return { lastRead, setLastRead }
}
