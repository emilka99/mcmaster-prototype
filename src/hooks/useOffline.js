import { useState } from 'react'

const DEFAULT_STATE = {
  downloadedSpecialties: [],
  totalSizeMB: 0,
  lastSync: null,
  syncStatus: 'idle',
  settings: {
    autoSync: true,
    wifiOnly: true,
    frequency: '6h',
  },
}

export function useOffline() {
  const [offlineState, setOfflineState] = useState(() =>
    JSON.parse(localStorage.getItem('offlineState') || JSON.stringify(DEFAULT_STATE))
  )

  const startDownload = (specialties = ['all']) => {
    const syncing = { ...offlineState, syncStatus: 'syncing' }
    setOfflineState(syncing)

    setTimeout(() => {
      setOfflineState(prev => {
        const state = {
          ...prev,
          downloadedSpecialties: specialties,
          totalSizeMB: specialties.includes('all') ? 487 : specialties.length * 45,
          lastSync: new Date().toISOString(),
          syncStatus: 'upToDate',
        }
        localStorage.setItem('offlineState', JSON.stringify(state))
        return state
      })
    }, 3000)
  }

  const updateSettings = (newSettings) => {
    setOfflineState(prev => {
      const state = { ...prev, settings: { ...prev.settings, ...newSettings } }
      localStorage.setItem('offlineState', JSON.stringify(state))
      return state
    })
  }

  const clearDownload = () => {
    setOfflineState(prev => {
      const state = {
        ...prev,
        downloadedSpecialties: [],
        totalSizeMB: 0,
        lastSync: null,
        syncStatus: 'idle',
      }
      localStorage.setItem('offlineState', JSON.stringify(state))
      return state
    })
  }

  const isDownloaded = offlineState.downloadedSpecialties.length > 0
  const isAll = offlineState.downloadedSpecialties.includes('all')

  return { offlineState, startDownload, updateSettings, clearDownload, isDownloaded, isAll }
}
