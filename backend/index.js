require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')

const app = express() 
 
// Middleware  
app.use(cors())
app.use(helmet())  
app.use(express.json())   
  
// MongoDB Connection 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err))
 
// Routes
app.get('/', (req, res) => {
  res.send('Bug Tracker API') 
})



// Project routes
const projectRoutes = require('./server/routes/projectRoutes')
app.use('/api/projects', projectRoutes)

const ticketRoutes=require('./server/routes/ticketRoutes')
app.use('/api/tickets', ticketRoutes);


// Start server 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})