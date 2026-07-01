import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as reviewAPI from './reviewAPI'
import toast from 'react-hot-toast'

export const getProductReviews = createAsyncThunk(
  'review/getProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await reviewAPI.fetchProductReviews(productId)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load reviews'
      )
    }
  }
)

export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, rating, comment }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await reviewAPI.postReview(productId, { rating, comment })
      await dispatch(getProductReviews(productId))
      toast.success('Review posted')
      return data.review
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to post review'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ id, productId, rating, comment }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await reviewAPI.patchReview(id, { rating, comment })
      await dispatch(getProductReviews(productId))
      toast.success('Review updated')
      return data.review
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update review'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async ({ id, productId }, { dispatch, rejectWithValue }) => {
    try {
      await reviewAPI.removeReviewAPI(id)
      await dispatch(getProductReviews(productId))
      toast.success('Review deleted')
      return id
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete review'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  items: [],
  averageRating: 0,
  totalReviews: 0,
  status: 'idle',
  actionStatus: 'idle',
  error: null,
}

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.items = []
      state.averageRating = 0
      state.totalReviews = 0
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.reviews
        state.averageRating = action.payload.averageRating
        state.totalReviews = action.payload.totalReviews
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(createReview.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(createReview.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
      })
      .addCase(createReview.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload
      })

      .addCase(updateReview.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload
      })

      .addCase(deleteReview.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearReviews } = reviewSlice.actions
export default reviewSlice.reducer