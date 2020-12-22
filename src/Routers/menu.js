const express = require("express");
const router = express.Router();
// const Dessert = require("../models/DessertModel");

router.get("/", async (req, res, next) => {
    res.send("menu");
});

module.exports = router;