// run this script with node --experimental-strip-types seed_db.ts. create the db directory first

import Database from "better-sqlite3"
import bcrypt from "bcryptjs"

const DB_PATH = "../db/data.db"
const SALT_ROUNDS = 10

function initDatabase() {
  const db = new Database(DB_PATH)

  db.pragma("journal_mode = WAL")

  // create User table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `).run()

  return db
}

function seedUsers(db: Database.Database) {
  // change the values
  const users = [{ username: "test", password: "test" }]

  const insert = db.prepare(`
    INSERT OR IGNORE INTO User (username, password)
    VALUES (?, ?)
  `)

  for (const { username, password } of users) {
    const hashed = bcrypt.hashSync(password, SALT_ROUNDS)

    insert.run(username, hashed)
    console.log(`Seeded user : ${username}`)
  }
}

function main() {
  const db = initDatabase()

  seedUsers(db)
  db.close()
  console.log("✅ Database initialized and seeded.")
}

// uncomment this. it is commented because Nuxt wants to run this file in dev mode
// main()
