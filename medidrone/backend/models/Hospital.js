const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  type: {
    type: String,
    enum: ['hospital', 'clinic', 'lab', 'pharmacy', 'blood-bank'],
    default: 'hospital'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);