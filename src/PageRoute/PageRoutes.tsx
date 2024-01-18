import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import Payment from '../Pages/Payment'

function PageRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<Payment />} />
        
    </Routes>
  )
}

export default PageRoutes