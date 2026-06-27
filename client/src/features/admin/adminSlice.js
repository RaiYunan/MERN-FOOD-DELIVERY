import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import * as adminAPI from './adminAPI'

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.fetchAllOrdersAPI(params)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.updateOrderStatusAPI(id, status)
      toast.success(`Order marked as ${status.replace(/_/g, ' ')}`)
      return data.order
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updatePaymentStatus = createAsyncThunk(
  'admin/updatePaymentStatus',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.updatePaymentStatusAPI(id, paymentStatus)
      toast.success(`Payment marked as ${paymentStatus}`)
      return data.order
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update payment'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const fetchOrderStats = createAsyncThunk(
  'admin/fetchOrderStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.fetchOrderStatsAPI()
      return data.stats
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load stats')
    }
  }
)

const initialState = {
  orders: [],
  total: 0,
  page: 1,
  totalPages: 1,
  stats: null,
  status: 'idle',
  statsStatus: 'idle',
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orders = action.payload.orders
        state.total = action.payload.total
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id)
        if (idx !== -1) state.orders[idx] = action.payload
      })

      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id)
        if (idx !== -1) state.orders[idx] = action.payload
      })

      .addCase(fetchOrderStats.pending, (state) => {
        state.statsStatus = 'loading'
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default adminSlice.reducer