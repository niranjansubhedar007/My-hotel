const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  printerIP: {
    type: String,
    required: true,
  },
  printerPort: {
    type: Number,
    required: true,
  },
  printerIPBOT: {
    type: String,
  },
  printerPortBOT: {
    type: Number,
  },
  printerIPBill: {
    type: String,
  },
  printerPortBill: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Printer', printerSchema);