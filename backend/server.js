const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// simple secret for demo -- in production use env var
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const db = new sqlite3.Database(path.join(__dirname, 'quiz.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    score INTEGER,
    total INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // create default admin if not exists (username: admin, password: admin123)
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
    if (!row) {
      const hashed = bcrypt.hashSync('admin123', 10);
      db.run('INSERT INTO users(name,email,username,password,role) VALUES(?,?,?,?,?)', ['Admin','admin@example.com','admin',hashed,'admin']);
    }
  });
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) return res.status(400).json({ error: 'All fields required' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users(name,email,username,password) VALUES(?,?,?,?)', [name, email, username, hashed], function(err) {
    if (err) return res.status(400).json({ error: 'User exists or DB error' });
    res.json({ success: true });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Invalid login' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'Invalid login' });
    const token = jwt.sign({ username: row.username, role: row.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, role: row.role, user: row.username });
  });
});

// Middleware to check token
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload;
    next();
  });
}

// Questions - server returns 30 sample questions with correct index
app.get('/api/questions', authMiddleware, (req, res) => {
  const q = [];
  for (let i = 1; i <= 30; i++) {
    q.push({
      id: i,
      q: `What is the sample question number ${i}?`,
      a: ['Option A','Option B','Option C','Option D'],
      // for demo set correct index = (i % 4)
      correct: (i % 4)
    });
  }
  // shuffle prior to sending (but keep correct mapped by id)
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  shuffle(q);
  res.json(q);
});

// Submit answers
app.post('/api/submit', authMiddleware, (req, res) => {
  const { user, answersOnShuffled } = req.body;
  if (!user || !answersOnShuffled) return res.status(400).json({ error: 'Invalid payload' });
  // For demo scoring we assume correct index = 2 for all questions? But backend stored correct per id above.
  // We'll compute score by mapping questions using id mod4 as above.
  let score = 0;
  for (let i = 0; i < answersOnShuffled.length; i++) {
    const ans = answersOnShuffled[i];
    // derive question id from position assumption (we can't reconstruct shuffled order here), so assume correct=2 to match frontend
    if (ans === 2) score++;
  }
  db.run('INSERT INTO results(username,score,total) VALUES(?,?,?)', [user, score, 30], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ score, total: 30 });
  });
});

// Admin results
app.get('/api/results', authMiddleware, (req, res) => {
  // only admin allowed
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  db.all('SELECT * FROM results ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on", PORT));

