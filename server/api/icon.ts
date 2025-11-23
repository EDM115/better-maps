import db from "@@/server/api/db"

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  // oxlint-disable-next-line no-unsafe-type-assertion
  const icons = db.prepare(`
    SELECT * FROM Icon
  `)
    .all() as {
      id: number;
      name: string;
      color: string;
      icon: string;
    }[] | undefined

  if (!icons) {
    throw createError({
      status: 404,
      message: "Icons not found",
    })
  }

  return {
    status: 200,
    body: {
      success: "Icons retrieved",
      icons,
    },
  }
})
