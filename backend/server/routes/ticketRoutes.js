const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyToken = require('../middleware/authMiddleware'); // Add this

router.post('/', verifyToken, ticketController.createTicket);
router.get('/project/:projectId', verifyToken, ticketController.getTicketsByProject);
router.put('/:id', verifyToken, ticketController.updateTicket);
router.delete('/:id', verifyToken, ticketController.deleteTicket);
// Add this route
router.get('/:id', verifyToken, ticketController.getTicketById);
module.exports = router;