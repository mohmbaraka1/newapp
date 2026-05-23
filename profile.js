const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "azza_secret_2025";

/* =========================
   DB HELPER
========================= */
function getDb(req) {
  return req.app.locals.db;
}

/* =========================
   AUTH MIDDLEWARE
========================= */
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "يجب تسجيل الدخول" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "توكن غير صالح" });
  }
}

/* =========================
   GET PROFILE
========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDb(req);

    const [rows] = await db.execute(
      `SELECT id, name, email, type, created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE PROFILE
========================= */
router.put("/", authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const db = getDb(req);

    // تحقق من وجود المستخدم
    const [userRows] = await db.execute(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    // تحديث البيانات
    await db.execute(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ?`,
      [name, email, req.user.id]
    );

    // 🔥 رجّع user محدث (مهم جدًا للواجهة)
    const [updatedRows] = await db.execute(
      `SELECT id, name, email, type, created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedRows[0], // 🔥 هذا أهم سطر
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;