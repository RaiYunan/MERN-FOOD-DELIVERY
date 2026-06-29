import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authAPI from './authAPI'
import toast from 'react-hot-toast'

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.registerUser(formData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.loginUser(formData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.getMe()
      return data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.forgotPasswordAPI(email)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP')
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.verifyOTPAPI(payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid OTP')
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.resetPasswordAPI(payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset password')
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
        toast.success('Account created successfully')
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        toast.error(action.payload)
      })

      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
        toast.success(`Welcome back, ${action.payload.user.name}`)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        toast.error(action.payload)
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })

      .addCase(forgotPassword.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(forgotPassword.fulfilled, (state) => { state.status = 'succeeded' })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(verifyOTP.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(verifyOTP.fulfilled, (state) => { state.status = 'succeeded' })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(resetPassword.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(resetPassword.fulfilled, (state) => { state.status = 'succeeded' })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer