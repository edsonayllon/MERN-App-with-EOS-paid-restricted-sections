const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ '_id': req._id });
    if (user) {
      console.log(user.username);
      res.status(200).json({
        username: user.username,
        restrictedAccess: user.restrictedAccess
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      username: 'Error finding user'
    });
  }
});

module.exports = router;
