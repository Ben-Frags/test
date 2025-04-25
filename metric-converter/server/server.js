const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Create SQLite database
const db = new sqlite3.Database('conversions.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the conversions database.');
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS conversion_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_unit TEXT NOT NULL,
  to_unit TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  UNIQUE(from_unit, to_unit)
)`);

app.use(cors());
app.use(express.json());

// Track conversion
app.post('/api/track-conversion', (req, res) => {
  const { fromUnit, toUnit } = req.body;
  
  db.run(`INSERT INTO conversion_counts (from_unit, to_unit)
          VALUES (?, ?)
          ON CONFLICT(from_unit, to_unit)
          DO UPDATE SET count = count + 1`,
    [fromUnit, toUnit],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
});

// Get conversion counts
app.get('/api/conversion-counts', (req, res) => {
  db.all(`SELECT from_unit, to_unit, count FROM conversion_counts`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
