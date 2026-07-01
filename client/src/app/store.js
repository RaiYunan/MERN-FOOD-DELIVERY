import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import productReducer from '@/features/product/productSlice'
import cartReducer from '@/features/cart/cartSlice'
import orderReducer from '@/features/order/orderSlice'
import adminReducer from '@/features/admin/adminSlice'
import reviewReducer from '@/features/review/reviewSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
    review: reviewReducer
  },
})