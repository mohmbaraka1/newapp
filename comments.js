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

// POST /api/comments/add
router.post('/add', authMiddleware, (req, res) => {
  const { idea_id, content } = req.body;
  if (!idea_id || !content)
    return res.status(400).json({ error: 'الفكرة والتعليق مطلوبان' });
  try {
    const result = db.prepare(
      'INSERT INTO comments (idea_id, user_id, content) VALUES (?, ?, ?)'
    ).run(idea_id, req.user.userId, content);
    res.json({ message: 'تم إضافة التعليق', commentId: result.lastInsertRowid });
  } catch {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// GET /api/comments/:ideaId
router.get('/:ideaId', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT comments.*, users.name AS author
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE idea_id = ?
      ORDER BY created_at ASC
    `).all(req.params.ideaId);
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;