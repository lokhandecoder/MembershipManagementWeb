import { Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ThankYouPage() {

  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <Container maxWidth="md" style={{marginTop: '50px', textAlign: 'center'}}>
      <Typography variant="h5">
        Your Account has been created!!! Please Login
      </Typography>
      <Button variant="contained" onClick={handleLogin} style={{marginTop: '20px'}}>Back To Login</Button>
    </Container>
  )
}
