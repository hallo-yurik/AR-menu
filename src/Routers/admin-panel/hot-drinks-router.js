const express = require("express");
const router = express.Router();
const HotDrinksModel = require("../../models/HotDrinksModel");
const validate = require("../../utils/validators/alcohol-validation");

// router.get("/", async (req, res, next) => {
//     const hotDrinks = await HotDrinksModel.find()
//     res.json({title: "hot drinks", hot_drinks : hotDrinks});
// });

router.get("/", async (req, res, next) => {
    try {
        const hotDrinks = await HotDrinksModel.find();
        res.status(200).json({title: "hot drinks", hotDrinks});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }

});

router.get("/:id", async (req, res, next) => {
    try {
        const hotDrink = await HotDrinksModel.findById(req.params.id);
        if (hotDrink) {
            res.status(200).json(hotDrink)
        } else {
            res.status(400).json({message: "there is no such hot drink"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }
});

router.post("/", async (req, res, next) => {
    try {

        const errors = validate(req.body, "hot drink")

        if (!errors.length) {
            const sameHotDrink = await HotDrinksModel.find({
                name: req.body.name,
                volume: req.body.volume,
                price: req.body.price
            })

            if (sameHotDrink.length) {
                res.status(400).json({message: ["this hot drink already exists"]})
            } else {
                const hotDrink = new HotDrinksModel({
                    name: req.body.name,
                    volume: req.body.volume,
                    price: req.body.price
                })

                const errors = validate(req.body, "hot drink")

                if (errors.length) {
                    res.status(400).json({message: errors})
                } else {
                    const hotDrinkPost = await hotDrink.save()
                    res.status(200).json(hotDrinkPost)
                }
            }
        } else {
            res.status(400).json({message: errors})
        }


    } catch (err) {
        res.status(500).json({message: ["internal server error"]})
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const update = req.body;

    try {
        const errors = validate(req.body, "hot drink")

        if (errors.length) {
            res.status(400).json({message: errors})
        } else {

            const HotDrinkDocument = await HotDrinksModel.findById(req.params.id);

            let sameName = HotDrinkDocument.name === req.body.name
            let sameVolume = HotDrinkDocument.volume === +req.body.volume
            let samePrice = HotDrinkDocument.price === +req.body.price

            if (sameName && sameVolume && samePrice) {
                res.status(400).json({message: ["nothing has changed"]});
            } else {
                const HotDrinkModelPatch = await HotDrinksModel.findOneAndUpdate(filter, update, {
                    new: true,
                    useFindAndModify: false
                });

                res.status(200).json(HotDrinkModelPatch);
            }
        }

    } catch (err) {
        res.status(500).json({message: ["internal server error"]})
    }

});

router.delete("/:id", async (req, res, next) => {
    try {
        const hotDrinkToDelete = await HotDrinksModel.findById(req.params.id)
        if (hotDrinkToDelete) {
            await hotDrinkToDelete.deleteOne();
            res.status(200).json({message: `${hotDrinkToDelete.name} was deleted`, hotDrinkToDelete})
        } else {
            res.status(400).json({message: "there is no such hot drink"});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 500})
    }
});

module.exports = router;