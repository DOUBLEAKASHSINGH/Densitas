import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthWall from './pages/AuthWall';
import EventSelector from './pages/EventSelector';
import OrganiserDashboard from './pages/OrganiserDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthWall />} />
        <Route path="/select" element={<EventSelector />} />
        <Route path="/dashboard/organiser" element={<OrganiserDashboard />} />
        <Route path="/dashboard/attendee" element={<AttendeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
