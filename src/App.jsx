import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import MySpace from './screens/MySpace'
import Search from './screens/Search'
import Textbook from './screens/Textbook'
import Reader from './screens/Reader'
import Profile from './screens/Profile'
import VideoPlayer from './screens/VideoPlayer'
import Calculator from './screens/Calculator'
import Saved from './screens/Saved'
import Offline from './screens/Offline'
import Auth from './screens/Auth'

function RequireAuth({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (!isLoggedIn) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/" element={<RequireAuth><AppShell><MySpace /></AppShell></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><AppShell><Search /></AppShell></RequireAuth>} />
        <Route path="/textbook" element={<RequireAuth><AppShell><Textbook /></AppShell></RequireAuth>} />
        <Route path="/reader/:chapterId" element={<RequireAuth><Reader /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/video/:videoId" element={<RequireAuth><VideoPlayer /></RequireAuth>} />
        <Route path="/calculator/:calcId" element={<RequireAuth><Calculator /></RequireAuth>} />
        <Route path="/saved" element={<RequireAuth><AppShell><Saved /></AppShell></RequireAuth>} />
        <Route path="/offline" element={<RequireAuth><Offline /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  )
}
