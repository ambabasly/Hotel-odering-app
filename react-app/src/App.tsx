import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from './pages/homepage/homepage';

const App = () => {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App