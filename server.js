const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

let pool;

const connectWithRetry = () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000, // 5秒のタイムアウト
    idleTimeoutMillis: 30000, // 30秒のアイドルタイムアウト
    max: 20 // 最大接続数
  });

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    setTimeout(connectWithRetry, 5000); // 5秒後に再試行
  });
};

connectWithRetry();

app.use(bodyParser.json());

app.get('/highscores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 3');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/highscores', async (req, res) => {
  const { name, score } = req.body;
  try {
    const result = await pool.query('INSERT INTO highscores (name, score) VALUES ($1, $2) RETURNING *', [name, score]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
