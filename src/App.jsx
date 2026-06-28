import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import Home from './screens/Home'
import Search from './screens/Search'
import Textbook from './screens/Textbook'
import Library from './screens/Library'
import Reader from './screens/Reader'
import Profile from './screens/Profile'
import VideoPlayer from './screens/VideoPlayer'
import Calculator from './screens/Calculator'
import Offline from './screens/Offline'
import Auth from './screens/Auth'
import Demo from './screens/Demo'
import { useDemoMode } from './hooks/useDemoMode'

function RequireAuth({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true'
  if (!isLoggedIn && !isDemo) return <Navigate to="/auth" replace />
  return children
}

// Inner component so useDemoMode can use useSearchParams (requires BrowserRouter context)
function AppRoutes() {
  useDemoMode()

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/demo" element={<Demo />} />

      <Route path="/" element={<RequireAuth><AppShell><Home /></AppShell></RequireAuth>} />
      <Route path="/search" element={<RequireAuth><AppShell><Search /></AppShell></RequireAuth>} />
      <Route path="/library" element={<RequireAuth><AppShell><Library /></AppShell></RequireAuth>} />
      <Route path="/textbook" element={<RequireAuth><AppShell><Textbook /></AppShell></RequireAuth>} />
      <Route path="/reader/:chapterId" element={<RequireAuth><Reader /></RequireAuth>} />
      <Route path="/video/:videoId" element={<RequireAuth><VideoPlayer /></RequireAuth>} />
      <Route path="/calculator/:calcId" element={<RequireAuth><Calculator /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/offline" element={<RequireAuth><Offline /></RequireAuth>} />

      <Route path="/saved" element={<Navigate to="/library" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <AppRoutes />
    </BrowserRouter>
  )
}
