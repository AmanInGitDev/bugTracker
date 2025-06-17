import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject, addTeamMember, removeTeamMember } from '../api/projectApi';
import { Button, Card, ListGroup, Badge, Modal, Form } from 'react-bootstrap';
import ProjectForm from '../components/ProjectForm';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await updateProject(id, projectData);
      setProject(updatedProject);
      setEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleAddMember = async () => {
    try {
      await addTeamMember(id, newMemberEmail);
      fetchProject();
      setShowAddMemberModal(false);
      setNewMemberEmail('');
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleRemoveMember = async (email) => {
    try {
      await removeTeamMember(id, email);
      fetchProject();
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="container mt-4">
      {editing ? (
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          loading={loading}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{project.title}</h1>
            <Button variant="outline-primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Card.Text>{project.description}</Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Team Members</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddMemberModal(true)}
              >
                Add Member
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {project.teamMembers?.map((email) => (
                  <ListGroup.Item
                    key={email}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {email}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveMember(email)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
                {project.teamMembers?.length === 0 && (
                  <ListGroup.Item>No team members</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </>
      )}

      <Modal
        show={showAddMemberModal}
        onHide={() => setShowAddMemberModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddMemberModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMember}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}