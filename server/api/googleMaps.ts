export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({ status: 405, message: "Méthode non autorisée" })
  }

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? ""

  return {
    status: 200,
    body: {
      success: "Clé API Google Maps récupérée",
      apiKey: GOOGLE_MAPS_API_KEY,
    },
  }
})
