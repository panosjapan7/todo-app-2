import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Login from './pages/Login';

export const CredentialsContext = React.createContext();

function App() {
  const credentialsState = useState(null);
  return (
    <div className="App">
      <CredentialsContext.Provider value={credentialsState}>
        <Routes>
          <Route path="/" element={<Welcome />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </CredentialsContext.Provider>
    </div>
  );
}

export default App;
