const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/highscores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch high scores' });
  }
});

app.post('/highscores', async (req, res) => {
  const { name, score } = req.body;
  try {
    await pool.query('INSERT INTO highscores (name, score) VALUES ($1, $2)', [name, score]);
    res.status(201).json({ message: 'High score saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save high score' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
