import React from 'react';
import { Button } from 'antd';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedPage from './components/ProtectedPage';

function App() {
  return (
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<ProtectedPage><Home /></ProtectedPage> } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     </Routes>
     </BrowserRouter>
  );
}

export default App;