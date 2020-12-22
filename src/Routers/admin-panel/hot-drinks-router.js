const express = require("express");
const router = express.Router();
const HotDrinksModel = require("../../models/HotDrinksModel");

router.get("/", async (req, res, next) => {
    const hotDrinks = await HotDrinksModel.find()
    res.json({title: "hot drinks", hot_drinks : hotDrinks});
});

router.post("/", async (req, res, next) => {

    const hotDrink = new HotDrinksModel({
        name: req.body.name,
        volume: req.body.volume,
        price: req.body.price
    })

    try {
        const hotDrinkPost = await hotDrink.save()
        res.json(hotDrinkPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const update = {...req.body};

    const hotDrinkPatch = await HotDrinksModel.findOneAndUpdate(filter, update, {
        new: true,
        useFindAndModify: true
    });
    res.json(hotDrinkPatch);

});


module.exports = router;