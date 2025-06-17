// client/src/components/tickets/TicketForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { createTicket, updateTicket, deleteTicket, getTicketById } from '../../api/tickets';
import { useAuth } from '../../context/AuthContext';

const TicketForm = () => {
  const { projectId, id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });

 useEffect(() => {
  if (id) {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const data = await getTicketById(id, token); // Make sure token is passed
        setTicket(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ticket');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    fetchTicket();
  }
}, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      if (id) {
        await updateTicket(id, { ...ticket, projectId }, token);
      } else {
        await createTicket({ ...ticket, projectId }, token);
      }
      navigate(`/projects/${projectId}/tickets`);
    } catch (err) {
      setError(err.message || 'Failed to save ticket');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        await deleteTicket(id, token);
        navigate(`/projects/${projectId}/tickets`);
      } catch (err) {
        setError(err.message || 'Failed to delete ticket');
        setLoading(false);
      }
    }
  };

  if (loading && !ticket.title) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5">{id ? 'Edit Ticket' : 'Create New Ticket'}</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={ticket.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={ticket.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={ticket.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <ButtonGroup>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner as="span" size="sm" animation="border" role="status" />
                  ) : (
                    id ? 'Update Ticket' : 'Create Ticket'
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/projects/${projectId}/tickets`)}
                >
                  Cancel
                </Button>
              </ButtonGroup>
              
              {id && (
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Ticket
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TicketForm;