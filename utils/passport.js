const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const secret = require('./variables').secret;
const cryptor = require('./cryptor');

module.exports = function (passport) {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      data = cryptor.dcrypt(jwt_payload.data);
      console.log(data);
      return done(null, data);
    } catch (error) {
      return done(null, false);
    }

  }));
}