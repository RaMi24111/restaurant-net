import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  tableNo: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Empty', 'Occupied'],
    default: 'Empty',
  },
  qrCode: {
    type: String, // Data URL or string content for QR
  },
  capacity: {
    type: Number,
    default: 4,
  }
}, { timestamps: true });

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
