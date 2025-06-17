const Ticket = require('../models/Ticket');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, projectId } = req.body;
    
    // Make sure you have the user ID from the authenticated request
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
    }

    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'medium',
      status: 'open', // Default status
      projectId,
      createdBy: req.user.id // Add the creator's user ID
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: error.message });
  }
};
// Get all tickets for a project
const getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tickets = await Ticket.find({ projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assignee } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { title, description, priority, status, assignee },
      { new: true }
    ).populate('assignee', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Export all functions
module.exports = {
  createTicket,
  getTicketsByProject,
  getTicketById,
  updateTicket,
  deleteTicket,
};
