const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel")
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const SignUpStrategy = new LocalStrategy({},async (username, password, done) => {

    try{
        const user = await User.findOne({username})

        if (user) {
            return done("User already exists")
        }

        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User ({
            username,
            password: hash
        })

        const newUserDocument = await newUser.save();
        const objUser = newUserDocument.toObject()
        delete objUser.password;
        return done(null, objUser)

    } catch (err) {
        return done(500, null);
    }
})

module.exports = SignUpStrategy;