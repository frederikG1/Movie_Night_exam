import db from "./connection.js";

const deleteMode = process.argv.includes("--delete");

if (deleteMode) {
  db.exec(`DROP TABLE IF EXISTS watch_party_votes`);
  db.exec(`DROP TABLE IF EXISTS watch_party_rooms`);
  db.exec(`DROP TABLE IF EXISTS ratings`);
  db.exec(`DROP TABLE IF EXISTS watchlist`);
  db.exec(`DROP TABLE IF EXISTS movies`);
  db.exec(`DROP TABLE IF EXISTS users`);
}

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER UNIQUE,
        title TEXT NOT NULL,
        synopsis TEXT,
        release_year INTEGER,
        tmdb_rating REAL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER REFERENCES movies(id),
        status TEXT DEFAULT 'want_to_watch',
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER REFERENCES movies(id),
        score INTEGER NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS watch_party_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        host_user_id INTEGER REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS watch_party_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER REFERENCES watch_party_rooms(id),
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER REFERENCES movies(id),
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("Database setup complete");
