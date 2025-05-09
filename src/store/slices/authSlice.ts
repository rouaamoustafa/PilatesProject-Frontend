import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

/* ------------- async thunk ------------- */
export const fetchCurrentUser = createAsyncThunk<User>(
  'auth/fetchCurrentUser',
  async () => {
    const res = await fetch('http://localhost:3000/auth/me', {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json() as Promise<User>
  }
)

/* ------------- slice ------------------- */
interface AuthState {
  user: User | null
  status: Status
}

const initialState: AuthState = { user: null, status: 'idle' }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null
      state.status = 'idle'
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.status = 'succeeded'
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCurrentUser.pending,   (s) => { s.status = 'loading' })
     .addCase(fetchCurrentUser.fulfilled, (s,a) => { s.status = 'succeeded'; s.user=a.payload })
     .addCase(fetchCurrentUser.rejected,  (s) => { s.status = 'failed';     s.user=null })
  },
})

export const { clearUser, setUser } = authSlice.actions
export default authSlice.reducer
