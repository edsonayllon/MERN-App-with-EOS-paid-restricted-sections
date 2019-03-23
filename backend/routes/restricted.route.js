const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.model');

router.get('/', function(req, res, next) {
  res.send(`You have access to the restricted section`);
  console.log('SUCCESS: Connected to restricted route');
});

module.exports = router;
