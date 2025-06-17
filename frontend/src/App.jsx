// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProjectList from './pages/ProjectList';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import TicketList from './components/tickets/TicketList';
import TicketForm from './components/tickets/TicketForm'; // Add this import
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/projectlist" element={
            <PrivateRoute>
              <ProjectList />
            </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          } />
          <Route path="/projects/:projectId/tickets" element={
            <PrivateRoute>
              <TicketList />
            </PrivateRoute>
          } />
          {/* Add these new routes */}
          <Route path="/projects/:projectId/tickets/create" element={
            <PrivateRoute>
              <TicketForm />
            </PrivateRoute>
          } />
          <Route path="/projects/:projectId/tickets/edit/:id" element={
            <PrivateRoute>
              <TicketForm />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;