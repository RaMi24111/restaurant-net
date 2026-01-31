import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this item.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  description: {
    type: String,
  },
  image: {
    type: String, // URL or path to image
  },
  category: {
    type: String,
    default: 'Main Course',
  },
  available: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
