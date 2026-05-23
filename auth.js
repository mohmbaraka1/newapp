const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'azza_secret_2025';

function getDb(req) {
  return req.app.locals.db;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, type = 'idea' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });

    const db = getDb(req);
    const [exists] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0)
      return res.status(400).json({ error: 'البريد مستخدم مسبقاً' });

    const hash = bcrypt.hashSync(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
      [name, email, hash, type]
    );

    const [rows] = await db.execute(
      'SELECT id, name, email, type, role FROM users WHERE id = ?',
      [result.insertId]
    );
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '30d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });

    const db = getDb(req);
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'البريد غير موجود' });

    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '30d' });
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    const decoded = jwt.verify(token, SECRET);
    const db = getDb(req);
    const [rows] = await db.execute(
      'SELECT id, name, email, type, role FROM users WHERE id = ?',
      [decoded.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'غير موجود' });
    res.json(rows[0]);
  } catch (err) {
    res.status(401).json({ error: 'توكن غير صالح' });
  }
});
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    const decoded = jwt.verify(token, SECRET);
    const { name, bio, phone, location, latitude, longitude } = req.body;
    const db = getDb(req);

    await db.execute(`
      UPDATE users SET name=?, bio=?, phone=?, location=?, latitude=?, longitude=?,
      updated_at=NOW() WHERE id=?
    `, [name, bio, phone, location, latitude, longitude, decoded.id]);

    const [rows] = await db.execute(
      'SELECT id, name, email, type, role, bio, phone, location, latitude, longitude FROM users WHERE id = ?',
      [decoded.id]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;