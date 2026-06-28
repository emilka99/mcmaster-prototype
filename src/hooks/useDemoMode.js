import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useDemoMode() {
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const userType = params.get('userType') || 'new'
  const access = params.get('access') || 'with'
  const hideTips = params.get('hideTips') === 'true'

  useEffect(() => {
    if (!isDemo) return

    if (userType === 'active') {
      localStorage.setItem('lastRead', JSON.stringify({
        chapterId: 'cardiology-3-2',
        title: 'Heart Failure',
        specialty: 'Cardiology',
      }))
      localStorage.setItem('savedChapters', JSON.stringify([
        {
          id: 'cardiology-3-2', title: 'Heart Failure', specialty: 'Cardiology',
          chapterNum: '3.2', readTime: '12 min',
          savedAt: new Date().toISOString(), folderId: 'default', note: null,
        },
        {
          id: 'neurology-2-1', title: 'Ischemic Stroke', specialty: 'Neurology',
          chapterNum: '2.1', readTime: '20 min',
          savedAt: new Date().toISOString(), folderId: 'default', note: 'Review before rounds',
        },
      ]))
    } else {
      localStorage.removeItem('lastRead')
      localStorage.removeItem('savedChapters')
    }

    localStorage.setItem('hasSubscription', access === 'with' ? 'true' : 'false')
  }, [isDemo, userType, access])

  useEffect(() => {
    if (hideTips) {
      document.body.classList.add('hide-tips')
    } else {
      document.body.classList.remove('hide-tips')
    }
    return () => document.body.classList.remove('hide-tips')
  }, [hideTips])

  return { isDemo, userType, access, hideTips }
}
