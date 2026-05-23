const express = require('express');
const router  = express.Router();
const db      = require('../../database');
const jwt     = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'azza_secret_key';

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'توكن غير صالح' });
  }
}

// POST /api/messages/send
router.post('/send', authMiddleware, (req, res) => {
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content)
    return res.status(400).json({ error: 'المستقبل والمحتوى مطلوبان' });
  try {
    const result = db.prepare(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)'
    ).run(req.user.userId, receiver_id, content);
    res.json({ message: 'تم الإرسال بنجاح', messageId: result.lastInsertRowid });
  } catch {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// GET /api/messages/inbox
router.get('/inbox', authMiddleware, (req, res) => {
  const me = req.user.userId;
  try {
    const inbox = db.prepare(`
      SELECT DISTINCT
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_user_id,
        u.name AS other_user_name,
        (SELECT content FROM messages m2
         WHERE (m2.sender_id = ? AND m2.receiver_id = u.id)
            OR (m2.sender_id = u.id AND m2.receiver_id = ?)
         ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM messages m3
         WHERE m3.sender_id = u.id AND m3.receiver_id = ? AND m3.is_read = 0) AS unread
      FROM messages
      JOIN users u ON u.id = CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
      WHERE sender_id = ? OR receiver_id = ?
      ORDER BY (
        SELECT created_at FROM messages m4
        WHERE (m4.sender_id = ? AND m4.receiver_id = u.id)
           OR (m4.sender_id = u.id AND m4.receiver_id = ?)
        ORDER BY m4.created_at DESC LIMIT 1
      ) DESC
    `).all(me, me, me, me, me, me, me, me, me);
    res.json(inbox);
  } catch {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// GET /api/messages/conversation/:userId
router.get('/conversation/:userId', authMiddleware, (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT messages.*,
        s.name AS sender_name,
        r.name AS receiver_name
      FROM messages
      JOIN users s ON messages.sender_id   = s.id
      JOIN users r ON messages.receiver_id = r.id
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).all(req.user.userId, req.params.userId, req.params.userId, req.user.userId);

    db.prepare(
      'UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?'
    ).run(req.user.userId, req.params.userId);

    res.json(messages);
  } catch {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;