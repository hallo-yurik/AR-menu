const passport = require("passport");
const User = require("../models/UserModel")

//our strategies
const SignInStrategy = require("./SigninStrategy");

//passport middlewares
passport.use("local-sign-in", SignInStrategy);

passport.serializeUser((user, done) => {


    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {

    try {
        const user = await User.findById(id);
        const userObj = user.toObject();
        delete userObj.password;
        userObj.isAuthenticated = true;

        done(null, userObj);

    } catch (err) {
        done(err);
    }

});

module.exports = passport;