import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DB_PATH = process.env.DB_PATH || path.join('api', 'data', 'auth.db');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(morgan('dev'));

async function ensureDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

async function getUserByEmail(db, email) {
  return db.get('SELECT id, name, email, password_hash FROM users WHERE email = ?', email);
}

function validateEmail(email) {
  return /.+@.+\..+/.test(email);
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API de autenticação ativa' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: 'Informe um nome com pelo menos 3 caracteres.' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Use uma senha com 6 caracteres ou mais.' });
    }

    const db = await ensureDatabase();
    const existing = await getUserByEmail(db, email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Já existe um usuário com esse e-mail.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const statement = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      name.trim(),
      email.trim().toLowerCase(),
      passwordHash
    );

    const user = { id: statement.lastID, name: name.trim(), email: email.trim().toLowerCase() };
    const token = createToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const db = await ensureDatabase();
    const user = await getUserByEmail(db, email.trim().toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = createToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

app.get('/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token ausente.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);

    const db = await ensureDatabase();
    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', payload.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    const status = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' ? 401 : 500;
    res.status(status).json({ error: status === 401 ? 'Token inválido ou expirado.' : 'Erro interno ao validar token.' });
  }
});

app.listen(PORT, () => {
  console.log(`API de autenticação ouvindo em http://localhost:${PORT}`);
});
