import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthWall from './pages/AuthWall';
import SelectLocation from './pages/SelectLocation';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import Documentation from './pages/Documentation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AuthWall />} />
          <Route path="auth" element={<Navigate to="/" replace />} />
          <Route path="select-location" element={<SelectLocation />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="docs" element={<Documentation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
