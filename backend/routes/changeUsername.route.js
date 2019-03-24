const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

router.post('/', async (req, res, next) => {
  try {
    const success = await userService.changeUsername(
      req._id,
      req.body.newusername
    )
    if (success) {
      res.status(200).json({
        message: 'Username successfully updated'
      });
    } else {
      res.status(403).json({
        message: 'Username already exists'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      message: 'Username already exists'
    });
  }
})

module.exports = router;
