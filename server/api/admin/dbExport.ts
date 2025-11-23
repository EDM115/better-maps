import db from "@@/server/api/db"

import fs from "node:fs/promises"
import path from "node:path"

import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  const { format } = getQuery(event)
  const timestamp = Date.now()
  const tempDir = path.join(process.cwd(), "temp")

  await fs.mkdir(tempDir, { recursive: true })
  const tables = [ "Map", "User", "Icon", "Point" ]

  if (format === "sql") {
    const dumpPath = path.join(tempDir, `backup_${timestamp}.sql`)

    await execAsync(`sqlite3 "${db.name}" .dump > "${dumpPath}"`)

    const fileContent = await fs.readFile(dumpPath)

    await fs.unlink(dumpPath)

    return {
      body: fileContent.toString("base64"),
      filename: "better-maps-backup.sql",
    }
  } else if (format === "sqlite") {
    const dbCopyPath = path.join(tempDir, `backup_${timestamp}.db`)

    await fs.copyFile(db.name, dbCopyPath)

    const fileContent = await fs.readFile(dbCopyPath)

    await fs.unlink(dbCopyPath)

    return {
      body: fileContent.toString("base64"),
      filename: "better-maps-backup.db",
    }
  } else if (format === "json") {
    const jsonResults = await Promise.all(tables.map(async (table) => {
      const outputPath = path.join(tempDir, `${table}_${timestamp}.json`)

      await execAsync(`sqlite3 -json "${db.name}" "SELECT * FROM ${table};" > "${outputPath}"`)

      const content = await fs.readFile(outputPath, "utf-8")

      await fs.unlink(outputPath)

      return {
        // oxlint-disable-next-line no-unsafe-type-assertion
        table, data: JSON.parse(content) as unknown[],
      }
    }))

    const dataObj: Record<string, unknown[]> = {}

    for (const {
      table, data,
    } of jsonResults) {
      dataObj[table] = data
    }

    const jsonString = JSON.stringify(dataObj, null, 2)

    return {
      body: Buffer.from(jsonString)
        .toString("base64"),
      filename: "better-maps-backup.json",
    }
  } else {
    const csvData = await Promise.all(tables.map(async (table) => {
      const outputPath = path.join(tempDir, `${table}_${timestamp}.csv`)

      await execAsync(`sqlite3 -header -csv "${db.name}" "SELECT * FROM ${table};" > "${outputPath}"`)
      const content = await fs.readFile(outputPath, "utf-8")

      await fs.unlink(outputPath)

      return `-- ${table} --\n${content}`
    }))

    return {
      body: Buffer.from(csvData.join("\n"))
        .toString("base64"),
      filename: "better-maps-backup.csv",
    }
  }
})
