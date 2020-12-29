const express = require("express");
const router = express.Router();
const AlcoholModel = require("../../models/AlcoholModel");
const validate = require("./utils/alcohol-validation");

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


    const alcohol = await AlcoholModel.find();
    res.json({title: "alcohol", alcohol});
});

router.get("/:id", async (req, res, next) => {
    try {
        const alcohol = await AlcoholModel.findById(req.params.id);
        if (alcohol) {
            res.json(alcohol)
        } else {
            res.json({message: "there is no such alcohol"})
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
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
            res.json({message: "this alcohol already exists"})
        } else {
            const alcohol = new AlcoholModel({
                name: req.body.name,
                volume: req.body.volume,
                price: req.body.price
            })

            const errors = validate(req.body, "alcohol")

            if (errors.length) {
                res.json({
                    message: errors
                })
            } else {
                const alcoholPost = await alcohol.save()
                res.json(alcoholPost)
            }
        }
    } catch (err) {
        console.log(err)
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
        const errors = validate(req.body, "alcohol")

        if (errors.length) {
            res.json({
                message: errors
            })
        } else {

            const AlcoholDocument = await AlcoholModel.findById(req.params.id);

            let sameName = AlcoholDocument.name === req.body.name
            let sameVolume = AlcoholDocument.volume === +req.body.volume
            let samePrice = AlcoholDocument.price === +req.body.price

            if (sameName && sameVolume && samePrice) {
                res.json({message: "nothing has changed"});
            } else {
                const AlcoholModelPatch = await AlcoholModel.findOneAndUpdate(filter, update, {
                    new: true,
                    useFindAndModify: false
                });
                // AlcoholDocument.updateOne(update);
                res.json(AlcoholModelPatch);
            }
        }

    } catch (err) {
        res.json({message: 500})
    }

});

router.delete("/:id", async (req, res, next) => {
    try {
        const postToDelete = await AlcoholModel.findById(req.params.id)
        if (postToDelete) {
            const deletedPost = await postToDelete.deleteOne();
            res.json({message: "alcohol was deleted", postToDelete})
        } else {
            res.json({message: "there is no such alcohol"});
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }
});

module.exports = router;