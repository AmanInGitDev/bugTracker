import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketsByProject, updateTicket } from '../../api/tickets';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  FaPlus, 
  FaTicketAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaArrowLeft
} from 'react-icons/fa';
import Navigation from '../Navigation';

// Enhanced column styles
const columnStyles = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '600px',
  backgroundColor: 'var(--gray-50)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-4)',
  margin: '0 var(--spacing-2)',
  flex: 1,
  border: '1px solid var(--gray-200)',
};

const ticketStyles = {
  marginBottom: 'var(--spacing-3)',
  padding: 'var(--spacing-4)',
  backgroundColor: 'white',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--gray-200)',
  transition: 'var(--transition-normal)',
  cursor: 'grab',
};

const priorityVariant = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const statusVariant = {
  open: 'primary',
  'in-progress': 'info',
  resolved: 'success',
  closed: 'secondary',
};

const statusColumns = {
  open: 'To Do',
  'in-progress': 'In Progress',
  resolved: 'Done',
};

const TicketList = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!currentUser) return;
        
        const token = await currentUser.getIdToken();
        const data = await getTicketsByProject(projectId, token);
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tickets');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTickets();
  }, [projectId, currentUser]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const ticketToUpdate = tickets.find(ticket => ticket._id === draggableId);
    if (!ticketToUpdate) return;

    let newStatus;
    switch (destination.droppableId) {
      case 'To Do':
        newStatus = 'open';
        break;
      case 'In Progress':
        newStatus = 'in-progress';
        break;
      case 'Done':
        newStatus = 'resolved';
        break;
      default:
        newStatus = ticketToUpdate.status;
    }

    const updatedTickets = tickets.map(ticket => {
      if (ticket._id === draggableId) {
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });
    setTickets(updatedTickets);

    try {
      setIsUpdating(true);
      const token = await currentUser.getIdToken();
      await updateTicket(ticketToUpdate._id, { status: newStatus }, token);
    } catch (err) {
      setError('Failed to update ticket status');
      setTickets(tickets);
      console.error(err);
    } finally {
      setIsUpdating(false);
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
              <h5 className="text-muted">Loading tickets...</h5>
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
            <h5>Error Loading Tickets</h5>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline-danger">
              Try Again
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  const groupedTickets = {
    open: tickets.filter((ticket) => ticket.status === 'open'),
    'in-progress': tickets.filter((ticket) => ticket.status === 'in-progress'),
    resolved: tickets.filter((ticket) => ticket.status === 'resolved'),
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaTicketAlt className="text-primary" />;
      case 'in-progress':
        return <FaClock className="text-warning" />;
      case 'resolved':
      case 'closed':
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaTicketAlt />;
    }
  };

  return (
    <>
      <Navigation />
      <Container fluid className="mt-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => navigate('/projectlist')}
              className="mb-2"
            >
              <FaArrowLeft className="me-2" />
              Back to Projects
            </Button>
            <h1 className="mb-2">Project Tickets</h1>
            <p className="mb-0">
              Manage and track tickets for this project
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/projects/${projectId}/tickets/create`)}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" />
            Create Ticket
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm" style={{ background: '#fff', color: '#1a202c' }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <FaTicketAlt className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">{tickets.length}</h3>
                    <small className="text-muted">Total Tickets</small>
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
                    <FaExclamationTriangle className="text-warning" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">{groupedTickets['open'].length}</h3>
                    <small className="text-muted">Open</small>
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
                    <FaClock className="text-info" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">{groupedTickets['in-progress'].length}</h3>
                    <small className="text-muted">In Progress</small>
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
                    <FaCheckCircle className="text-success" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0">{groupedTickets['resolved'].length}</h3>
                    <small className="text-muted">Resolved</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {isUpdating && (
          <Alert variant="info" className="fade-in mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Updating ticket status...
          </Alert>
        )}

        {tickets.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <FaTicketAlt size={64} className="text-muted mb-3" />
              <h4>No tickets found</h4>
              <p className="text-muted">
                Get started by creating your first ticket for this project.
              </p>
              <Button 
                variant="primary"
                onClick={() => navigate(`/projects/${projectId}/tickets/create`)}
              >
                <FaPlus className="me-2" />
                Create Your First Ticket
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', overflowX: 'auto', padding: 'var(--spacing-2) 0' }}>
              {Object.entries(groupedTickets).map(([status, ticketsInColumn]) => (
                <Droppable key={status} droppableId={statusColumns[status]}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ ...columnStyles, minWidth: '320px' }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="mb-0 d-flex align-items-center">
                          {getStatusIcon(status)}
                          <span className="ms-2">{statusColumns[status]}</span>
                        </h5>
                        <Badge bg={statusVariant[status]} className="rounded-pill">
                          {ticketsInColumn.length}
                        </Badge>
                      </div>
                      {ticketsInColumn.map((ticket, index) => (
                        <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...ticketStyles,
                                ...provided.draggableProps.style,
                              }}
                              onClick={() => navigate(`/projects/${projectId}/tickets/edit/${ticket._id}`)}
                              className="ticket-card"
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                                  {ticket.title}
                                </h6>
                                <Badge bg={priorityVariant[ticket.priority] || 'secondary'} size="sm">
                                  {ticket.priority || 'medium'}
                                </Badge>
                              </div>
                              <p className="text-muted small mb-3" style={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {ticket.description || 'No description'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <FaUser className="me-1" size={12} />
                                  <small className="text-muted">
                                    {ticket.assignedTo || 'Unassigned'}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="text-muted me-1" size={12} />
                                  <small className="text-muted">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </Container>
    </>
  );
};

export default TicketList;