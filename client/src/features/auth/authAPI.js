import api from '@/api/axios'

export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

export const forgotPasswordAPI = (email) => api.post('/auth/forgot-password', { email })
export const verifyOTPAPI = (data) => api.post('/auth/verify-otp', data)
export const resetPasswordAPI = (data) => api.post('/auth/reset-password', data)