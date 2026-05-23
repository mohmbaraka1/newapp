const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const SECRET = process.env.JWT_SECRET || 'azza_secret_2025';

function getDb(req) {
  return req.app.locals.db;
}

/* =========================
   AUTH MIDDLEWARE
========================= */
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول' });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'توكن غير صالح' });
  }
}

/* =========================
   FILE UPLOAD (MEDIA)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../../../public/uploads')),

  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());

    valid ? cb(null, true) : cb(new Error('نوع الملف غير مدعوم'));
  },
});

/* =========================
   HELPERS
========================= */
async function attachMedia(db, ideas) {
  return Promise.all(
    ideas.map(async (idea) => {
      const [media] = await db.execute(
        'SELECT * FROM idea_media WHERE idea_id = ?',
        [idea.id]
      );

      return { ...idea, media };
    })
  );
}

/* =========================
   GET ALL IDEAS
========================= */
router.get('/', async (req, res) => {
  try {
    const db = getDb(req);

    const [ideas] = await db.execute(`
      SELECT ideas.*, users.name AS owner, users.type AS owner_type
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      ORDER BY ideas.created_at DESC
    `);

    const result = await attachMedia(db, ideas);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET MY IDEAS
========================= */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const db = getDb(req);

    const [ideas] = await db.execute(`
      SELECT ideas.*, users.name AS owner
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      WHERE ideas.user_id = ?
      ORDER BY ideas.created_at DESC
    `, [req.user.id]);

    const result = await attachMedia(db, ideas);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE IDEA
========================= */
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
  const { title, description, category, stage } = req.body;

  if (!title || !description || !category || !stage) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }

  try {
    const db = getDb(req);

    const [result] = await db.execute(
      `INSERT INTO ideas (user_id, title, description, category, stage)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, title, description, category, stage]
    );

    const ideaId = result.insertId;

    if (req.file) {
      const mediaUrl = '/uploads/' + req.file.filename;
      const mediaType = req.file.mimetype.startsWith('video')
        ? 'video'
        : 'image';

      await db.execute(
        `INSERT INTO idea_media (idea_id, media_url, media_type)
         VALUES (?, ?, ?)`,
        [ideaId, mediaUrl, mediaType]
      );
    }

    // 🔥 مهم: رجّع الفكرة كاملة
    const [rows] = await db.execute(`
      SELECT ideas.*, users.name AS owner, users.type AS owner_type
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      WHERE ideas.id = ?
    `, [ideaId]);

    const [media] = await db.execute(
      'SELECT * FROM idea_media WHERE idea_id = ?',
      [ideaId]
    );

    res.json({
      success: true,
      idea: {
        ...rows[0],
        media,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE IDEA
========================= */
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, category, stage } = req.body;

  try {
    const db = getDb(req);

    // check ownership
    const [rows] = await db.execute(
      'SELECT * FROM ideas WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'غير مسموح' });
    }

    await db.execute(
      `UPDATE ideas
       SET title=?, description=?, category=?, stage=?
       WHERE id=?`,
      [title, description, category, stage, req.params.id]
    );

    // 🔥 رجّع الفكرة بعد التحديث
    const [updated] = await db.execute(`
      SELECT ideas.*, users.name AS owner, users.type AS owner_type
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      WHERE ideas.id = ?
    `, [req.params.id]);

    const [media] = await db.execute(
      'SELECT * FROM idea_media WHERE idea_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      idea: {
        ...updated[0],
        media,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE IDEA
========================= */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDb(req);

    const [rows] = await db.execute(
      'SELECT * FROM ideas WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'غير مسموح' });
    }

    await db.execute('DELETE FROM idea_media WHERE idea_id = ?', [req.params.id]);
    await db.execute('DELETE FROM ideas WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'تم حذف الفكرة بنجاح',
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;