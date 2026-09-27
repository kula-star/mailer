const express = require('express');
const nodemailer = require('nodemailer');
const EmailAddress = require('../models/EmailAddress');
const SendLog = require('../models/SendLog');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

// POST /api/send
// body: { subject, body (html), fromName, fromEmail, rangeStart, rangeEnd }
// rangeStart/rangeEnd refer to the 1-based "seq" position of addresses, e.g. send to the 10th..50th address added
router.post('/', async (req, res) => {
  try {
    const { subject, body, fromName, rangeStart, rangeEnd } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: 'subject and body are required' });
    }
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 1 || end < start) {
      return res.status(400).json({ message: 'rangeStart/rangeEnd must be a valid 1-based range, e.g. 1 to 50' });
    }

    const recipients = await EmailAddress.find({ seq: { $gte: start, $lte: end } }).sort({ seq: 1 });
    if (recipients.length === 0) {
      return res.status(404).json({ message: 'No addresses found in that range' });
    }

    // Note: Gmail SMTP requires the authenticated GMAIL_USER account (or a verified alias) as the
    // actual envelope sender. fromName is applied as the display name; a fully custom fromEmail
    // only works if it's set up as a "Send As" alias on the Gmail account.
    const displayFrom = `"${fromName || 'Notification'}" <${process.env.GMAIL_USER}>`;
    const transporter = buildTransporter();

    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      console.log(`Sending to ${recipient.email}...`);
      console.log(`: ${recipient}`);
      try {
        await transporter.sendMail({
          from: displayFrom,
          to: recipient.email,
          subject,
          html: body
        });
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    const log = await SendLog.create({
      dateKey: todayKey(),
      subject,
      fromEmail: process.env.GMAIL_USER,
      fromName: fromName || 'Notification',
      rangeStart: start,
      rangeEnd: end,
      successCount,
      failCount
    });

    res.json({ message: 'Send complete', successCount, failCount, total: recipients.length, log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
