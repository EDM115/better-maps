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
    ORDER BY sort_order ASC, id ASC
  `)
    .all() as {
      id: number;
      name: string;
      color: string;
      icon: string;
      visible: number;
      sort_order: number;
    }[] | undefined

  if (!icons) {
    throw createError({
      status: 404,
      message: "Icons not found",
    })
  }

  const normalizedIcons = icons.map((icon) => ({
    ...icon,
    visible: Boolean(icon.visible),
    sort_order: icon.sort_order ?? 0,
  }))

  return {
    status: 200,
    body: {
      success: "Icons retrieved",
      icons: normalizedIcons,
    },
  }
})
