import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
)

// one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// auto-update product average rating after save
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    })
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product)
})

reviewSchema.post('deleteOne', { document: true }, function () {
  this.constructor.calcAverageRating(this.product)
})

const Review = mongoose.model('Review', reviewSchema)

export default Review