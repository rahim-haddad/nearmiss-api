const express = require('express');
const db = require('../db');

const router = express.Router();

// Snap reports to a grid and count them. cell is in degrees; 0.002 is roughly 200 m in Melbourne.
router.get('/', async (req, res, next) => {
  const cell = Math.min(Math.max(Number(req.query.cell) || 0.002, 0.0005), 0.05);
  try {
    const { rows } = await db.query(
      `select round(lat / $1) * $1 as lat, round(lng / $1) * $1 as lng, count(*)::int as reports
       from reports group by 1, 2 having count(*) >= 2 order by reports desc limit 50`,
      [cell],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
