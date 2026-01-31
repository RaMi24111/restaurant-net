import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  customerPhone: {
    type: String, // Optional, if needed for billing
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
