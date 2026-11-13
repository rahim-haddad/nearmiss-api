const test = require('node:test');
const assert = require('node:assert');
const { validateReport, parseBbox } = require('../src/validate');

test('accepts a normal report', () => {
  const r = { lat: -37.7445, lng: 144.9631, kind: 'dooring', note: 'parked car, Sydney Rd', occurred_at: '2023-04-12T08:10:00+10:00' };
  assert.deepStrictEqual(validateReport(r), []);
});

test('rejects bad coordinates and unknown kind', () => {
  const r = { lat: 120, lng: 'x', kind: 'meteor', occurred_at: '2023-04-12T08:10:00Z' };
  assert.deepStrictEqual(validateReport(r), ['lat', 'lng', 'kind']);
});

test('rejects reports from the future', () => {
  const r = { lat: -37.8, lng: 144.9, kind: 'other', occurred_at: '2999-01-01T00:00:00Z' };
  assert.deepStrictEqual(validateReport(r), ['occurred_at']);
});

test('bbox parsing', () => {
  assert.deepStrictEqual(parseBbox('144.9,-37.8,145.0,-37.7'), { minLng: 144.9, minLat: -37.8, maxLng: 145.0, maxLat: -37.7 });
  assert.strictEqual(parseBbox('1,2,3'), null);
  assert.strictEqual(parseBbox('145,-37,144,-38'), null);
});
