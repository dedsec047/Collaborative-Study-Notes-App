import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'


export default function PrivateRoute({ Component }) {
  
  const {isAuth} = useAuthContext()
  // const nevigate = useNavigate() 

  if(!isAuth){return <Navigate to="/auth/login"/> }

  return (<Component />)
}
