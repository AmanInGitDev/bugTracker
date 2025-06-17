import { useState } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    teamMembers: project?.teamMembers?.join(', ') || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      teamMembers: formData.teamMembers
        .split(',')
        .map(email => email.trim())
        .filter(email => email)
    };
    onSubmit(formattedData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId="title" label="Project Title" className="mb-3">
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project Title"
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="description" label="Description" className="mb-3">
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description"
          style={{ height: '100px' }}
        />
      </FloatingLabel>

      <FloatingLabel controlId="teamMembers" label="Team Members (comma separated emails)" className="mb-3">
        <Form.Control
          type="text"
          name="teamMembers"
          value={formData.teamMembers}
          onChange={handleChange}
          placeholder="team@example.com, member@example.com"
        />
      </FloatingLabel>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
}