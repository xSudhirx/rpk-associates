import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 12 },
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'RPK Associates API' });
});

app.post('/api/documents', upload.array('files', 12), (req, res) => {
  const name = req.body?.name?.trim();
  const phone = req.body?.phone?.trim();
  const notes = req.body?.notes?.trim() || '';
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  const files = req.files || [];
  if (files.length === 0) {
    return res.status(400).json({ error: 'At least one file is required.' });
  }
  const filesMeta = files.map((f) => ({
    originalName: f.originalname,
    storedName: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  }));
  const stmt = db.prepare(`
    INSERT INTO document_uploads (name, phone, notes, files_json) VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(name, phone, notes, JSON.stringify(filesMeta));
  res.status(201).json({
    id: info.lastInsertRowid,
    message: 'Documents uploaded.',
    files: filesMeta.length,
  });
});

app.use('/uploads', express.static(uploadsDir));

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`RPK API listening on http://localhost:${PORT}`);
});
