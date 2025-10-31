export interface Pin {
  id: number;
  name: string;
  description: string;
  formatted_address: string;
  icon: number;
  color: string;
  position: {
    lat: number;
    lng: number;
  };
  visible: boolean;
  favorite: boolean;
}

export type Icon = {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export const getIconColor = (icon: number, icons: Icon[]) => {
  const foundIcon = icons.find((i) => i.id === icon)

  return foundIcon
    ? foundIcon.color
    : "#FF5555"
}
