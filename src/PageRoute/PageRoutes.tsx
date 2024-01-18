import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import Payment from '../Pages/Payment'
import MembersForm from '../Pages/MembersTable'

function PageRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/membertable' element={<MembersForm />} />
    </Routes>
  )
}

export default PageRoutes