import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import Payment from '../Pages/Payment'
import MembersForm from '../Pages/MembersPage'
import FollowUp from '../Pages/FollowUp'
import Test from '../Pages/Test'

function PageRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/membertable' element={<MembersForm />} />
        <Route path = '/followup' element= {<FollowUp />} />
        <Route path = '/test' element= {<Test />} />
    </Routes>
  )
}

export default PageRoutes