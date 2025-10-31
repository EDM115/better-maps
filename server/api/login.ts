import db from "@@/server/api/db"

import jwt from "jsonwebtoken"

import { compare } from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET ?? "secret"

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  const {
    username, password,
  }: {
    username: string; password: string;
  } = await readBody(event)

  const stmt = db.prepare(`
    SELECT id, username, password, role
    FROM User
    WHERE username = ?
  `)
  const user = stmt.get(username) as {
    id: number; username: string; password: string; role: string; map_id: number;
  } | undefined

  if (!user) {
    throw createError({
      status: 401, message: "The user does not exist",
    })
  }

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    throw createError({
      status: 401, message: "Invalid password",
    })
  }

  const token = jwt.sign(
    {
      id: user.id, username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  )

  return {
    status: 200,
    body: {
      success: "User connected",
      user: {
        id: user.id, username: user.username, token, role: user.role, map_id: user.map_id,
      },
    },
  }
})
