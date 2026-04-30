const express = require('express');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for assignment dropdowns)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
