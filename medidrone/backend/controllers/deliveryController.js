const Delivery = require('../models/Delivery');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
const getDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: delivery
  });
});

// @desc    Create delivery
// @route   POST /api/deliveries
// @access  Private/Admin/Operator
const createDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.create(req.body);

  res.status(201).json({
    success: true,
    data: delivery
  });
});

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private/Admin/Operator
const updateDelivery = asyncHandler(async (req, res, next) => {
  let delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404));
  }

  delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: delivery
  });
});

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private/Admin
const deleteDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse(`Delivery not found with id of ${req.params.id}`, 404));
  }

  await delivery.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery
};
