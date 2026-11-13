const KINDS = ['close_pass', 'dooring', 'left_hook', 'pedestrian', 'surface', 'other'];

function validateReport(body) {
  const errors = [];
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push('lat');
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.push('lng');
  if (!KINDS.includes(body.kind)) errors.push('kind');
  if (body.note && String(body.note).length > 280) errors.push('note');
  const when = new Date(body.occurred_at);
  if (Number.isNaN(when.getTime()) || when > new Date()) errors.push('occurred_at');
  return errors;
}

function parseBbox(s) {
  const parts = String(s || '').split(',').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [minLng, minLat, maxLng, maxLat] = parts;
  if (minLng >= maxLng || minLat >= maxLat) return null;
  return { minLng, minLat, maxLng, maxLat };
}

module.exports = { validateReport, parseBbox, KINDS };
