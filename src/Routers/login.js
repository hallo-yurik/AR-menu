const express = require("express");
const router = express.Router();
const passport = require("../Passport/passport-main")
// const passport = require("passport");

// const passportAuthenticate = passport.authenticate("local", {
//     successRedirect: "/admin",
//     failureRedirect: "/login",
//     failureFlash: true
// })

// router.post("/", passportAuthenticate);

router.post("/signup", (req, res, next) =>{
    passport.authenticate("local-sign-up",(err, user, info) => {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }

        return res.json({message: user})

    })(req, res, next)
});

router.post("/signin", (req, res, next) => {
    passport.authenticate("local-sign-in",(err, user, info) => {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }

        return res.json({message: user})

    })(req, res, next)
});

module.exports = router;