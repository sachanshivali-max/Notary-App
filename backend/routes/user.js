const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth, premium } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

router.use(auth);

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings/logo', premium, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const logoUrl = `data:${req.file.mimetype};base64,${b64}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { logoUrl },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
