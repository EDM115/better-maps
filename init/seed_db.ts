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
      role TEXT NOT NULL DEFAULT 'user',
      map_id INTEGER NOT NULL,
      FOREIGN KEY (map_id) REFERENCES Map(id)
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Map (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT 'Default Map',
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      start_zoom INTEGER NOT NULL,
      country TEXT NOT NULL,
      show_transit INTEGER NOT NULL DEFAULT 0
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Point (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      color TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'house',
      map_id INTEGER NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      favorite INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (map_id) REFERENCES Map(id)
    );
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS Icon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL
    );
  `).run()

  console.log("\n✅ Database initialized\n")

  return db
}

async function seedMaps(db: Database.Database) {
  const raw = process.env.STARTING_POINT
  const [ lat, lng, zoom ] = raw
    ? raw.split(",").map(Number)
    : [ 48.8566, 2.3522, 3 ]
  const country = process.env.COUNTRY || "fr"

  const insert = db.prepare(`
    INSERT OR IGNORE INTO Map (start_lat, start_lng, start_zoom, country, show_transit)
    VALUES (?, ?, ?, ?, ?)
  `)
  const mapId = insert.run(lat, lng, zoom, country, 0).lastInsertRowid

  console.log(`Seeded map with id : ${mapId}`)
  console.log("\n✅ Map seeding completed\n")
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

  const map = db.prepare("SELECT id FROM Map").get() as { id: number }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO User (username, password, role, map_id)
    VALUES (?, ?, ?, ?)
  `)

  await Promise.all(users.map(async ({ username, password, role }) => {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)

    insert.run(username, hashed, role, map.id)
    console.log(`Seeded user : ${username}`)
  }))

  console.log("\n✅ User seeding completed\n")
}

async function seedIcons(db: Database.Database) {
  const raw = process.env.SEED_ICONS || "[]"
  let icons: Array<{ name: string, color: string, icon: string }>

  try {
    icons = JSON.parse(raw)
  } catch (e) {
    console.error("❌ failed to parse SEED_ICONS :", e)
    icons = []
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO Icon (name, color, icon)
    VALUES (?, ?, ?)
  `)

  await Promise.all(icons.map(async ({ name, color, icon }) => {
    insert.run(name, color, icon)
    console.log(`Seeded icon : ${name}`)
  }))

  console.log("\n✅ Icon seeding completed\n")
}

async function main() {
  if (process.env.SEED === "true") {
    const db = initDatabase()

    try {
      await seedMaps(db)
      await seedUsers(db)
      await seedIcons(db)
    } catch (e) {
      console.error("❌ Error seeding database :", e)
    } finally {
      db.close()
    }
    console.log("✅ Database initialized and seeded")
  } else {
    console.log("❌ Skipping database initialization")
  }
}

await main()
