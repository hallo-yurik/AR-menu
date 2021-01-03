const passport = require("passport");

//our strategies
const SignInStrategy = require("./SigninStrategy");
const SignUpStrategy = require("./SignupStrategy")

//passport middlewares
passport.use("local-sign-in", SignInStrategy);
passport.use("local-sign-up", SignUpStrategy);

module.exports = passport;