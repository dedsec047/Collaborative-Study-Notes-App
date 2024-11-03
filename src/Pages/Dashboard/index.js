import React from 'react'
import { Route, Routes } from 'react-router-dom'
import User from './User'
import NoPage from '../../components/NoPage'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

export default function Dashboard() {
  return (
<>
<Header />
<Routes>
    <Route path='/' element={<User />} />
    <Route path='*' element={<NoPage />} />
</Routes>  
<Footer />
</>
  )
}
