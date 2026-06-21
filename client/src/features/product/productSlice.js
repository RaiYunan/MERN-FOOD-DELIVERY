import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productAPI from './productAPI'

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.fetchAllProducts()
      return data.products
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load menu'
      return rejectWithValue(message)
    }
  }
)

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.fetchProductById(id)
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || 'Item not found'
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  items: [],
  selected: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selected = null
      state.selectedStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(getProductById.pending, (state) => {
        state.selectedStatus = 'loading'
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer