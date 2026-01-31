import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['billing', 'serving'],
    required: [true, 'Please specify a role.'],
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
