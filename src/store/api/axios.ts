import type { UpdateGymOwnerDto, UpdateInstructorDto } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: false, // <--- CHANGED (no cookies)
});

// Request interceptor to add Authorization header
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log(
    '[API Request]',
    cfg.method?.toUpperCase(),
    cfg.baseURL + cfg.url,
    'Auth header:',
    cfg.headers?.Authorization,
    'Cookies:',
    document.cookie
  );
  return cfg;
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - clearing auth token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
    return Promise.reject(error);
  }
);

export const updateMyOwnerProfile = (data: UpdateGymOwnerDto) => api.patch("/gym-owners/me", data);
export const updateMyInstructorProfile = (data: UpdateInstructorDto) => api.patch("/instructors/me", data);

export default api;
export { api };
