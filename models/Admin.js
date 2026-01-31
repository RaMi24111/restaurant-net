import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the admin.'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    unique: true,
  },
  restaurantName: {
    type: String,
    required: [true, 'Please provide the restaurant name.'],
  },
  restaurantAddress: {
    type: String,
    required: [true, 'Please provide the restaurant address.'],
  },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
