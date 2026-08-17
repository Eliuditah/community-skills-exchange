const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Increase limit for images
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
console.log('🔄 Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill_exchange', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Please make sure MongoDB is running');
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
const skillRoutes = require('./src/routes/skillRoutes');
const exchangeRoutes = require('./src/routes/exchangeRoutes'); // ADDED THIS LINE

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes); // ADDED THIS LINE

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Error handling middleware (catch-all)
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api/test`);
  console.log(`🔑 Auth URL: http://localhost:${PORT}/api/auth`);
  console.log(`📚 Skills URL: http://localhost:${PORT}/api/skills`);
  console.log(`🔄 Exchanges URL: http://localhost:${PORT}/api/exchanges`); // ADDED THIS LINE
});