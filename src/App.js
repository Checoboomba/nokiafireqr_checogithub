import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/mainlayout';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Inspection from './components/Inspection';
import Report from './components/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Login /></MainLayout>}  />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
        {/* Protected routes inside layout */}
        <Route
          path="/dashboard"
          element={<MainLayout><Dashboard /></MainLayout>}
        />
        <Route
          path="/inspection"
          element={<MainLayout><Inspection /></MainLayout>}
        />
        <Route
          path="/report"
          element={<MainLayout><Report /></MainLayout>}
        />
      </Routes>
    </Router>
  );
}

export default App;



