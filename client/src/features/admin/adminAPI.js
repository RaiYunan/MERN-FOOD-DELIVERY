import api from '@/api/axios'

export const fetchAllOrdersAPI = (params) => api.get('/orders/admin/all', { params })
export const updateOrderStatusAPI = (id, status) => api.patch(`/orders/admin/${id}/status`, { status })
export const updatePaymentStatusAPI = (id, paymentStatus) => api.patch(`/orders/admin/${id}/payment`, { paymentStatus })
export const fetchOrderStatsAPI = () => api.get('/orders/admin/stats')