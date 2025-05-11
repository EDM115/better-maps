import db from "./db"

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({ status: 405, message: "Méthode non autorisée" })
  }

  const icons = db.prepare(`
    SELECT * FROM Icon
  `).all() as {
    id: number
    name: string
    color: string
    icon: string
  }[] | undefined

  if (!icons) {
    throw createError({
      status: 404,
      message: "Icônes non trouvées",
    })
  }

  return {
    status: 200,
    body: {
      success: "Icônes récupérées",
      icons,
    },
  }
})
