const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("menu");
    next();
});

module.exports = router;