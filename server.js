const { Pool } = require('pg');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, 'combined-certificates.crt')).toString(),
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
