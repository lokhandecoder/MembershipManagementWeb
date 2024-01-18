import React from 'react';
import logo from './logo.svg';
import './App.css';
import LayoutComponent from './Components/Fixed/LayoutComponent';
import HomePage from './Pages/HomePage';
import PageRoutes from './PageRoute/PageRoutes';

function App() {
  return (
   <>
    {/* <HomePage /> */}
    <PageRoutes />
   </>
  );
}

export default App;
