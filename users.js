const router = require('express').Router();
const db = require('../../database');
const auth = require('../middleware/auth');

router.get('/nearby', auth, (req, res) => {
  const { lat, lng, radius = 50, type } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'الموقع مطلوب' });

  const users = db.prepare(`
    SELECT id, name, type, bio, location, latitude, longitude, avatar_url
    FROM users WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    AND is_active = 1 AND id != ?
  `).all(req.user.id);

  const R = 6371;
  const filtered = users.map(u => {
    const dLat = (u.latitude - lat) * Math.PI / 180;
    const dLng = (u.longitude - lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat * Math.PI/180) * Math.cos(u.latitude * Math.PI/180) * Math.sin(dLng/2)**2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return { ...u, distance: Math.round(dist * 10) / 10 };
  })
  .filter(u => u.distance <= radius && (!type || u.type === type))
  .sort((a, b) => a.distance - b.distance);

  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const user = db.prepare(
    'SELECT id, name, type, bio, location, avatar_url, created_at FROM users WHERE id = ? AND is_active = 1'
  ).get(req.params.id);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
  user.ideas = db.prepare(
    'SELECT id, title, category, stage FROM ideas WHERE user_id = ? AND is_active = 1'
  ).all(req.params.id);
  res.json(user);
});

router.get('/', (req, res) => {
  const { search, type } = req.query;
  let query = 'SELECT id, name, type, bio, location, avatar_url FROM users WHERE is_active = 1';
  const params = [];
  if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (type)   { query += ' AND type = ?'; params.push(type); }
  query += ' LIMIT 20';
  res.json(db.prepare(query).all(...params));
});

module.exports = router;