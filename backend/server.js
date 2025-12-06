// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// import your existing route handlers (adjust paths/files as needed)
// Example: const authRoutes = require('./routes/auth'); // you probably already have these
// If you don't, copy your current route functions into the placeholders below.

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- PLACEHOLDER API ROUTES ---
// Replace these with your real route code or require() them
app.post('/api/register', async (req, res) => {
  // Example: your existing register logic goes here.
  // Keep the interface: return JSON { success: true } or appropriate error status + message.
  try {
    const { fullname, email, username, password } = req.body;
    // TODO: insert DB create logic
    return res.status(201).json({ ok: true, message: 'Registered' });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // TODO: check credentials
    return res.json({ ok: true, token: 'fake-jwt-token', user: { username } });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
});

// Add other API endpoints: /api/quizzes, /api/submit, /api/admin/results etc.
// Keep them under /api/* so frontend can call relative paths when hosted on same domain.

// --- Serve built frontend ---
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));

// fallback - serve index.html for all other routes (so react-router works)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
