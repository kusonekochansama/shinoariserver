require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// 環境変数から許可するオリジンを取得
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// PostgreSQLデータベースへの接続設定
const pool = new Pool({
    connectionString: 'postgresql://kusonekochan:gJONrWmTJmoq2x46pTd5xOOxc8KytPJB@dpg-cp5vsoo21fec73ecvc5g-a.singapore-postgres.render.com/suika',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Database connected successfully');
    release();
});

// ハイスコアの取得エンドポイント
app.get('/highscores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving highscores', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ハイスコアの保存エンドポイント
app.post('/highscores', async (req, res) => {
    const { name, score } = req.body;
    try {
        const result = await pool.query('INSERT INTO highscores (name, score) VALUES ($1, $2) RETURNING *', [name, score]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error saving highscore', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
