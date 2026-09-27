const express = require('express');
const multer = require('multer');
const EmailAddress = require('../models/EmailAddress');
const { getNextSequence } = require('../models/Counter');
const { extractEmailsFromCsv } = require('../utils/csv');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(auth);

// GET /api/emails?page=1&limit=50  -> list (paginated), includes total count
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 50, 500);
  const [items, total] = await Promise.all([
    EmailAddress.find().sort({ seq: 1 }).skip((page - 1) * limit).limit(limit),
    EmailAddress.countDocuments()
  ]);
  res.json({ items, total, page, limit });
});

// POST /api/emails  { email }  -> add single address, checks duplication
router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'email is required' });

    const existing = await EmailAddress.findOne({ email });
    if (existing) return res.status(409).json({ message: 'This email address already exists' });

    const seq = await getNextSequence('emailAddress');
    const created = await EmailAddress.create({ email, seq, source: 'manual' });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/emails/csv  (multipart form, field name "file") -> bulk import with dedup
router.post('/csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No CSV file uploaded' });

    const csvText = req.file.buffer.toString('utf-8');
    const emails = extractEmailsFromCsv(csvText);

    if (emails.length === 0) {
      return res.status(400).json({ message: 'No valid email addresses found in the CSV' });
    }

    const existingDocs = await EmailAddress.find({ email: { $in: emails } }, { email: 1 });
    const existingSet = new Set(existingDocs.map(d => d.email));

    const toInsert = emails.filter(e => !existingSet.has(e));
    const duplicateCount = emails.length - toInsert.length;

    const docs = [];
    for (const email of toInsert) {
      const seq = await getNextSequence('emailAddress');
      docs.push({ email, seq, source: 'csv' });
    }

    let inserted = [];
    if (docs.length > 0) {
      inserted = await EmailAddress.insertMany(docs, { ordered: false });
    }

    res.json({
      totalInCsv: emails.length,
      added: inserted.length,
      duplicatesSkipped: duplicateCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/emails/:id -> remove single address
router.delete('/:id', async (req, res) => {
  const deleted = await EmailAddress.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Address not found' });
  res.json({ message: 'Deleted' });
});

// POST /api/emails/bulk-delete { ids: [] }
router.post('/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'ids array is required' });
  }
  const result = await EmailAddress.deleteMany({ _id: { $in: ids } });
  res.json({ deletedCount: result.deletedCount });
});

// GET /api/emails/check-duplicates -> report any duplicate email values (should normally be none, since unique index enforces it)
router.get('/check-duplicates', async (req, res) => {
  const dups = await EmailAddress.aggregate([
    { $group: { _id: '$email', count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  res.json({ duplicates: dups });
});

module.exports = router;
