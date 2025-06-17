// client/src/api/tickets.js
import axios from 'axios';

const API_URL = '/api/tickets';

// Get tickets by project
export const getTicketsByProject = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/project/${projectId}`, config);
  return response.data;
};

// Get single ticket by ID
// In your tickets.js API file
export const getTicketById = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/${ticketId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

// Create ticket
// In your API client (tickets.js)
export const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  const response = await axios.post(`${API_URL}`, ticketData, config);
  return response.data;
};

// Update ticket
export const updateTicket = async (ticketId, ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${ticketId}`, ticketData, config);
  return response.data;
};

// Delete ticket
export const deleteTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${ticketId}`, config);
  return response.data;
};