const passport = require('passport');

const checkRole = function (req, res, next) {
  passport.authenticate('jwt', { session : false }, async (err, payload) =>{
    console.log(payload);
    if (payload) next();
  }) (req, res, next)
}

module.exports = checkRole;
