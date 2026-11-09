const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

// Basic Health Check Route
app.get(['/api/health', '/health'], (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = states[mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    status: 'OK',
    message: 'EventHub API is running smoothly',
    mongodb: {
      status: state,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || null
    },
    timestamp: new Date().toISOString()
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('EventHub Backend API is running...');
});

// Mount API routes (supports both /api/* and root fallbacks)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/events', eventRoutes);
app.use('/events', eventRoutes);

app.use('/api/feedback', feedbackRoutes);
app.use('/feedback', feedbackRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Define Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`[EventHub API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
