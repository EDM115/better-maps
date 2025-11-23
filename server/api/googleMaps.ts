export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  const config = useRuntimeConfig()
  const GOOGLE_MAPS_API_KEY = config.googleMapsApiKey

  if (!GOOGLE_MAPS_API_KEY) {
    throw createError({
      status: 500,
      message: "Google Maps API key is not configured on the server",
    })
  }

  return {
    status: 200,
    body: {
      success: "Google Maps backend is configured",
    },
  }
})
