// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API route for courses data
app.get('/api/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'courses.json'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
