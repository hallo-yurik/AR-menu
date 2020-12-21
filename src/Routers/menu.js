const express = require("express");
const router = express.Router();
const Dessert = require("../models/DessertModel");

router.get("/", async (req, res, next) => {
    const menu = await Dessert.find({});
    // const menu = await Dessert.find();
    // res.json(menu)

    res.send(menu);
    // next();
});

router.post("/", async (req, res, next) => {
    const dessert = new Dessert({
        title: req.body.title
    })

    try {
        const dessertPost = await dessert.save()
        res.json(dessertPost)
    } catch (err) {
        res.json({
            message: err
        })
    }
});

// router.post("/", async (req, res, next) => {
//     const dessert = new Dessert({
//         title: req.body.title
//     });
//
//     try {
//         const dessertPost = await dessert.save()
//         res.json(dessertPost)
//     } catch (err) {
//         res.json({
//             message: err
//         })
//     }
//
//     // const dish = new test({
//     //     children: [{ name: 'string' }, { name: 'string2'}],
//     //     child: { name: 'strin3' }
//     // });
//
//     try {
//         const dessertPost = await dessert.save()
//         res.json(dessertPost)
//     } catch (err) {
//         res.json({
//             message: err
//         })
//     }
//
//
// });

module.exports = router;