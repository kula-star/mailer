const express = require('express');
const SendLog = require('../models/SendLog');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/stats/daily?days=30 -> emails sent per day for the last N days
router.get('/daily', async (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);

  const results = await SendLog.aggregate([
    {
      $group: {
        _id: '$dateKey',
        emailsSent: { $sum: '$successCount' },
        emailsFailed: { $sum: '$failCount' },
        sendActions: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: days }
  ]);

  const sorted = results.sort((a, b) => (a._id < b._id ? -1 : 1));
  res.json({
    days: sorted.map(r => ({
      date: r._id,
      emailsSent: r.emailsSent,
      emailsFailed: r.emailsFailed,
      sendActions: r.sendActions
    }))
  });
});

module.exports = router;
