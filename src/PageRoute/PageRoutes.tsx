import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import Payment from '../Pages/Payment'
import Subscription from '../Pages/Subscription'

function PageRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/subscription' element={<Subscription />} />
        
    </Routes>
  )
}

export default PageRoutes