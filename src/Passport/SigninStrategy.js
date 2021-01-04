const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel")
const bcrypt = require('bcryptjs');

const SignInStrategy = new LocalStrategy({}, async (username, password, done) => {

    try{
        const user = await User.findOne({username})

        if (!user) {
            return done("Username or password is wrong")
        }

        const isSamePassword = await bcrypt.compare(password, user.password)

        if (!isSamePassword) {
            return done("Username or password is wrong");
        }

        if (!user.verified) {
            return done("Username isn`t verified, please contact admin");
        }

        //logging in is successful
        const objUser = user.toObject()
        delete objUser.password;
        objUser.isAuthenticated = true;

        console.log(objUser)
        return done(null, objUser)

    } catch (err) {
        return done(500, null);
    }
})

module.exports = SignInStrategy