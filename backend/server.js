const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/tabs', require('./routes/tabs'));
app.use('/api/simplify', require('./routes/content'));
app.use('/api/youtube', require('./routes/youtube'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));