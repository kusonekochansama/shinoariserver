const { Pool } = require('pg');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// DATABASE_URL を使ってプールを作成
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // ここでDATABASE_URLを使用
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('combined-certificates.crt').toString(),
    },
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Database connected successfully');
    release();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
