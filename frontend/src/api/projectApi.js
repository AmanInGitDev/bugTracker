const API_URL = 'http://localhost:5000/api/projects';

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

// Get all projects
export const getProjects = async (token) => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(token)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch projects');
  }
  return response.json();
};

// Create a new project
export const createProject = async (projectData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create project');
  }
  return response.json();
};

// Update a project
export const updateProject = async (id, projectData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update project');
  }
  return response.json();
};

// Delete a project
export const deleteProject = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete project');
  }
  return response.json();
};

// Add team member
export const addTeamMember = async (projectId, email, token) => {
  const response = await fetch(`${API_URL}/${projectId}/members`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add team member');
  }
  return response.json();
};

// Remove team member
export const removeTeamMember = async (projectId, email, token) => {
  const response = await fetch(`${API_URL}/${projectId}/members`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove team member');
  }
  return response.json();
};

// Get project by ID
export const getProjectById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(token)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch project');
  }
  return response.json();
};