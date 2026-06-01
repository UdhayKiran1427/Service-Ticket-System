import { Navigate } from "react-router-dom"

export const ProtectedRoutes = ({children , role}) => {
  
    const { isAuthed, user } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
  
}
