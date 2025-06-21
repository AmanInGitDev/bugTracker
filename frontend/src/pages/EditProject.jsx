import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/projectApi';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: []
  });
  const [newMember, setNewMember] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectById(id);
        setFormData({
          title: project.title,
          description: project.description,
          teamMembers: project.teamMembers
        });
      } catch (err) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddMember = () => {
    if (newMember && !formData.teamMembers.includes(newMember)) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, newMember]
      });
      setNewMember('');
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter(member => member !== memberToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.title.trim()) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateProject(id, formData);
      setSuccess('Project updated successfully!');
      setTimeout(() => navigate('/ProjectList'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/ProjectList')}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Project</h1>
            <Button variant="secondary" onClick={() => navigate('/ProjectList')}>
              Back to Projects
            </Button>
          </div>

          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Members</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="email"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Add team member by email"
                />
                <Button
                  variant="outline-primary"
                  className="ms-2"
                  onClick={handleAddMember}
                  type="button"
                  disabled={!newMember}
                >
                  Add
                </Button>
              </div>
              
              {formData.teamMembers.length > 0 && (
                <div className="mt-2">
                  <h6>Current Team Members:</h6>
                  <ul className="list-group">
                    {formData.teamMembers.map((member, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {member}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProject;