require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/reports', require('./routes/reports'));
app.use('/hotspots', require('./routes/hotspots'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server error' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`nearmiss-api on :${port}`));
}

module.exports = app;
