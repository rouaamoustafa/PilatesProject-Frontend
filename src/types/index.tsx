export type Role = "admin" | "superadmin" | "instructor" | "gym_owner" | "subscriber"

// Base user interface
export interface User {
  id: string
  full_name: string
  email: string
  role: Role
  created_at: string
  deletedAt?: string
}

// Location interface
export interface Location {
  id: string
  address?: string
  mapLink?: string
}

// Gym Owner interface
export interface GymOwner extends User {
  bio?: string
  phone?: string
  image?: string
  address?: Location | null
}

// Instructor interface
export interface Instructor extends User {
  bio?: string
  phone?: string
  image?: string
  address?: Location | null
  cv?: string      // Added missing property
  link?: string    // Added missing property
}

// DTOs
export interface CreateGymOwnerDto {
  full_name: string
  email: string
  password: string
  role: Role
  bio?: string
  phone?: string
  address?: string
  mapLink?: string
  image?: string
}

export interface UpdateGymOwnerDto {
  full_name?: string
  email?: string
  password?: string
  bio?: string
  phone?: string
  address?: string
  mapLink?: string
  image?: string
}

// Added missing DTOs
export interface CreateInstructorDto {
  full_name: string
  email: string
  password: string
  role: Role
  bio?: string
  link?: string
  image?: string
  cv?: string
}

export interface UpdateInstructorDto {
  full_name?: string
  email?: string
  password?: string
  bio?: string
  link?: string
  image?: string
  cv?: string
}


export enum Level {
  BEGINNER     = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED     = 'advanced',
}

export enum Mode {
  ONLINE = 'online',
  ONSITE = 'onsite',
}

export interface Course {
  id: string;
  title: string;
  level: Level;
  mode: Mode;
  price: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm:ss
  durationMinutes: number;
  instructor: {
    user:{
      id: string;
      full_name: string;
    }
  };
  location?: {
    id: string;
    address: string;
  };
}

export interface CreateCourseDto {
  title: string;
  instructorId: string;
  level: Level;
  mode: Mode;
  locationId?: string;
  price: number;
  date: string;
  startTime: string;
  durationMinutes: number;
}
export interface InstructorOption {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface LocationOption {
  id: string;
  address: string;
  mapLink?: string;
}
export type UpdateCourseDto = Partial<CreateCourseDto>;

export interface CourseDetail {
  id: string
  title: string
  description?: string
  level?: string
  mode?: string
  price: number
  date: string          // YYYY-MM-DD
  startTime: string     // HH:mm:ss
  durationMinutes: number
  instructor: {
    user: { full_name: string; email: string }
    image?: string
  }
  location?: { address: string; mapLink?: string }
}
export interface CartLine {
  id: string; // cart line id (can be uuid or whatever)
  qty: number;
  course: {
    id: string;
    title: string;
    description?: string;
    price: number;
    date: string;           // YYYY-MM-DD
    startTime: string;      // HH:mm:ss
    durationMinutes: number;
    instructor: {
      user: {
        full_name: string;
        email: string;
      };
      image?: string;
    };
    location?: {
      address: string;
      mapLink?: string;
    };
    // Add other course props if you use more
  };
}
export interface CourseGym {
  id: string;
  title: string;
  days: string;              // e.g., "Mondays & Wednesdays"
  time: string;              // e.g., "09.00am - 10.00am"
  instructorName?: string;   // optional, show instructor if you want
  bookUrl?: string;          // optional, url to book page
}
// export interface CartLine {
//   id: string
//   course: {
//     id: string
//     title: string
//     price: number
//     date?: string
//     startTime?: string
//   }
// }