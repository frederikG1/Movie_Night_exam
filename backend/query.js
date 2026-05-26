import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("database/movies.db");

const result = db.prepare("SELECT * FROM users").all();

console.log(result);
