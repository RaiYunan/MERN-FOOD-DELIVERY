import api from '@/api/axios'

export const fetchAllOrdersAPI      = (params) => api.get('/admin/orders', { params })
export const updateOrderStatusAPI   = (id, status) => api.patch(`/admin/orders/${id}/status`, { status })
export const updatePaymentStatusAPI = (id, paymentStatus) => api.patch(`/admin/orders/${id}/payment`, { paymentStatus })
export const fetchOrderStatsAPI     = () => api.get('/admin/stats')

export const fetchAllUsersAPI   = () => api.get('/admin/users')
export const updateUserRoleAPI  = (id, role) => api.patch(`/admin/users/${id}/role`, { role })
export const toggleUserStatusAPI = (id) => api.patch(`/admin/users/${id}/status`)
export const deleteUserAPI      = (id) => api.delete(`/admin/users/${id}`)

export const fetchAllProductsAdminAPI = () => api.get('/admin/products')
export const createProductAPI         = (formData) => api.post('/admin/products', formData)
export const updateProductAPI         = (id, formData) => api.put(`/admin/products/${id}`, formData)
export const deleteProductAPI         = (id) => api.delete(`/admin/products/${id}`)
export const toggleProductStatusAPI   = (id) => api.patch(`/admin/products/${id}/status`)