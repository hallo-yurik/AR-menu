const express = require("express");
const router = express.Router();
const AlcoholModel = require("../../models/AlcoholModel");
const validate = require("../../utils/validators/alcohol-validation");

router.get("/", async (req, res, next) => {

    //   res.send(`
    //
    //   <h2>With <code>"express"</code> npm package</h2>
    //   <form id="myForm" action="/admin/alcohol" enctype="application/x-www-form-urlencoded" method="post">
    //
    //     <div>Name: <input name="name" type="text"/></div>
    //     <div>Volume: <input name="volume" type="text" /></div>
    //     <div>Price: <input type="text" name="price" /></div>
    //
    //     <input type="submit" value="Upload"/>
    //   </form>
    //
    //
    // `);

    try {
        const alcohol = await AlcoholModel.find();
        res.status(200).json({title: "alcohol", alcohol});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }

});

router.get("/:id", async (req, res, next) => {
    try {
        const alcohol = await AlcoholModel.findById(req.params.id);
        if (alcohol) {
            res.status(200).json(alcohol)
        } else {
            res.status(400).json({message: ["there is no such alcohol"]})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }
});

router.post("/", async (req, res, next) => {
    try {
        const sameAlcohol = await AlcoholModel.find({
            name: req.body.name,
            volume: req.body.volume,
            price: req.body.price
        })

        if (sameAlcohol.length) {
            res.status(400).json({message: ["this alcohol already exists"]})
        } else {
            const alcohol = new AlcoholModel({
                name: req.body.name,
                volume: req.body.volume,
                price: req.body.price
            })

            const errors = validate(req.body, "alcohol")

            if (errors.length) {
                res.status(400).json({message: errors})
            } else {
                const alcoholPost = await alcohol.save()
                res.status(200).json(alcoholPost)
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const update = req.body;
    // console.log(...req.body)
    try {
        const errors = validate(req.body, "alcohol")

        if (errors.length) {
            res.status(400).json({message: errors})
        } else {

            const AlcoholDocument = await AlcoholModel.findById(req.params.id);

            let sameName = AlcoholDocument.name === req.body.name
            let sameVolume = AlcoholDocument.volume === +req.body.volume
            let samePrice = AlcoholDocument.price === +req.body.price

            if (sameName && sameVolume && samePrice) {
                res.status(400).json({message: ["nothing has changed"]});
            } else {
                const AlcoholModelPatch = await AlcoholModel.findOneAndUpdate(filter, update, {
                    new: true,
                    useFindAndModify: false
                });
                // AlcoholDocument.updateOne(update);
                res.status(200).json(AlcoholModelPatch);
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }

});

router.delete("/:id", async (req, res, next) => {
    try {
        const alcoholToDelete = await AlcoholModel.findById(req.params.id)
        if (alcoholToDelete) {

            await alcoholToDelete.deleteOne()
            res.status(200).json({message: "alcohol was deleted", alcoholToDelete})
        } else {
            res.status(400).json({message: ["there is no such alcohol"]});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }
});

module.exports = router;