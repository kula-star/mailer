const mongoose = require('mongoose');

// Auto-incrementing sequence so addresses can be selected by a number range (n to m)
const emailAddressSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  seq: { type: Number, required: true },
  source: { type: String, default: 'manual' }, // 'manual' | 'csv'
  createdAt: { type: Date, default: Date.now }
});

emailAddressSchema.index({ seq: 1 });

module.exports = mongoose.model('EmailAddress', emailAddressSchema);
