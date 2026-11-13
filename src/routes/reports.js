const express = require('express');
const db = require('../db');
const { validateReport, parseBbox } = require('../validate');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const errors = validateReport(req.body);
  if (errors.length) return res.status(400).json({ error: 'invalid fields', fields: errors });
  const riderId = req.get('X-Rider-Id');
  if (!riderId) return res.status(401).json({ error: 'missing rider id' });
  try {
    const { lat, lng, kind, note, occurred_at } = req.body;
    const { rows } = await db.query(
      `insert into reports (rider_id, lat, lng, kind, note, occurred_at)
       values ($1, $2, $3, $4, $5, $6) returning id, created_at`,
      [riderId, lat, lng, kind, note || null, occurred_at],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const box = parseBbox(req.query.bbox);
  if (!box) return res.status(400).json({ error: 'bbox must be minLng,minLat,maxLng,maxLat' });
  try {
    const { rows } = await db.query(
      `select id, lat, lng, kind, note, occurred_at from reports
       where lat between $1 and $2 and lng between $3 and $4
       order by occurred_at desc limit 500`,
      [box.minLat, box.maxLat, box.minLng, box.maxLng],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
