// GET : - all lines from map, get by id
// POST : create line
// PUT : update line
// DELETE : delete line

/*
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
*/
