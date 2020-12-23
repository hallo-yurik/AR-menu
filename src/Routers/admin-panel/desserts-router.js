const express = require("express");
const router = express.Router();
const formidable = require('formidable');
const path = require("path");
const fs = require('fs');
const url = require('url');
const DessertModel = require("../../models/DessertModel");


router.get("/", async (req, res, next) => {
    const desserts = await DessertModel.find();

    console.log(req.body);

    res.send(`

    <h2>With <code>"express"</code> npm package</h2>
    <form id="myForm" action="/admin/desserts" enctype="multipart/form-data" method="post">
      
      <div>Name: <input name="name" type="text"/></div>
      <div>Ingredients: <input name="ingredients" type="text" /></div>
      <div>Ingredients: <input name="ingredients" type="text" /></div>
      <div>Price: <input type="text" name="price" /></div>
      
      <div>Image: <input type="file" name="dessert_image"/></div>
      <div>Model: <input type="file" name="dessert_model" /></div>
      
      <input type="submit" value="Upload"/>
    </form>
    
    <script>
        let myForm = document.getElementById("myForm");
        myForm.onsubmit = async (e) => {
            e.preventDefault()
            
            let myFormData = new FormData(myForm);
            
            // console.log(myFormData.getAll("ingredients"));
            myFormData.set('ingredients', myFormData.getAll("ingredients"));
            
            let response = await fetch('/admin/desserts', {
                method: 'POST',
                body: myFormData
            });
           
            // console.log(new FormData(myForm));     
            // 
            let result = await response.json();
            
            console.log(result);
           
        }
    
    
    </script>
  `);

    // console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
    // res.json({title: "hot drinks", desserts});
});

router.post("/", async (req, res, next) => {

    // console.log(res);

    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, "../../Temp"),
        keepExtensions: true
    });

    // const dessert = new DessertModel({
    //     name: req.body.name,
    //     ingredients: req.body.ingredients,
    //     price: req.body.price
    // })


    try {

        const errors = []
        // let newFiles;
        // let newFields;

        // console.log(form.parse);

        let newFormData = await new Promise((res, rej) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    rej(err)
                }

                console.log(1)
                res({fields: fields, files: files})
            });
        })

        // let newFiles = await new Promise((res, rej) => {
        //     form.parse(req, (err, fields, files) => {
        //         if (err) {
        //             rej(err)
        //         }
        //         console.log(2)
        //         res(files)
        //     });
        // });


        console.log(3);

        //validation
        if (!newFormData.files.dessert_image.size) {
            errors.push("please attach .png image of dessert")
        }

        if (path.extname(newFormData.files.dessert_image.path) !== '.png') {
            errors.push("image should be with .png extension")
        }

        if (!newFormData.files.dessert_model.size) {
            errors.push("please attach .usdz model of dessert")
        }

        if (path.extname(newFormData.files.dessert_model.path) !== '.usdz') {
            errors.push("model should be with .usdz extension")
        }

        let ingredients = newFormData.fields.ingredients.split(",");
        let clearIngredients = ingredients.filter((ingredient) => ingredient !== "");

        if (!clearIngredients.length) {
            errors.push("please attach ingredients of dessert")
        }

        if (!newFormData.fields.name) {
            errors.push("please attach name of dessert")
        }

        if (!newFormData.fields.price.length) {
            errors.push("please attach price of dessert")
        } else if (!isNaN(newFormData.fields.price)) {
            if (newFormData.fields.price <= 0) {
                errors.push("price can not be 0 or less")
            }

        } else {
            errors.push("price should be a number value")
        }

        console.log(newFormData.fields, newFormData.files);

        if (errors.length) {
            //there are errors
            await fs.unlink(newFormData.files.dessert_image.path, err => console.log(err))
            await fs.unlink(newFormData.files.dessert_model.path, err => console.log(err))

            res.json(errors)
        } else {
            //everything is correct!

            const dessert = new DessertModel({

            })

            dessert.name = newFormData.fields.name
            dessert.ingredients = clearIngredients
            dessert.price = newFormData.fields.price
            dessert.ar = `${req.protocol}://${req.get('host')}/viewer/${dessert._id}.usdz`
            dessert.image = `${req.protocol}://${req.get('host')}/images/${dessert._id}.png`

            await fs.rename(newFormData.files.dessert_model.path, path.join(__dirname, `../../3D-Models/${dessert._id}.usdz`), (err) => {
                if (err) console.log('ERROR: ' + err);
            })

            await fs.rename(newFormData.files.dessert_image.path, path.join(__dirname, `../../DessertsImages/${dessert._id}.png`), (err) => {
                if (err) console.log('ERROR: ' + err);
            })
            //
            const dessertPost = await dessert.save()
            res.json(dessertPost)

            //everything is clear

            // res.json({message: "new dessert created"});
        }


    } catch (err) {
        console.log(err)
        res.send({
            message: err
        })
    }


});

router.patch("/:id", async (req, res, next) => {

    const filter = {_id: req.params.id};
    const {name, ingredients, image, ar, price} = {...req.body};

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