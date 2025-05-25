import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'
import api from '../api/axios'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User>('/auth/me')
      return data
    } catch (err: any) {
      if(err.response?.status !== 401) console.error(err);
      return rejectWithValue(
        err.response?.data?.message || 'Not authenticated'
      )
    }
  }
)

interface AuthState {
  user: User | null
  token: string | null
  status: Status
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token'): null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('auth_token', action.payload);
    },
    clearUser(state) {
      state.user = null
      state.token =null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('auth_token')
    },
    // setUser(state, action: PayloadAction<User>) {
    //   state.user = action.payload
    //   state.status = 'succeeded'
    //   state.error = null
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.error = action.payload ?? 'Fetch user failed'
        // also clear any stale token
        localStorage.removeItem('auth_token')
      })
  },
})

export const { clearUser ,setToken} = authSlice.actions
export default authSlice.reducer
