import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('database/movies.db')

export default db;

//small single user-project with no big demands
