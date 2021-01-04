const express = require("express");
const router = express.Router();
const passport = require("../Passport/passport-main")
const bcrypt = require("bcryptjs")
const User = require("../models/UserModel")

const salt = bcrypt.genSaltSync(10);

router.post("/signup", async (req, res, next) => {

    try{
        const user = await User.findOne({username: req.body.username})

        if (user) {
            return res.json({message: "User with such username already exists"} )
        }

        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User ({
            username: req.body.username,
            password: hash
        })

        const newUserDocument = await newUser.save();
        const objUser = newUserDocument.toObject()
        delete objUser.password;

        return res.json({message: "You are signed up successfully, please wait for verifying"})

    } catch (err) {
        res.json({message: 500});
    }
});

router.post("/signin", (req, res, next) => {
    passport.authenticate("local-sign-in", (err, user, info) => {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }

        //Persistent login
        req.logIn(user, (err) => {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }

            return res.json({message: user})
        })

    })(req, res, next)
});

module.exports = router;