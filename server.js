const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false // SSLを無効にしてみる
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connection successful:', res.rows);
    }
    pool.end();
});

const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
