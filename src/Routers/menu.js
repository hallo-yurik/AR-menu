const express = require("express");
const router = express.Router();
const Menu = require("../models/MenuModel")

router.get("/", async (req, res, next) => {
    try{
        console.log(1)
        const currentMenu = await Menu.findOne({current: true})
        res.status(200).json(currentMenu)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: ["Internal server error"]})
    }
});

module.exports = router;