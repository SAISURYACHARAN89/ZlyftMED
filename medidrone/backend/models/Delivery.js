const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    unique: true,
    default: () => `DEL${Date.now().toString(36).toUpperCase()}`
  },
  from: { 
    type: String, 
    required: [true, 'Pickup location is required'],
    trim: true 
  },
  to: { 
    type: String, 
    required: [true, 'Destination is required'],
    trim: true 
  },
  type: { 
    type: String, 
    required: [true, 'Delivery type is required'],
    enum: ['medicine', 'blood-sample', 'blood-units', 'emergency-kit']
  },
  weight: { 
    type: String, 
    required: [true, 'Weight is required'],
    validate: {
      validator: function(v) {
        // Allow both "5kg" format and numeric values
        if (typeof v === 'number') {
          return v > 0;
        }
        const match = v.match(/^(\d+(\.\d+)?)(kg)?$/);
        return match && parseFloat(match[1]) > 0;
      },
      message: props => `${props.value} is not a valid weight! Use a positive number optionally followed by 'kg'`
    }
  },
  priority: { 
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Priority is required']
  },
  status: { 
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'requested', 'dispatched', 'in-flight', 'delivered'],
    default: 'pending_approval'
  },
  drone: { type: mongoose.Schema.Types.ObjectId, ref: 'Drone' },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eta: { type: String, default: '-' },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware for weight formatting
deliverySchema.pre('save', function(next) {
  if (this.isModified('weight')) {
    const weightValue = this.weight.toString().replace('kg', '');
    this.weight = `${parseFloat(weightValue)}kg`;
  }
  next();
});

// Remove old indexes that might cause conflicts
mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.db.collection('deliveries').dropIndex('deliveryId_1');
  } catch (err) {
    // Index might not exist, ignore error
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);