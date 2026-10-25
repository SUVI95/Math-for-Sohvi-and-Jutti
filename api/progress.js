// Saves Julius' and Sophia's progress.
// Needs ONE environment variable: DATABASE_URL (Postgres, e.g. Neon from the Vercel Marketplace).
// POSTGRES_URL also works. The table is created automatically on first use.
// (Optional alternative: Upstash Redis via KV_REST_API_URL + KV_REST_API_TOKEN.)
import pg from 'pg';

const PG_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PLAYERS = ['Julius', 'Sophia'];

let pool = null;
let tableReady = false;
function getPool() {
  if (!pool) {
    const local = /localhost|127\.0\.0\.1/.test(PG_URL);
    pool = new pg.Pool({ connectionString: PG_URL, ssl: local ? false : { rejectUnauthorized: false }, max: 2 });
  }
  return pool;
}
async function ensureTable() {
  if (tableReady) return;
  await getPool().query(
    'CREATE TABLE IF NOT EXISTS progress (player TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())'
  );
  tableReady = true;
}

async function load(player) {
  if (PG_URL) {
    await ensureTable();
    const r = await getPool().query('SELECT data FROM progress WHERE player = $1', [player]);
    return r.rows[0] ? r.rows[0].data : null;
  }
  const r = await fetch(`${REDIS_URL}/get/${encodeURIComponent('pakkasretki:' + player)}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const j = await r.json();
  return j.result ? JSON.parse(j.result) : null;
}

async function store(player, value) {
  if (PG_URL) {
    await ensureTable();
    await getPool().query(
      'INSERT INTO progress (player, data, updated_at) VALUES ($1, $2, now()) ON CONFLICT (player) DO UPDATE SET data = EXCLUDED.data, updated_at = now()',
      [player, value]
    );
    return true;
  }
  const r = await fetch(`${REDIS_URL}/set/${encodeURIComponent('pakkasretki:' + player)}`, { method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, body: value });
  return r.ok;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!PG_URL && !(REDIS_URL && REDIS_TOKEN)) return res.status(503).json({ error: 'Database not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const player = req.method === 'GET' ? req.query.player : body && body.player;
  if (!PLAYERS.includes(player)) return res.status(400).json({ error: 'Unknown player' });

  try {
    if (req.method === 'GET') return res.status(200).json({ data: await load(player) });
    if (req.method === 'POST') {
      const value = JSON.stringify((body && body.data) || {});
      if (value.length > 300000) return res.status(413).json({ error: 'Too large' });
      const ok = await store(player, value);
      return res.status(ok ? 200 : 500).json({ ok });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Database error' });
  }
}
