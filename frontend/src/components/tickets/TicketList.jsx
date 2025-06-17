import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketsByProject, updateTicket } from '../../api/tickets';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Spinner, Container } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Styles for the columns
const columnStyles = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '500px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  padding: '8px',
  margin: '0 8px',
  flex: 1,
};

const ticketStyles = {
  marginBottom: '8px',
  padding: '8px',
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
  'open': 'To Do',
  'in-progress': 'In Progress',
  'resolved': 'Done',
  'closed': 'Done' // You can adjust this based on your needs
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
    
    // Don't do anything if dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the ticket being dragged
    const ticketToUpdate = tickets.find(ticket => ticket._id === draggableId);
    if (!ticketToUpdate) return;

    // Determine the new status based on the destination column
    let newStatus;
    switch (destination.droppableId) {
      case 'To Do':
        newStatus = 'open';
        break;
      case 'In Progress':
        newStatus = 'in-progress';
        break;
      case 'Done':
        newStatus = 'resolved'; // or 'closed' based on your preference
        break;
      default:
        newStatus = ticketToUpdate.status;
    }

    // Optimistically update the UI
    const updatedTickets = tickets.map(ticket => {
      if (ticket._id === draggableId) {
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });
    setTickets(updatedTickets);

    // Update the ticket in the database
    try {
      setIsUpdating(true);
      const token = await currentUser.getIdToken();
      await updateTicket(ticketToUpdate._id, { status: newStatus }, token);
    } catch (err) {
      setError('Failed to update ticket status');
      // Revert the UI if the update fails
      setTickets(tickets);
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Group tickets by status for the columns
  const groupedTickets = {
    'open': tickets.filter(ticket => ticket.status === 'open'),
    'in-progress': tickets.filter(ticket => ticket.status === 'in-progress'),
    'resolved': tickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed'),
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tickets</h2>
        <Button variant="primary" onClick={() => navigate(`/projects/${projectId}/tickets/create`)}>
          Create Ticket
        </Button>
      </div>

      {isUpdating && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" />
          <span className="ms-2">Updating ticket...</span>
        </div>
      )}

      {tickets.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No tickets found for this project.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 0' }}>
            {Object.entries(groupedTickets).map(([status, ticketsInColumn]) => (
              <Droppable key={status} droppableId={statusColumns[status]}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ ...columnStyles, minWidth: '300px' }}
                  >
                    <h5 className="text-center mb-3">{statusColumns[status]}</h5>
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
                              cursor: 'grab',
                            }}
                            onClick={() => navigate(`/projects/${projectId}/tickets/edit/${ticket._id}`)}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6>{ticket.title}</h6>
                                <p className="text-muted small mb-2">
                                  {ticket.description.substring(0, 60)}...
                                </p>
                              </div>
                              <Badge bg={priorityVariant[ticket.priority]}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            {ticket.assignee && (
                              <small className="text-muted">
                                Assigned to: {ticket.assignee?.name || 'Unassigned'}
                              </small>
                            )}
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
  );
};

export default TicketList;