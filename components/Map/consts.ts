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
  favorite: boolean
}

export type Icon = {
  id: number
  name: string
  color: string
  icon: string
}

export const getIconColor = (icon: string, icons: Icon[]) => {
  const foundIcon = icons.find((i) => i.icon === icon)
  return foundIcon ? foundIcon.color : "#FF5555"
}
