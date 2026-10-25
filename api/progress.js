// Saves Julius' and Sophia's progress to the database (Upstash Redis via Vercel Marketplace).
// Works with either env var naming: KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN.
const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PLAYERS = ['Julius', 'Sophia'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!DB_URL || !DB_TOKEN) return res.status(503).json({ error: 'Database not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const player = req.method === 'GET' ? req.query.player : body && body.player;
  if (!PLAYERS.includes(player)) return res.status(400).json({ error: 'Unknown player' });
  const key = encodeURIComponent('pakkasretki:' + player);
  const auth = { Authorization: `Bearer ${DB_TOKEN}` };

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${DB_URL}/get/${key}`, { headers: auth });
      const j = await r.json();
      return res.status(200).json({ data: j.result ? JSON.parse(j.result) : null });
    }
    if (req.method === 'POST') {
      const value = JSON.stringify((body && body.data) || {});
      if (value.length > 300000) return res.status(413).json({ error: 'Too large' });
      const r = await fetch(`${DB_URL}/set/${key}`, { method: 'POST', headers: auth, body: value });
      return res.status(r.ok ? 200 : 500).json({ ok: r.ok });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Database error' });
  }
}
