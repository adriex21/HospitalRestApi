const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Employee = require('../models/Employee');

const jwtOptions = {
  secretOrKey: "secret",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};


const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
  };
  

const jwtVerify = async (payload, done) => {
  try {
    console.log(payload);
    const employee = await Employee.findOne({_id:payload.sub});
    console.log(employee);
    if (!employee) {
      return done(null, false);
    }
    done(null, employee);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};