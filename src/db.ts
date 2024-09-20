import { Pool, QueryConfigValues, QueryResultRow} from 'pg'
import dotenv from 'dotenv';
dotenv.config({ path: './.secrets' });

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    database: process.env.POSTGRES_DATABASE
});


 async function query<T extends QueryResultRow = any, I = any[]>(q: string, v?: QueryConfigValues<I>) {
    try {
        return await pool.query<T, I>(q, v);
    } catch (err) {
        throw err;
    }
}

export default query 
