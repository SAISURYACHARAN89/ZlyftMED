const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special admin check
    if (email === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        const token = jwt.sign(
          { email, role: 'admin' },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          token,
          user: { email, role: 'admin' }
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Regular hospital user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'hospital' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: 'hospital',
        hospitalName: user.hospitalName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, hospitalName } = req.body;

    if (!email || !password || !hospitalName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (email === ADMIN_EMAIL) {
      return res.status(400).json({ message: 'This email is reserved' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      hospitalName,
      role: 'hospital'
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;
