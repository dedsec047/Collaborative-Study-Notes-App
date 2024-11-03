import React from 'react'
import {Navigate, Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import { useAuthContext } from '../contexts/AuthContext'
import PrivateRoute from '../components/PrivateRoute'


export default function Router() {


  const {isAuth} = useAuthContext()

  return (
  <Routes>
    <Route path='/*' element={<Frontend />} />
    <Route path='/auth/*' element={!isAuth ?<Auth /> :<Navigate to="/dashboard" /> } />
    <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} />
  </Routes>        
  )
}
