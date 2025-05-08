export const iconColors = {
  "mdi-home-outline": "#50FA7B",
  "mdi-cart-outline": "#8BE9FD",
  "mdi-book-open-variant-outline": "#FF79C6",
  "mdi-bag-personal-outline": "#BD93F9",
  "mdi-food-outline": "#F1FA8C",
}

export const iconOptions = [
  { label: "Appart", value: "mdi-home-outline", color: iconColors["mdi-home-outline"] },
  { label: "Courses", value: "mdi-cart-outline", color: iconColors["mdi-cart-outline"] },
  { label: "Écoles", value: "mdi-book-open-variant-outline", color: iconColors["mdi-book-open-variant-outline"] },
  { label: "Travail", value: "mdi-bag-personal-outline", color: iconColors["mdi-bag-personal-outline"] },
  { label: "Resto", value: "mdi-food-outline", color: iconColors["mdi-food-outline"] },
]

export const getIconColor = (icon: string) => iconColors[icon as keyof typeof iconColors] || "#FF5555"

export interface Pin {
  id: number
  name: string
  description: string
  formatted_address: string
  icon: string
  color: string
  position: {
    lat: number
    lng: number
  }
  visible: boolean
}
