const Drone = require('../models/Drone');

exports.getDrones = async (req, res) => {
  try {
    const drones = await Drone.find();
    res.json({
      success: true,
      count: drones.length,
      data: drones
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDrone = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    
    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    res.json({
      success: true,
      data: drone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDrone = async (req, res) => {
  try {
    const drone = await Drone.create(req.body);
    res.status(201).json({
      success: true,
      data: drone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDrone = async (req, res) => {
  try {
    const drone = await Drone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    res.json({
      success: true,
      data: drone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDrone = async (req, res) => {
  try {
    const drone = await Drone.findByIdAndDelete(req.params.id);

    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    res.json({
      success: true,
      message: 'Drone deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDroneStatus = async (req, res) => {
  try {
    const { status, battery, location } = req.body;
    const drone = await Drone.findByIdAndUpdate(
      req.params.id,
      { status, battery, location },
      { new: true }
    );

    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    const io = req.app.get('io');
    io.emit('droneStatusUpdate', drone);

    res.json({
      success: true,
      data: drone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};