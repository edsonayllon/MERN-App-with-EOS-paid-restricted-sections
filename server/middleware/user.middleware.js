const passport = require('passport');
const User = require('../models/user.model');

module.exports.jwt = function (req, res, next) {
  passport.authenticate('jwt', { session : false }, async (err, payload) =>{
    req._id = payload._id;
    if (payload) next();
  }) (req, res, next)
}


module.exports.checkPremium = function (req, res, next) {
  passport.authenticate('jwt', { session : false }, async (err, payload) =>{
    req._id = payload._id;
    try {
      const user = await User.findOne({'_id': payload._id});
      const access = user.restrictedAccess;
      if (access) next();
      else res.status(403).json(`Register for restricted content in user settings`)
    } catch (err) {
      console.log(err);
      res.status(403).json(`Register for restricted content in user settings`);
    }
  }) (req, res, next)
}
