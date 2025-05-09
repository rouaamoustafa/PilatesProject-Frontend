// src/data/gyms.ts
export type Gym = {
    id: number
    name: string
    location: string
    description: string
  }
  
  export const GYMS: Gym[] = [
    {
      id: 1,
      name: 'Downtown Pilates Studio',
      location: 'Beirut, Lebanon',
      description: 'A bright studio in the heart of the city with reformers & mat classes.',
    },
    // …other gyms
  ]
  