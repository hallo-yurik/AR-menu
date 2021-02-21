const express = require("express");
const router = express.Router();
const formidable = require('formidable');
const path = require("path");
const fs = require('fs');
const url = require('url');
const DessertModel = require("../../models/DessertModel");
const {validate, clearFolder} = require("../../utils/validators/dessert-validation");

router.get("/", async (req, res, next) => {

    // console.log(req.session)

    try {


        const desserts = await DessertModel.find();

        // console.log("send")

        // res.json(desserts)
        //

        //   res.send(`
        //
        //   <h2>With <code>"express"</code> npm package</h2>
        //   <form id="myForm" action="/admin/desserts" enctype="multipart/form-data" method="post">
        //
        //     <div>Name: <input name="name" type="text"/></div>
        //     <div>Ingredients: <input name="ingredients" type="text" /></div>
        //     <div>Ingredients: <input name="ingredients" type="text" /></div>
        //     <div>Price: <input type="text" name="price" /></div>
        //
        //     <div>Image: <input type="file" name="dessert_image"/></div>
        //     <div>Model: <input type="file" name="dessert_model" /></div>
        //
        //     <input type="submit" value="Upload"/>
        //   </form>
        //
        //   <script>
        //       let myForm = document.getElementById("myForm");
        //       myForm.onsubmit = async (e) => {
        //           e.preventDefault()
        //
        //           let myFormData = new FormData(myForm);
        //
        //           // console.log(myFormData.getAll("ingredients"));
        //           myFormData.set('ingredients', myFormData.getAll("ingredients"));
        //
        //           let response = await fetch('/admin/desserts', {
        //               method: 'POST',
        //               body: myFormData
        //           });
        //
        //           // console.log(new FormData(myForm));
        //           //
        //           let result = await response.json();
        //
        //           console.log(result);
        //
        //       }
        //
        //
        //   </script>
        // `);

        //   res.send(`
        //
        //   <h2>With <code>"express"</code> npm package</h2>
        //   <form id="myForm" action="/admin/desserts" enctype="multipart/form-data">
        //
        //     <div>Name: <input name="name" type="text"/></div>
        //     <div>Ingredients: <input name="ingredients" type="text" /></div>
        //     <div>Ingredients: <input name="ingredients" type="text" /></div>
        //     <div>Price: <input type="text" name="price" /></div>
        //
        //     <div>Image: <input type="file" name="dessert_image"/></div>
        //     <div>Model: <input type="file" name="dessert_model" /></div>
        //
        //     <input type="submit" value="Upload"/>
        //   </form>
        //
        //   <script>
        //       let myForm = document.getElementById("myForm");
        //       myForm.onsubmit = async (e) => {
        //           e.preventDefault()
        //
        //           let myFormData = new FormData(myForm);
        //
        //           // console.log(myFormData.getAll("ingredients"));
        //           myFormData.set('ingredients', myFormData.getAll("ingredients"));
        //
        //           let response = await fetch('/admin/desserts/5fe49b9ed5a4f93b34fa718a', {
        //               method: 'PATCH',
        //               body: myFormData
        //           });
        //
        //           // console.log(new FormData(myForm));
        //           //
        //           let result = await response.json();
        //
        //           console.log(result);
        //
        //       }
        //
        //
        //   </script>
        // `);


        // console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
        res.json({title: "desserts", desserts});
    } catch (err) {
        res.status(500).json({message: ["internal server error"]})
    }
});

router.get("/:id", async (req, res, next) => {

    try {
        const dessert = await DessertModel.findById(req.params.id);
        if (dessert) {
            res.status(200).json(dessert)
        } else {
            res.status(400).json({message: ["there is no such dessert"]})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["internal server error"]})
    }

    // const dessert = await DessertModel.findById(req.params.id);
    //
    // res.json(dessert);
});

router.post("/", async (req, res, next) => {

    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, "../../Temp"),
        keepExtensions: true
    });

    try {

        let newFormData = await new Promise((res, rej) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    rej(err)
                }

                res({fields: fields, files: files})
            });
        })

        const sameDessert = await DessertModel.find({
            name: newFormData.fields.name,
            price: newFormData.fields.price
        })

        if (sameDessert.length) {
            await fs.unlink(newFormData.files.dessert_image.path, err => console.log(err))
            await fs.unlink(newFormData.files.dessert_model.path, err => console.log(err))
            res.status(400).json({message: ["this dessert already exists"]})
        } else {
            const {errors, clearIngredients} = validate(newFormData)

            if (errors.length) {
                //there are errors
                await fs.unlink(newFormData.files.dessert_image.path, err => console.log(err))
                await fs.unlink(newFormData.files.dessert_model.path, err => console.log(err))

                res.status(400).json(errors)
            } else {
                //everything is correct!
                const dessert = new DessertModel({})

                dessert.name = newFormData.fields.name
                dessert.ingredients = clearIngredients
                dessert.price = newFormData.fields.price
                dessert.ar = `${req.protocol}://localhost:8000/viewer/${dessert._id}.usdz`
                dessert.image = `${req.protocol}://localhost:8000/images/${dessert._id}.png`

                // dessert.ar = `${req.protocol}://${req.get('host')}/viewer/${dessert._id}.usdz`
                // dessert.image = `${req.protocol}://${req.get('host')}/images/${dessert._id}.png`

                await fs.rename(newFormData.files.dessert_model.path, path.join(__dirname, `../../3D-Models/${dessert._id}.usdz`), (err) => {
                    if (err) console.log('ERROR: ' + err);
                })

                await fs.rename(newFormData.files.dessert_image.path, path.join(__dirname, `../../DessertsImages/${dessert._id}.png`), (err) => {
                    if (err) console.log('ERROR: ' + err);
                })


                const dessertPost = await dessert.save()
                // console.log(dessertPost)
                res.status(200).json(dessertPost)
            }
        }

    } catch (err) {
        await clearFolder(path.join(__dirname, "../../Temp"));
        res.status(500).json({message: ["there is some problem with validation"]})
    }

});

