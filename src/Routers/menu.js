const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

router.get("/", async (req, res, next) => {

    const menu = await Dish.find();
    req.json(menu)

    res.send("menu");
    next();
});

router.post("/", async (req, res, next) => {
    const dish = new Dish({
        title: req.body.title
    });

    try {
        const dishPost = await dish.save()
        res.json(dishPost)
    } catch (err) {
        res.json({
            message: err
        })
    }


});

module.exports = router;