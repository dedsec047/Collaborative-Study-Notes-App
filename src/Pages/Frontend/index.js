import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import NoPage from '../../components/NoPage'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import NoteDetail from './NoteDetail'
import CreateNote from './CreateNote'
import PrivateRoute from '../../components/PrivateRoute'

export default function Frontend() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        {/* <Route path="/create" element={<CreateNote />} /> */}
        <Route path="/create" element={<PrivateRoute Component={CreateNote} />} />
        {/* <Route path="/note/:id" element={<NoteDetail />} /> */}
        <Route path="/note/:id" element={<PrivateRoute Component={NoteDetail} />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
      <Footer />
    </>)
}
