import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import * as orderAPI from './orderAPI'
import { clearCartLocal } from '@/features/cart/cartSlice'

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await orderAPI.placeOrderAPI(orderData)
      dispatch(clearCartLocal())
      toast.success('Order placed successfully!')
      return data.order
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to place order'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.fetchMyOrders()
      return data.orders
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.cancelOrderAPI(id, reason)
      toast.success('Order cancelled')
      return data.order
    } catch (err) {
      const message = err.response?.data?.message || 'Cannot cancel order'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  placeStatus: 'idle',
  error: null,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
      state.placeStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placeStatus = 'loading'
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeStatus = 'succeeded'
        state.currentOrder = action.payload
        state.orders.unshift(action.payload)
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeStatus = 'failed'
        state.error = action.payload
      })

      .addCase(getMyOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        console.log('ORDER SAMPLE:', JSON.stringify(action.payload[0], null, 2))
        state.status = 'succeeded'
        state.orders = action.payload
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(
          (o) => o._id === action.payload._id
        )
        if (idx !== -1) state.orders[idx] = action.payload
      })
  },
})

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer