import db from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ?? "secret"

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ status: 405, message: "Méthode non autorisée" })
  }

  const { username, password }: { username: string, password: string } = await readBody(event)

  const stmt = db.prepare(`
    SELECT id, username, password, role
    FROM User
    WHERE username = ?
  `)
  const user = stmt.get(username) as { id: number; username: string; password: string; role: string; map_id: number } | undefined

  if (!user) {
    throw createError({ status: 401, message: "L'utilisateur n'existe pas" })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw createError({ status: 401, message: "Mot de passe invalide" })
  }

  // eslint-disable-next-line import-x/no-named-as-default-member
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  )

  return {
    status: 200,
    body: {
      success: "Utilisateur connecté",
      user: { id: user.id, username: user.username, token, role: user.role, map_id: user.map_id },
    },
  }
})
