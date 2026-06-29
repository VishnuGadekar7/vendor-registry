require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const Vendor = require('./Vendor');
const generatePDF = require('./generatePDF');
const sendEmail = require('./emailSender');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.post('/submit', async (req, res) => {
  try {
    const formData = req.body;
    console.log('📥 Form received:', formData.vendorName);

    const vendor = new Vendor(formData);
    await vendor.save();
    console.log('💾 Saved to DB:', vendor._id);

    const pdfBuffer = await generatePDF(formData);
    console.log('📄 PDF generated');

    await sendEmail(pdfBuffer, formData);
    console.log('📧 Email sent');

    return res.status(200).json({
      success: true,
      message: 'Vendor registration submitted successfully'
    });
  } catch (err) {
    console.error('❌ Submission error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Energize Vendor Form server running on port ${PORT}`);
});
