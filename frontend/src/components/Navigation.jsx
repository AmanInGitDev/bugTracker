import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaPlus, 
  FaList, 
  FaTicketAlt, 
  FaUser, 
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaSearch
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/projectlist', icon: <FaList />, label: 'Projects' },
    { path: '/create', icon: <FaPlus />, label: 'New Project' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Top Navigation */}
      <Navbar className="navbar" expand="lg" fixed="top">
        <Container fluid>
          <Button
            variant="link"
            className="d-lg-none p-0 me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </Button>
          
          <Navbar.Brand as={Link} to="/dashboard" className="navbar-brand">
            <FaTicketAlt className="me-2" />
            BugTracker
          </Navbar.Brand>

          <div className="d-flex align-items-center ms-auto">
            {/* Search Bar */}
            <div className="position-relative me-3 d-none d-md-block">
              <input
                type="text"
                placeholder="Search projects, tickets..."
                className="form-control"
                style={{ width: '300px', paddingLeft: '2.5rem' }}
              />
              <FaSearch 
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                size={14}
              />
            </div>

            {/* Notifications */}
            <Button variant="link" className="position-relative me-2 p-2">
              <FaBell size={18} />
              <Badge 
                bg="danger" 
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.6rem' }}
              >
                3
              </Badge>
            </Button>

            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="text-decoration-none p-0">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <FaUser size={14} className="text-white" />
                  </div>
                  <span className="d-none d-md-inline text-dark">
                    {currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>
                  <div className="fw-semibold">{currentUser?.email}</div>
                  <small className="text-muted">Developer</small>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" />
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ 
        position: 'fixed', 
        top: '0', 
        left: '0', 
        height: '100vh', 
        width: sidebarOpen ? '250px' : '0',
        zIndex: 1000,
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        <div className="p-4" style={{ width: '250px' }}>
          {/* Sidebar Header */}
          <div className="d-flex align-items-center mb-4">
            <FaTicketAlt size={24} className="text-primary me-2" />
            <h5 className="mb-0 text-white">BugTracker</h5>
          </div>

          {/* Navigation Items */}
          <Nav className="flex-column">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`mb-2 ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ms-3">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          {/* Quick Stats */}
          <div className="mt-5 p-3 bg-dark rounded">
            <h6 className="text-white mb-3">Quick Stats</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Active Projects</span>
              <Badge bg="primary">12</Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Open Tickets</span>
              <Badge bg="warning">34</Badge>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Resolved</span>
              <Badge bg="success">156</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
          style={{ 
            opacity: 0.5, 
            zIndex: 999,
            display: 'block'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation; 