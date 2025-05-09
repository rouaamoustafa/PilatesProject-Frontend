// src/types/index.ts

export type Role = 'superadmin' | 'admin' | 'gym_owner' | 'instructor' | 'subscriber'

export interface User {
id: string
full_name: string
email: string
role: Role
deletedAt?: string | null
created_at?: string
}

// Represents an Instructor profile linked to a User, flattened for UI convenience
export interface Instructor {
id: string            // profile id
full_name: string     // from user
email: string         // from user
role: Role            // from user
deletedAt?: string | null
created_at?: string   // from user
bio?: string
image?: string        // URL or filename
cv?: string           // URL or filename
link?: string
}

// Payload for creating a new instructor + user in one request
export interface CreateInstructorDto {
full_name: string
email: string
password: string
role: Role
bio?: string
link?: string
image?: File
cv?: File
}

// Payload for updating an existing instructor or its user
export interface UpdateInstructorDto {
full_name?: string
email?: string
password?: string
role?: Role
bio?: string
link?: string
image?: File
cv?: File
}

