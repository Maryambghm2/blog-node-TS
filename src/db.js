const pg = require ('pg');
const {Pool} = pg;
// const fs = require('fs');

// password = fs.readFileSync('./secrets').trim();

const pool = new Pool({
    user: 'postgres',
   password: 'P@ssword',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});

async function query(req, params) {
    try {
        return await pool.query(req, params); 
    } catch (err) {
        return ('Erreur', err)
    }
}

module.exports = query