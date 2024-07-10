const { Pool } = require('pg');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // 一時的に検証を無効化
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