router.patch("/:id", async (req, res, next) => {

    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, "../../Temp"),
        keepExtensions: true
    });

    try {
        let newFormData = await new Promise((res, rej) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    rej(err)
                }

                res({fields: fields, files: files})
            });
        })

        const changeableDessert = await DessertModel.findById(req.params.id);

        if (changeableDessert) {
            let ingredients = newFormData.fields.ingredients.split(",");
            let clearIngredients = ingredients.filter((ingredient) => ingredient !== "");

            let sameName = newFormData.fields.name === changeableDessert.name;
            let samePrice = newFormData.fields.price === changeableDessert.price.toString();

            let sameIngredients = true;

            if (clearIngredients.length === changeableDessert.ingredients.length) {
                clearIngredients.forEach((ingredient, index) => {
                    if (ingredient !== changeableDessert.ingredients[index]) {
                        sameIngredients = false;
                    }
                });
            } else {
                sameIngredients = false;
            }

            let sameImage;
            let imageExists = fs.existsSync(path.join(__dirname, `../../DessertsImages/${changeableDessert._id}.png`))

            if (imageExists) {
                let currentImageFile = fs.statSync(path.join(__dirname, `../../DessertsImages/${changeableDessert._id}.png`))
                let currentImageSize = currentImageFile.size;
                sameImage = currentImageSize === newFormData.files.dessert_image.size;
            }

            let sameModel;
            let modelExists = fs.existsSync(path.join(__dirname, `../../3D-Models/${changeableDessert._id}.usdz`))

            if (modelExists) {
                let currentModelFile = fs.statSync(path.join(__dirname, `../../3D-Models/${changeableDessert._id}.usdz`))
                let currentModelSize = currentModelFile.size;
                sameModel = currentModelSize === newFormData.files.dessert_model.size;
            }

            if (sameName && samePrice && sameIngredients && sameImage && sameModel) {
                await clearFolder(path.join(__dirname, "../../Temp"));
                res.status(400).json({message: ["nothing has changed"]})
            } else {

                const {errors, clearIngredients} = validate(newFormData)

                if (errors.length) {
                    await fs.unlink(newFormData.files.dessert_image.path, err => console.log(err))
                    await fs.unlink(newFormData.files.dessert_model.path, err => console.log(err))
                    res.status(400).json({message: errors});
                } else {

                    changeableDessert.name = newFormData.fields.name
                    changeableDessert.ingredients = clearIngredients
                    changeableDessert.price = newFormData.fields.price

                    // await fs.unlink(path.join(__dirname, `../../DessertsImages/${changeableDessert._id}.png`), err => console.log(err))
                    // await fs.unlink(path.join(__dirname, `../../3D-Models/${changeableDessert._id}.usdz`), err => console.log(err))

                    await fs.rename(newFormData.files.dessert_model.path, path.join(__dirname, `../../3D-Models/${changeableDessert._id}.usdz`), err => {
                        if (err) throw err
                    })
                    await fs.rename(newFormData.files.dessert_image.path, path.join(__dirname, `../../DessertsImages/${changeableDessert._id}.png`), err => {
                        if (err) throw err
                    })

                    const changedDessert = await changeableDessert.save()
                    res.status(200).json(changedDessert)

                }
            }

        } else {

            await fs.unlink(newFormData.files.dessert_image.path, err => console.log(err))
            await fs.unlink(newFormData.files.dessert_model.path, err => console.log(err))

            res.status(400).json({message: ["there is no such dessert"]})

        }

    } catch (err) {

        console.log(err)
        await clearFolder(path.join(__dirname, "../../Temp"));
        res.status(500).json({message: ["internal server error"]})
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const deletedDessert = await DessertModel.deleteOne({_id: req.params.id})

        await fs.unlink(path.join(__dirname, `../../3D-Models/${req.params.id}.usdz`), err => console.log(err))
        await fs.unlink(path.join(__dirname, `../../DessertsImages/${req.params.id}.png`), err => console.log(err))

        res.status(200).json({message: "dessert was deleted", deletedDessert})
    } catch (err) {
        res.status(500).json({message: ["internal server error"]})
    }
});

module.exports = router;