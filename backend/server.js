require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/emails');
const sendRoutes = require('./routes/send');
const statsRoutes = require('./routes/stats');
const settingsRoutes = require('./routes/settings');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/send', sendRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
