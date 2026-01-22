import {Navigate, Outlet} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = () => {
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
