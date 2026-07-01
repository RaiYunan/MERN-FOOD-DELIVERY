import api from '@/api/axios'

export const fetchProductReviews = (productId) =>
  api.get(`/reviews/product/${productId}`)

export const postReview = (productId, payload) =>
  api.post(`/reviews/product/${productId}`, payload)

export const patchReview = (id, payload) => api.put(`/reviews/${id}`, payload)

export const removeReviewAPI = (id) => api.delete(`/reviews/${id}`)