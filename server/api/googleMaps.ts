export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? ""

  return {
    status: 200,
    body: {
      success: "Google Maps API key retrieved",
      apiKey: GOOGLE_MAPS_API_KEY,
    },
  }
})
