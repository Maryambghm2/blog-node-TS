const pg = require('pg');
const { Pool } = pg;
require('dotenv').config({ path: './.secrets' });

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE
});

async function query(req, params) {
    try {
        return await pool.query(req, params);
    } catch (err) {
        return ('Erreur', err)
    }
}

module.exports = query;