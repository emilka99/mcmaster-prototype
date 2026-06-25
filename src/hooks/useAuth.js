import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    navigate('/auth')
  }

  return { isLoggedIn, user, logout }
}
