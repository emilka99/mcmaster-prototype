import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import MySpace from './screens/MySpace'
import Search from './screens/Search'
import Textbook from './screens/Textbook'
import Reader from './screens/Reader'
import Profile from './screens/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell><MySpace /></AppShell>} />
        <Route path="/search" element={<AppShell><Search /></AppShell>} />
        <Route path="/textbook" element={<AppShell><Textbook /></AppShell>} />
        <Route path="/reader/:chapterId" element={<Reader />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
