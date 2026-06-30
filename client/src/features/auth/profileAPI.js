import api from '@/api/axios'

export const updateProfileAPI = (formData) => api.put('/profile', formData)
export const changePasswordAPI = (data) => api.patch('/profile/change-password', data)
export const deleteAccountAPI = (password) => api.delete('/profile', { data: { password } })