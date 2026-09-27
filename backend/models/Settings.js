const mongoose = require('mongoose');

// Singleton document holding the editable default "from" address/name and default email content
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },
  fromName: { type: String, default: 'Notification' },
  fromEmail: { type: String, default: '' }, // display purposes only; actual SMTP auth uses GMAIL_USER
  defaultSubject: { type: String, default: '' },
  defaultBody: { type: String, default: '' }
});

module.exports = mongoose.model('Settings', settingsSchema);
