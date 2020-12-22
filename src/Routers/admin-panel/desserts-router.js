const express = require("express");
const router = express.Router();
const formidable = require('formidable');
const path = require("path");
const fs = require('fs');
const url = require('url');
const DessertModel = require("../../models/DessertModel");


router.get("/", async (req, res, next) => {
    const desserts = await DessertModel.find();

  //   res.send(`
  //   <h2>With <code>"express"</code> npm package</h2>
  //   <form action="/admin/desserts" enctype="multipart/form-data" method="post">
  //     <div>AR: <input type="file" name="dessert_image" multiple="multiple" /></div>
  //     <div>AR: <input type="file" name="dessert_model" multiple="multiple" /></div>
  //     <input type="submit" value="Upload" />
  //   </form>
  // `);

    // console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
    res.json({title: "hot drinks", desserts});
});

router.post("/", async (req, res, next) => {

    const form = formidable({ multiples: true, uploadDir: path.join(__dirname, "../../3D-Models"), keepExtensions: true });

    const dessert = new DessertModel({
        name: req.body.name,
        ingredients: req.body.ingredients,
        price: req.body.price
    })

    dessert.ar = `${req.protocol}://${req.get('host')}/viewer/${dessert._id}.usdz`
    dessert.image = `${req.protocol}://${req.get('host')}/images/${dessert._id}.png`


    await form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        await fs.rename(  files.dessert_model.path, path.join(__dirname, `../../3D-Models/${dessert._id}.usdz`),(err) => {
            if ( err ) console.log('ERROR: ' + err);
        })

        await fs.rename(  files.dessert_image.path, path.join(__dirname, `../../DessertsImages/${dessert._id}.png`),(err) => {
            if ( err ) console.log('ERROR: ' + err);
        })

    });

    try {
        const dessertPost = await dessert.save()
        res.json(dessertPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const  {name, ingredients, image, ar, price} = {...req.body};

    //if image of/and ar - change file (delete previous and set new)

    const DessertModelPatch = await DessertModel.findOneAndUpdate(filter,
        {
            name: name,
            ingredients: [...ingredients],
            image: image,
            ar: ar,
            price: price
        },
        {

            new: true,
            useFindAndModify: true
        });

    res.json(DessertModelPatch);

});


module.exports = router;