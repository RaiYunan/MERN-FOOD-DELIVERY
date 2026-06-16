import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'esewa', 'khalti', 'card'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    note: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// indexes for fast queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

const Order = mongoose.model('Order', orderSchema)

export default Order