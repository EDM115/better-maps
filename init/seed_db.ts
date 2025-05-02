// run this script with node --experimental-strip-types init/seed_db.ts

import "dotenv/config"

import bcrypt from "bcryptjs"
import Database from "better-sqlite3"

import { mkdirSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = resolve(__dirname, "../db/data.db")
const SALT_ROUNDS = 10

function initDatabase() {
  mkdirSync(dirname(DB_PATH), { recursive: true })

  const db = new Database(DB_PATH)

  db.pragma("journal_mode = WAL")

  db.prepare(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );
  `).run()

  return db
}

async function seedUsers(db: Database.Database) {
  const raw = process.env.SEED_USERS
    ?.replace("\\'", "'")
    // eslint-disable-next-line @stylistic/quotes
    .replace('\\"', '"') || "[]"
  let users: Array<{ username: string, password: string, role: string }>

  try {
    users = JSON.parse(raw)
  } catch (e) {
    console.error("❌ failed to parse SEED_USERS :", e)
    users = []
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO User (username, password, role)
    VALUES (?, ?, ?)
  `)

  await Promise.all(users.map(async ({ username, password, role }) => {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)

    insert.run(username, hashed, role)
    console.log(`Seeded user : ${username}`)
  }))
}

async function main() {
  if (process.env.SEED === "true") {
    const db = initDatabase()

    await seedUsers(db)
    db.close()
    console.log("✅ Database initialized and seeded.")
  } else {
    console.log("❌ Skipping database initialization.")
  }
}

main()
