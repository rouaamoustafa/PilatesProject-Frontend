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





// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     //|| 'http://localhost:3000/api'
//     baseUrl: process.env.NEXT_PUBLIC_API_URL ,
//     prepareHeaders: (headers) => {
//       if (typeof window !== 'undefined') {
//         const token = localStorage.getItem('auth_token');
//         if (token) {
//           headers.set('Authorization', `Bearer ${token}`);
//         }
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Cart'],
//   endpoints: () => ({}),
// });
// // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// // export const apiSlice = createApi({
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
// //     credentials: 'include',
// //   }),
// //   tagTypes: ['Cart'],
// //   endpoints: () => ({}),
// // })
// // src/store/api/apiSlice.ts