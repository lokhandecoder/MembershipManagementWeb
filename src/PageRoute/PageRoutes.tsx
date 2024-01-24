import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import Payment from '../Pages/Payment'
import MembersForm from '../Pages/MembersPage'
import Subscription from '../Pages/Subscription'
//import Subscription from '../Pages/Subscription copy'

function PageRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/membertable' element={<MembersForm />} />
        <Route path='/subscription' element={<Subscription />} />
    </Routes>
  )
}

export default PageRoutes