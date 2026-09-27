const mongoose = require('mongoose');

// Simple counter collection used to hand out sequential numbers for EmailAddress.seq
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return result.value;
}

module.exports = { Counter, getNextSequence };
