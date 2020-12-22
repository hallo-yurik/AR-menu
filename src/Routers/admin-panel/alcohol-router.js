const express = require("express");
const router = express.Router();
const AlcoholModel = require("../../models/AlcoholModel");

router.get("/", async (req, res, next) => {
    const alcohol = await AlcoholModel.find();
    res.json({title: "hot drinks", alcohol});
});

router.post("/", async (req, res, next) => {

    const alcohol = new AlcoholModel({
        name: req.body.name,
        volume: req.body.volume,
        price: req.body.price
    })

    try {
        const alcoholPost = await alcohol.save()
        res.json(alcoholPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const update = {...req.body};

    const AlcoholModelPatch = await AlcoholModel.findOneAndUpdate(filter, update, {
        new: true,
        useFindAndModify: true
    });
    res.json(AlcoholModelPatch);

});

module.exports = router;