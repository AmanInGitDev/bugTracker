import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/projectApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTicketAlt, 
  FaUsers, 
  FaCalendarAlt,
  FaEllipsisV,
  FaEye,
  FaChartLine
} from 'react-icons/fa';
import Navigation from '../components/Navigation';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const token = await currentUser.getIdToken();
      await deleteProject(id, token);
      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

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

  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-5 text-center">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h5 className="text-muted">Loading your projects...</h5>
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
            <h5>Error Loading Projects</h5>
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
      <Container fluid style={{ marginTop: '100px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-2">My Projects</h1>
            <p className="text-muted mb-0">
              Manage and track your development projects
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <FaEye className="me-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FaChartLine className="me-1" />
              List
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/create')}
              className="ms-2"
            >
              <FaPlus className="me-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <FaTicketAlt className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">{projects.length}</h3>
                    <small className="text-muted">Total Projects</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <FaUsers className="text-success" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">
                      {projects.reduce((acc, project) => acc + (project.teamMembers?.length || 0), 0)}
                    </h3>
                    <small className="text-muted">Team Members</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                    <FaCalendarAlt className="text-warning" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">
                      {projects.filter(p => p.status === 'active').length}
                    </h3>
                    <small className="text-muted">Active Projects</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                    <FaChartLine className="text-info" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">
                      {projects.filter(p => p.status === 'completed').length}
                    </h3>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {projects.length === 0 ? (
          <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
            <Card.Body className="py-5">
              <div className="mb-4">
                <FaTicketAlt size={64} className="text-muted mb-3" />
                <h4>No projects found</h4>
                <p className="text-muted">
                  Get started by creating your first project to track bugs and manage your development workflow.
                </p>
              </div>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/create')}
              >
                <FaPlus className="me-2" />
                Create Your First Project
              </Button>
            </Card.Body>
          </Card>
        ) : viewMode === 'grid' ? (
          <Row>
            {projects.map(project => (
              <Col key={project._id} lg={4} md={6} className="mb-4">
                <Card className="h-100 fade-in" style={{ background: '#fff', color: '#1a202c' }}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-truncate">{project.title}</h6>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" size="sm" className="p-0">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/edit/${project._id}`)}>
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate(`/projects/${project._id}/tickets`)}>
                          <FaTicketAlt className="me-2" />
                          View Tickets
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => handleDelete(project._id)}
                          disabled={deletingId === project._id}
                          className="text-danger"
                        >
                          {deletingId === project._id ? (
                            <Spinner as="span" size="sm" animation="border" role="status" />
                          ) : (
                            <FaTrash className="me-2" />
                          )}
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-3">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge bg={getStatusColor(project.status)}>
                        {project.status || 'Active'}
                      </Badge>
                      <small className="text-muted">
                        {project.teamMembers?.length || 0} members
                      </small>
                    </div>
                    {project.teamMembers && project.teamMembers.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Team Members:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {project.teamMembers.slice(0, 3).map((member, index) => (
                            <Badge key={index} bg="light" text="dark" className="text-truncate">
                              {member}
                            </Badge>
                          ))}
                          {project.teamMembers.length > 3 && (
                            <Badge bg="light" text="dark">
                              +{project.teamMembers.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer className="bg-transparent">
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/projects/${project._id}/tickets`)}
                        className="flex-grow-1"
                      >
                        <FaTicketAlt className="me-1" />
                        Tickets
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/edit/${project._id}`)}
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Team Members</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project._id}>
                        <td>
                          <div>
                            <h6 className="mb-1">{project.title}</h6>
                            <small className="text-muted">Created recently</small>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {project.description || 'No description'}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusColor(project.status)}>
                            {project.status || 'Active'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUsers className="text-muted me-2" />
                            <span>{project.teamMembers?.length || 0} members</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => navigate(`/projects/${project._id}/tickets`)}
                            >
                              <FaTicketAlt className="me-1" />
                              Tickets
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => navigate(`/edit/${project._id}`)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(project._id)}
                              disabled={deletingId === project._id}
                            >
                              {deletingId === project._id ? (
                                <Spinner as="span" size="sm" animation="border" role="status" />
                              ) : (
                                <FaTrash />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default ProjectList;