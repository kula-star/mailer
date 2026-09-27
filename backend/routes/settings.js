const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: 'default' });
  if (!settings) settings = await Settings.create({ key: 'default' });
  return settings;
}

// GET /api/settings -> current editable from-address / default content
router.get('/', async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

// PUT /api/settings { fromName, fromEmail, defaultSubject, defaultBody }
router.put('/', async (req, res) => {
  const { fromName, fromEmail, defaultSubject, defaultBody } = req.body;
  const settings = await getOrCreateSettings();
  if (fromName !== undefined) settings.fromName = fromName;
  if (fromEmail !== undefined) settings.fromEmail = fromEmail;
  if (defaultSubject !== undefined) settings.defaultSubject = defaultSubject;
  if (defaultBody !== undefined) settings.defaultBody = defaultBody;
  await settings.save();
  res.json(settings);
});

module.exports = router;
