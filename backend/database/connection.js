import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('database/movies.db')

export default db;


