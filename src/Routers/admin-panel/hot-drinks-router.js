const express = require("express");
const router = express.Router();
const HotDrinksModel = require("../../models/HotDrinksModel");
const validate = require("./utils/alcohol-validation");

// router.get("/", async (req, res, next) => {
//     const hotDrinks = await HotDrinksModel.find()
//     res.json({title: "hot drinks", hot_drinks : hotDrinks});
// });

router.get("/", async (req, res, next) => {
    const hotDrinks = await HotDrinksModel.find();
    res.json({title: "hot drinks", hotDrinks});
});

router.get("/:id", async (req, res, next) => {
    try {
        const hotDrink = await HotDrinksModel.findById(req.params.id);
        if (hotDrink) {
            res.json(hotDrink)
        } else {
            res.json({message: "there is no such hot drink"})
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }
});

router.post("/", async (req, res, next) => {
    try {
        const sameHotDrink = await HotDrinksModel.find({
            name: req.body.name,
            volume: req.body.volume,
            price: req.body.price
        })

        console.log(sameHotDrink);

        if (sameHotDrink.length) {
            res.json({message: "this hot drink already exists"})
        } else {
            const hotDrink = new HotDrinksModel({
                name: req.body.name,
                volume: req.body.volume,
                price: req.body.price
            })

            const errors = validate(req.body, "hot drink")

            if (errors.length) {
                res.json({
                    message: errors
                })
            } else {
                const hotDrinkPost = await hotDrink.save()
                res.json(hotDrinkPost)
            }
        }
    } catch (err) {
        res.json({
            message: 500
        })
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const update = req.body;
    // console.log(...req.body)
    try {
        const errors = validate(req.body, "hot drink")

        if (errors.length) {
            res.json({
                message: errors
            })
        } else {

            const HotDrinkDocument = await HotDrinksModel.findById(req.params.id);

            let sameName = HotDrinkDocument.name === req.body.name
            let sameVolume = HotDrinkDocument.volume === +req.body.volume
            let samePrice = HotDrinkDocument.price === +req.body.price

            if (sameName && sameVolume && samePrice) {
                res.json({message: "nothing has changed"});
            } else {
                const HotDrinkModelPatch = await HotDrinksModel.findOneAndUpdate(filter, update, {
                    new: true,
                    useFindAndModify: false
                });

                res.json(HotDrinkModelPatch);
            }
        }

    } catch (err) {
        res.json({message: 500})
    }

});

router.delete("/:id", async (req, res, next) => {
    try {
        const postToDelete = await HotDrinksModel.findById(req.params.id)
        if (postToDelete) {
            await postToDelete.deleteOne();
            res.json({message: `${postToDelete.name} was deleted`, postToDelete})
        } else {
            res.json({message: "there is no such hot drink"});
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }
});

module.exports = router;
//
//
// router.post("/", async (req, res, next) => {
//
//     const hotDrink = new HotDrinksModel({
//         name: req.body.name,
//         volume: req.body.volume,
//         price: req.body.price
//     })
//
//     try {
//         const hotDrinkPost = await hotDrink.save()
//         res.json(hotDrinkPost)
//     } catch (err) {
//         res.json({
//             message: err
//         })
//     }
//
// });
//
// router.patch("/:id", async (req, res, next) => {
//
//     const filter = {_id: req.params.id};
//     const update = {...req.body};
//
//     const hotDrinkPatch = await HotDrinksModel.findOneAndUpdate(filter, update, {
//         new: true,
//         useFindAndModify: true
//     });
//     res.json(hotDrinkPatch);
//
// });
//
//
// module.exports = router;