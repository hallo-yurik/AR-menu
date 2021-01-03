const express = require("express");
const router = express.Router();
const passport = require("passport");

const passportAuthenticate = passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/",
    failureFlash: true

})

router.post("/", passportAuthenticate);

router.get("/", (req, res, next) => {
    res.send("hello")
});

module.exports = router;