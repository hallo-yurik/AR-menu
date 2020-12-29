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

            let dessertsDocuments = []

            for (let id of req.body.desserts) {
                const dessert = await DessertModel.findById(id);
                if (!dessert) {
                    menuItemsNotFound.push(`Dessert with id ${id} can't be found`)
                } else {
                    dessertsDocuments.push(dessert)
                }
            }

            let hotDrinksDocuments = []

            for (let id of req.body.hotDrinks) {
                const hotDrink = await HotDrinksModel.findById(id);
                if (!hotDrink) {
                    menuItemsNotFound.push(`Hot drink with id ${id} can't be found`)
                } else {
                    hotDrinksDocuments.push(hotDrink)
                }
            }

            let AlcoholDocuments = [];

            for (let id of req.body.alcohol) {
                const alcohol = await AlcoholModel.findById(id);
                if (!alcohol) {
                    menuItemsNotFound.push(`Alcohol with id ${id} can't be found`)
                } else {
                    AlcoholDocuments.push(alcohol)
                }
            }

            if (menuItemsNotFound.length) {
                res.json({message: menuItemsNotFound})
            } else {

                const menusAmount = await menuModel.countDocuments({}) //should be a number
                let latestVersion = 0

                if (menusAmount) {

                    latestVersion = await menuModel.findOne({}).sort({version: -1})
                    const nextVersion = latestVersion.version + 1;

                    if (req.body.isCurrent === true) {
                        const menuList = await menuModel.find({current: true});

                        for (let menu of menuList) {
                            menu.current = false
                            await menuList.save()
                        }

                        const newMenu = new menuModel({
                            version: nextVersion,
                            current: true,
                            desserts: dessertsDocuments,
                            hotDrinks: hotDrinksDocuments,
                            alcohol: AlcoholDocuments
                        })

                        const newMenuDocument = await newMenu.save()

                        res.json({menus: newMenuDocument})

                    } else {

                        console.log(dessertsDocuments)

                        const newMenu = new menuModel({
                            version: nextVersion,
                            current: false,
                            desserts: dessertsDocuments,
                            hotDrinks: hotDrinksDocuments,
                            alcohol: AlcoholDocuments
                        })

                        const newMenuDocument = await newMenu.save()

                        res.json({menus: newMenuDocument})

                    }

                } else {

                    const newMenu = new menuModel({
                        version: 1,
                        current: true,
                        desserts: dessertsDocuments,
                        hotDrinks: hotDrinksDocuments,
                        alcohol: AlcoholDocuments
                    })

                    const newMenuDocument = await newMenu.save()

                    res.json({menus: newMenuDocument})

                }
            }

        }

    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }
})

router.patch("/:id", (req, res) => {
    res.json({menu: "directed by Robert B. Weide"})
})

router.delete("/:id", async (req, res) => {

    try {
        const menuToDelete = await menuModel.findById(req.params.id)
        if (menuToDelete) {
            await menuToDelete.deleteOne();
            res.json({message: `${menuToDelete.name} was deleted`, menuToDelete})

            if (menuToDelete) {

            }


        } else {
            res.json({message: "there is no such menu"});
        }
    } catch (err) {
        console.log(err)
        res.json({message: 500})
    }



    // res.json({menu: "directed by Robert B. Weide"})
})

module.exports = router;

