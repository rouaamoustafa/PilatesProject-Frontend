import axios from 'axios'

// point at the Next.js rewrite proxy
const api = axios.create({
  baseURL: '/api',
  withCredentials: false, // or true if you switch to cookie-auth
})

api.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null
  if (token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${token}`
  }
  console.log('[API Request]', cfg.method, cfg.baseURL + cfg.url, 'Auth:', cfg.headers?.Authorization)
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(err)
  }
)

export default api

// import type { UpdateGymOwnerDto, UpdateInstructorDto } from "@/types";
// import axios from "axios";

// const api = axios.create({
//   //|| ,'http://localhost:3000/api'
//   baseURL: process.env.NEXT_PUBLIC_API_URL ,
//   withCredentials: false, // <--- CHANGED (no cookies)
// });

// // Request interceptor to add Authorization header
// api.interceptors.request.use(cfg => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('auth_token');
//     if (token && cfg.headers) {
//       cfg.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   console.log(
//     '[API Request]',
//     cfg.method?.toUpperCase(),
//     cfg.baseURL + cfg.url,
//     'Auth header:',
//     cfg.headers?.Authorization,
//     'Cookies:',
//     document.cookie
//   );
//   return cfg;
// });

// // Response interceptor to handle 401 Unauthorized
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       console.warn('[API] 401 Unauthorized - clearing auth token');
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('auth_token');
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const updateMyOwnerProfile = (data: UpdateGymOwnerDto) => api.patch("/gym-owners/me", data);
// export const updateMyInstructorProfile = (data: UpdateInstructorDto) => api.patch("/instructors/me", data);

// export default api;
// export { api };
