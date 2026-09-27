const mongoose = require('mongoose');

const sendLogSchema = new mongoose.Schema({
  dateKey: { type: String, required: true }, // 'YYYY-MM-DD' in server local time, used for daily stats
  subject: { type: String, required: true },
  fromEmail: { type: String, required: true },
  fromName: { type: String, default: '' },
  rangeStart: { type: Number, required: true },
  rangeEnd: { type: Number, required: true },
  successCount: { type: Number, default: 0 },
  failCount: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now }
});

sendLogSchema.index({ dateKey: 1 });

module.exports = mongoose.model('SendLog', sendLogSchema);
