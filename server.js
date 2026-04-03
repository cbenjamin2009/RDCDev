const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = process.env.PORT || 3000;
const DATA_FILE = '/data/dates.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

function readDates() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return { mutualDate: null, purchaseDate: null };
}

function writeDates(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/dates', (req, res) => {
  res.json(readDates());
});

app.post('/api/dates', (req, res) => {
  const { mutualDate, purchaseDate } = req.body;
  const current = readDates();
  const updated = {
    mutualDate:   mutualDate   !== undefined ? mutualDate   : current.mutualDate,
    purchaseDate: purchaseDate !== undefined ? purchaseDate : current.purchaseDate,
  };
  writeDates(updated);
  res.json(updated);
});

// Catch-all — return React app for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => console.log(`Deal Tracker running on http://localhost:${PORT}`));
