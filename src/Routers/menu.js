const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

router.get("/", (req, res, next) => {
    res.send("menu");
    next();
});

module.exports = router;