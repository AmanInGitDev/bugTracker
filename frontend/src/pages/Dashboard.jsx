import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import { 
  FaPlus, 
  FaTicketAlt, 
  FaUsers, 
  FaCalendarAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await currentUser.getIdToken();
        const data = await getProjects(token);
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'on-hold':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Mock data for demonstration
  const mockStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalTeamMembers: projects.reduce((acc, project) => acc + (project.teamMembers?.length || 0), 0),
    completedProjects: projects.filter(p => p.status === 'completed').length,
    openTickets: 34,
    resolvedTickets: 156,
    criticalTickets: 5,
    avgResolutionTime: '2.3 days'
  };

  const recentProjects = projects.slice(0, 5);
  const criticalProjects = projects.filter(p => p.status === 'active').slice(0, 3);

  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-5 text-center">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading your dashboard...</h5>
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <Container className="mt-5">
          <Alert variant="danger" className="fade-in">
            <h5>Error Loading Dashboard</h5>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline-danger">
              Try Again
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container fluid className="mt-4">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="mb-2">Welcome back, {currentUser?.email?.split('@')[0] || 'Developer'}!</h1>
          <p className="text-muted mb-0">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <FaTicketAlt className="text-primary" size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="mb-1">{mockStats.totalProjects}</h3>
                    <p className="text-muted mb-0">Total Projects</p>
                  </div>
                  <div className="text-success">
                    <FaArrowUp size={16} />
                    <small>+12%</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <FaUsers className="text-success" size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="mb-1">{mockStats.totalTeamMembers}</h3>
                    <p className="text-muted mb-0">Team Members</p>
                  </div>
                  <div className="text-success">
                    <FaArrowUp size={16} />
                    <small>+8%</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                    <FaExclamationTriangle className="text-warning" size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="mb-1">{mockStats.openTickets}</h3>
                    <p className="text-muted mb-0">Open Tickets</p>
                  </div>
                  <div className="text-danger">
                    <FaArrowDown size={16} />
                    <small>-5%</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                    <FaCheckCircle className="text-info" size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="mb-1">{mockStats.resolvedTickets}</h3>
                    <p className="text-muted mb-0">Resolved</p>
                  </div>
                  <div className="text-success">
                    <FaArrowUp size={16} />
                    <small>+15%</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Recent Projects */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Projects</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/projectlist')}
                >
                  <FaEye className="me-1" />
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                {recentProjects.length === 0 ? (
                  <div className="text-center py-4">
                    <FaTicketAlt size={48} className="text-muted mb-3" />
                    <h6>No projects yet</h6>
                    <p className="text-muted">Create your first project to get started</p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/create')}
                    >
                      <FaPlus className="me-2" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Status</th>
                          <th>Team</th>
                          <th>Progress</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProjects.map(project => (
                          <tr key={project._id}>
                            <td>
                              <div>
                                <h6 className="mb-1">{project.title}</h6>
                                <small className="text-muted">
                                  {project.description?.substring(0, 50)}...
                                </small>
                              </div>
                            </td>
                            <td>
                              <Badge bg={getStatusColor(project.status)}>
                                {project.status || 'Active'}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaUsers className="text-muted me-2" />
                                <span>{project.teamMembers?.length || 0}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <ProgressBar 
                                  now={Math.random() * 100} 
                                  className="flex-grow-1 me-2"
                                  style={{ height: '6px' }}
                                />
                                <small className="text-muted">
                                  {Math.floor(Math.random() * 100)}%
                                </small>
                              </div>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => navigate(`/projects/${project._id}/tickets`)}
                              >
                                <FaTicketAlt className="me-1" />
                                Tickets
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions & Stats */}
          <Col lg={4} className="mb-4">
            <Row>
              <Col className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-bottom">
                    <h6 className="mb-0">Quick Actions</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary"
                        onClick={() => navigate('/create')}
                        className="text-start"
                      >
                        <FaPlus className="me-2" />
                        Create New Project
                      </Button>
                      <Button 
                        variant="outline-primary"
                        onClick={() => navigate('/projectlist')}
                        className="text-start"
                      >
                        <FaTicketAlt className="me-2" />
                        View All Projects
                      </Button>
                      <Button 
                        variant="outline-secondary"
                        className="text-start"
                      >
                        <FaUsers className="me-2" />
                        Manage Team
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-bottom">
                    <h6 className="mb-0">Performance Metrics</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Ticket Resolution Rate</small>
                        <small className="text-success">85%</small>
                      </div>
                      <ProgressBar now={85} className="mb-3" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Project Completion</small>
                        <small className="text-primary">72%</small>
                      </div>
                      <ProgressBar now={72} className="mb-3" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Team Productivity</small>
                        <small className="text-warning">68%</small>
                      </div>
                      <ProgressBar now={68} />
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="text-muted me-2" />
                        <small className="text-muted">Avg. Resolution Time</small>
                      </div>
                      <h5 className="mb-0">{mockStats.avgResolutionTime}</h5>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Critical Issues */}
        {criticalProjects.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm border-warning">
                <Card.Header className="bg-warning bg-opacity-10 border-warning">
                  <h6 className="mb-0 text-warning">
                    <FaExclamationTriangle className="me-2" />
                    Critical Issues Requiring Attention
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {criticalProjects.map(project => (
                      <Col md={4} key={project._id} className="mb-3">
                        <div className="p-3 border border-warning rounded">
                          <h6 className="text-warning mb-2">{project.title}</h6>
                          <p className="text-muted small mb-2">
                            {project.description?.substring(0, 80)}...
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="danger">Critical</Badge>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => navigate(`/projects/${project._id}/tickets`)}
                            >
                              View Issues
                            </Button>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Dashboard; 