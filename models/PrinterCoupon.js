const mongoose = require('mongoose');

const printerCouponSchema = new mongoose.Schema({
  printerIPCoupon: {
    type: String,
    required: true,
  },
  printerPortCoupon: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PrinterCoupon', printerCouponSchema);