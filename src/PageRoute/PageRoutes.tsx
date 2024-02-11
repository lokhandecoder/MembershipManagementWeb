import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import MembersForm from '../Pages/MembersPage'
import SignIn from '../Pages/SignIn'
import SignUp from '../Pages/SignUp'
import PageNotFoundPage from '../Pages/PageNotFoundPage'
import ThankYouPage from '../Pages/ThankYouPage'
import SubscriptionPage from '../Pages/SubscriptionPage'
// import SignInUpPage from '../Pages/SignIn-UpPage'

function PageRoutes() {

  const [token, setToken] = useState<boolean>(false);
  const navigate = useNavigate()

  useEffect(()=> {
    const fetchToken = () => {
      const tok = sessionStorage.getItem("Token")
      if (tok){
        setToken(true)
      }else {
        setToken(false)
      }
    }
    fetchToken()
  },[])

  return (
    <Routes>
      {token && (
        <>
          <Route path='/' element={<HomePage />} />
          <Route path='/membertable' element={<MembersForm />} />
          <Route path='/subscription' element={<SubscriptionPage />} />
        </>
      )}

      <Route path='/login' element={<SignIn />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/404' element={<PageNotFoundPage />}/>
      <Route path='/thankyou' element={<ThankYouPage />}/>
    </Routes>
  )
}

export default PageRoutes