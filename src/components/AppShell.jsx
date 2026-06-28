import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function AppShell({ children }) {
  return (
    <>
      <TopBar />
      <main style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        {children}
      </main>
      <BottomNav />
    </>
  )
}
