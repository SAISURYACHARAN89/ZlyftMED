const express = require('express');
const router = express.Router();
const Drone = require('../models/Drone');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // Allow both admin and hospital users to view drones
    const drones = await Drone.find().populate('currentDelivery');
    res.json(drones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Only admin can create/update drones
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const drone = new Drone(req.body);
    await drone.save();
    req.io.emit('drone_update', { type: 'new', drone });
    res.status(201).json(drone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;