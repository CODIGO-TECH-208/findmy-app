import express from 'express';
import cors from 'cors';
import * as jsonDb from './jsonDb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const TOKEN_EXPIRES = '7d';

const app = express();
app.use(cors());
app.use(express.json());

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...u } = user;
  return u;
}

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

async function findUserByEmail(email) {
  const users = await jsonDb.list('users');
  return users.find((u) => String(u.email).toLowerCase() === String(email).toLowerCase()) || null;
}

async function findUserByPhone(phone) {
  const users = await jsonDb.list('users');
  return users.find((u) => String(u.phone) === String(phone)) || null;
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await jsonDb.get('users', payload.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth: register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: 'name, email and password are required' });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      phone: phone || '',
      password: hash,
      avatar: '',
      memberSince: new Date().toISOString().slice(0, 10),
      isVerified: false,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    const created = await jsonDb.create('users', user);
    const token = generateToken(created);
    res.status(201).json({ user: sanitizeUser(created), token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auth: login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, phone } = req.body || {};
    if ((!email && !phone) || !password) return res.status(400).json({ error: 'email/phone and password are required' });
    let user = null;
    if (email) user = await findUserByEmail(email);
    if (!user && phone) user = await findUserByPhone(phone);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Items: create (protected)
app.post('/items', authMiddleware, async (req, res) => {
  try {
    const body = req.body || {};
    const item = Object.assign({}, body);
    item.userId = req.user.id;
    item.createdAt = new Date().toISOString();
    if (!item.type) item.type = 'lost';
    if (!item.status) item.status = 'active';
    const created = await jsonDb.create('items', item);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Claims: create (protected)
app.post('/claims', authMiddleware, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.itemId) return res.status(400).json({ error: 'itemId is required' });
    const claim = Object.assign({}, body);
    claim.userId = req.user.id;
    claim.status = 'pending';
    claim.createdAt = new Date().toISOString();
    const created = await jsonDb.create('claims', claim);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Messages: create (protected)
app.post('/messages', authMiddleware, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.conversationId || !body.content) return res.status(400).json({ error: 'conversationId and content required' });
    const msg = Object.assign({}, body);
    msg.senderId = req.user.id;
    msg.timestamp = new Date().toISOString();
    const created = await jsonDb.create('messages', msg);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List and create
app.get('/api/:collection', async (req, res) => {
  try {
    const col = await jsonDb.list(req.params.collection);
    res.json(col);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/:collection', async (req, res) => {
  try {
    const created = await jsonDb.create(req.params.collection, req.body || {});
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get single
app.get('/api/:collection/:id', async (req, res) => {
  try {
    const item = await jsonDb.get(req.params.collection, req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update
app.put('/api/:collection/:id', async (req, res) => {
  try {
    const updated = await jsonDb.update(req.params.collection, req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete
app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const ok = await jsonDb.remove(req.params.collection, req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.API_PORT || 4000;
// Ensure all existing users have a hashed password set to '1234'
async function ensureDefaultPasswords() {
  try {
    const users = await jsonDb.list('users');
    for (const u of users) {
      const pwd = u.password;
      const needsHash = !pwd || typeof pwd !== 'string' || !pwd.startsWith('$2');
      if (needsHash) {
        const hash = await bcrypt.hash('1234', 10);
        await jsonDb.update('users', u.id, { ...u, password: hash });
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to ensure default passwords', e);
  }
}

ensureDefaultPasswords().finally(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`JSON DB API running on http://localhost:${PORT}/api`);
  });
});
