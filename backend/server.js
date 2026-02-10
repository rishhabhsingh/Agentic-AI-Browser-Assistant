const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ UPDATED: Make MongoDB optional
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
      console.warn('⚠️ MongoDB Warning:', err.message);
      console.log('📝 Continuing without database (history features disabled)');
    });
} else {
  console.log('📝 MongoDB not configured - history features disabled');
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BrowserBuddy AI Backend is running with GROQ!',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/tabs', require('./routes/tabs'));
app.use('/api/simplify', require('./routes/simplify'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/formfill', require('./routes/formfill'));
app.use('/api/resume', require('./routes/resume')); 
app.use('/api/settings', require('./routes/settings'));
app.use('/api/bookmarks', require('./routes/bookmarks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using GROQ AI (FREE & FAST)`);
});