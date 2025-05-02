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

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Map (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      start_zoom INTEGER NOT NULL
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS UserMap (
      map_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (map_id, user_id),
      FOREIGN KEY (map_id) REFERENCES Map(id),
      FOREIGN KEY (user_id) REFERENCES User(id)
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Point (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      color TEXT NOT NULL DEFAULT '#FFB86C',
      icon TEXT NOT NULL DEFAULT 'house',
      map_id INTEGER NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (map_id) REFERENCES Map(id)
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Line (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '#8BE9FD',
      map_id INTEGER NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (map_id) REFERENCES Map(id)
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

async function seedMaps(db: Database.Database) {
  const raw = process.env.STARTING_POINT
  const [ lat, lng, zoom ] = raw
    ? raw.split(",").map(Number)
    : [ 48.8566, 2.3522, 3 ]

  const insert = db.prepare(`
    INSERT OR IGNORE INTO Map (start_lat, start_lng, start_zoom)
    VALUES (?, ?, ?)
  `)
  const mapId = insert.run(lat, lng, zoom).lastInsertRowid

  const insertLink = db.prepare(`
    INSERT OR IGNORE INTO UserMap (map_id, user_id)
    VALUES (?, ?)
  `)

  const users = db.prepare("SELECT id FROM User").all() as Array<{ id: number }>

  await Promise.all(users.map(async ({ id }) => {
    insertLink.run(mapId, id)
  }))

  console.log(`Seeded map with id : ${mapId}`)
}

async function main() {
  if (process.env.SEED === "true") {
    const db = initDatabase()

    await seedUsers(db)
    await seedMaps(db)
    db.close()
    console.log("✅ Database initialized and seeded")
  } else {
    console.log("❌ Skipping database initialization")
  }
}

await main()
