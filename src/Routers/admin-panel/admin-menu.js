const express = require("express");
const router = express.Router();
const menuModel = require("../../models/MenuModel");
const DessertModel = require("./../../models/DessertModel");
const HotDrinksModel = require("./../../models/HotDrinksModel")
const AlcoholModel = require("./../../models/AlcoholModel");

router.get("/", async (req, res) => {
    try {
        const menu = await menuModel.find();
        res.json({title: "menu", menu});
    } catch (err) {
        res.json({message: 500})
    }

})

router.get("/:id", async (req, res) => {
    try {
        const menu = await menuModel.findById(req.params.id);
        if (menu) {
            res.json(menu)
        } else {
            res.json({message: "there is no such menu"})
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }
})

router.post("/", async (req, res) => {

    try {

        const errors = []

        if (req.body.desserts instanceof Array) {
            if (!req.body.desserts.length) {
                errors.push("desserts can not be an empty array")
            }
        } else {
            errors.push("desserts should be an array of ids")
        }

        if (req.body.hotDrinks instanceof Array) {
            if (!req.body.hotDrinks.length) {
                errors.push("hot drinks can not be an empty array")
            }
        } else {
            errors.push("hot drinks should be an array of ids")
        }

        if (req.body.alcohol instanceof Array) {
            if (!req.body.alcohol.length) {
                errors.push("alcohol can not be an empty array")
            }
        } else {
            errors.push("alcohol should be an array of ids")
        }

        if (errors.length) {
          res.json({
              message: errors
          })
        } else {
            const menuItemsNotFound = []

            let dessertsDocuments = req.body.desserts.map(async (id) => {
                const dessert = await DessertModel.findById(id);
                if (!dessert) menuItemsNotFound.push(`Dessert with id ${id} can't be found`)
                return dessert
            })

            let hotDrinksDocuments = req.body.hotDrinks.map(async (id) => {
                const hotDrink = await HotDrinksModel.findById(id);
                if (!hotDrink) menuItemsNotFound.push(`Hot drink with id ${id} can't be found`)
                return hotDrink
            })

            let AlcoholDocuments = req.body.alcohol.map(async (id) => {
                const alcohol = await AlcoholModel.findById(id);
                if (!alcohol) menuItemsNotFound.push(`Alcohol with id ${id} can't be found`)
                return alcohol
            })

            if (!menuItemsNotFound.length) {
                res.json({message: menuItemsNotFound})
            } else {

                if (req.body.isCurrent) {
                    const menuList = await menuModel.find();
                    menuList.forEach((menu) => menu.current = false)
                } else {

                }

                // res.json
            }

        }



    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }

    // let body = req.body
    //
    // // req.body.desserts
    //
    // res.json({menu: "directed by Robert B. Weide"})
})

router.patch("/:id", (req, res) => {
    res.json({menu: "directed by Robert B. Weide"})
})

router.delete("/:id", (req, res) => {
    res.json({menu: "directed by Robert B. Weide"})
})

module.exports = router;

