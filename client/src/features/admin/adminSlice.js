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

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.fetchAllUsersAPI()
      return data.users
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load users')
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.updateUserRoleAPI(id, role)
      toast.success(`Role updated to ${role}`)
      return data.user
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update role'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.toggleUserStatusAPI(id)
      toast.success(data.message)
      return data.user
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUserAPI(id)
      toast.success('User deleted')
      return id
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete user'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const fetchAllProductsAdmin = createAsyncThunk(
  'admin/fetchAllProductsAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.fetchAllProductsAdminAPI()
      return data.products
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products')
    }
  }
)

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.createProductAPI(formData)
      toast.success('Product created')
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.updateProductAPI(id, formData)
      toast.success('Product updated')
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await adminAPI.deleteProductAPI(id)
      toast.success('Product deleted')
      return id
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const toggleProductStatus = createAsyncThunk(
  'admin/toggleProductStatus',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminAPI.toggleProductStatusAPI(id)
      toast.success(data.message)
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to toggle status'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  orders: [],
  total: 0,
  page: 1,
  totalPages: 1,
  stats: null,
  statsStatus: 'idle',

  users: [],
  usersStatus: 'idle',

  products: [],
  productsStatus: 'idle',

  status: 'idle',
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.status = 'loading' })
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

      .addCase(fetchOrderStats.pending, (state) => { state.statsStatus = 'loading' })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.error = action.payload
      })

      .addCase(fetchAllUsers.pending, (state) => { state.usersStatus = 'loading' })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded'
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersStatus = 'failed'
        state.error = action.payload
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload }
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload)
      })

      .addCase(fetchAllProductsAdmin.pending, (state) => { state.productsStatus = 'loading' })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded'
        state.products = action.payload
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.productsStatus = 'failed'
        state.error = action.payload
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.products[idx] = action.payload
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload)
      })

      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.products[idx] = action.payload
      })
  },
})

export default adminSlice.reducer