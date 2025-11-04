const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'hospital' ? { hospitalId: req.user.id } : {};
    const deliveries = await Delivery.find(query).populate('drone').sort('-createdAt');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { from, to, type, weight, priority } = req.body;

    // Validate required fields
    if (!from || !to || !type || !weight || !priority) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: { received: req.body }
      });
    }

    // Format weight properly
    const weightValue = weight.toString().replace('kg', '');
    if (isNaN(parseFloat(weightValue)) || parseFloat(weightValue) <= 0) {
      return res.status(400).json({
        message: 'Invalid weight value',
        details: { weight }
      });
    }

    const deliveryId = `DEL${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const deliveryData = {
      ...req.body,
      deliveryId,
      from: req.body.from.trim(),
      to: req.body.to.trim(),
      weight: `${parseFloat(req.body.weight)}kg`,
      status: req.user.role === 'admin' ? 'requested' : 'pending_approval',
      hospitalId: req.user.role === 'hospital' ? req.user.id : req.body.hospitalId
    };

    // Check for existing delivery with same data
    const existingDelivery = await Delivery.findOne({
      from: deliveryData.from,
      to: deliveryData.to,
      createdAt: { 
        $gt: new Date(Date.now() - 1000) // Within last second
      }
    });

    if (existingDelivery) {
      return res.status(200).json(existingDelivery);
    }

    const delivery = new Delivery(deliveryData);
    await delivery.save();

    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('drone')
      .populate('hospitalId');

    req.io.emit('delivery_update', { 
      type: 'new', 
      delivery: populatedDelivery 
    });
    
    res.status(201).json(populatedDelivery);
  } catch (error) {
    console.error('Delivery creation error:', error);

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate delivery ID. Please try again.',
        error: 'DUPLICATE_KEY'
      });
    }

    res.status(400).json({
      message: error.message || 'Failed to create delivery',
      details: error.errors || {}
    });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = req.body.status;
    if (req.body.status === 'approved' || req.body.status === 'rejected') {
      req.io.emit('delivery_approval', { id: delivery._id, status: req.body.status });
    }

    await delivery.save();
    req.io.emit('delivery_update', { type: 'update', delivery });
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
