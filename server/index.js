require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(require('cookie-parser')());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/players',    require('./routes/players'));
app.use('/api/events',     require('./routes/events'));
app.use('/api/teams',      require('./routes/teams'));
app.use('/api/ties',       require('./routes/ties'));
app.use('/api/leagues',    require('./routes/leagues'));
app.use('/api/standings',  require('./routes/standings'));
app.use('/api/sponsors',   require('./routes/sponsors'));
app.use('/api/shop',       require('./routes/shop'));
app.use('/api/join',       require('./routes/join'));
app.use('/api/admin',      require('./routes/admin'));

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`PD API listening on :${PORT}`));
