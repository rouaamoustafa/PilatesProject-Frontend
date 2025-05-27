import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    //process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    baseUrl: process.env.NEXT_PUBLIC_API_URL ,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: () => ({}),
});
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
//     credentials: 'include',
//   }),
//   tagTypes: ['Cart'],
//   endpoints: () => ({}),
// })
// src/store/api/apiSlice.ts