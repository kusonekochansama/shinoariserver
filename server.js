const { Pool } = require('pg');

// データベース接続設定
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // SSLを無効にする設定
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    } else {
        console.log('Database connected successfully');
    }
});
