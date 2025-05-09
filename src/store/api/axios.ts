import axios from 'axios'

const api = axios.create({
  baseURL: '/api',        // ← proxy through Next.js
  withCredentials: true,  // keep your cookie auth
})

export default api
