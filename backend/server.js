const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== MONGODB CONNECTION (OPTIONAL) =====
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_connection_string_here') {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
      console.warn('⚠️ MongoDB Warning:', err.message);
      console.log('📝 Continuing without database');
    });
} else {
  console.log('📝 MongoDB not configured - history features disabled');
}

// ===== HEALTH CHECK ROUTE (BEFORE OTHER ROUTES) =====
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BrowserBuddy AI Backend is running with GROQ!',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ===== IMPORT ROUTES =====
const tabsRoutes = require('./routes/tabs');
const simplifyRoutes = require('./routes/simplify');
const youtubeRoutes = require('./routes/youtube');
const settingsRoutes = require('./routes/settings');
const bookmarksRoutes = require('./routes/bookmarks');
const formfillRoutes = require('./routes/formfill');
const resumeRoutes = require('./routes/resume');

// ===== USE ROUTES =====
app.use('/api/tabs', tabsRoutes);
app.use('/api/simplify', simplifyRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/formfill', formfillRoutes);
app.use('/api/resume', resumeRoutes);

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.json({ 
    message: 'BrowserBuddy AI Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/tabs/analyze',
      '/api/simplify/text',
      '/api/youtube/analyze',
      '/api/settings',
      '/api/bookmarks/add',
      '/api/formfill/save-profile',
      '/api/resume/optimize'
    ]
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using GROQ AI (FREE & FAST)`);
});