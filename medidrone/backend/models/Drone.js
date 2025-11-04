const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  battery: { type: Number, default: 100 },
  status: { 
    type: String, 
    enum: ['active', 'charging', 'in-flight', 'maintenance'],
    default: 'active'
  },
  capacity: { type: String, required: true },
  lastMaintenance: { type: Date, default: Date.now },
  currentDelivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }
});

module.exports = mongoose.model('Drone', droneSchema);