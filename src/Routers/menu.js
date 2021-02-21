const express = require("express");
const router = express.Router();
const Menu = require("../models/MenuModel")

router.get("/", async (req, res, next) => {
    try{
        const currentMenu = await Menu.findOne({current: true})
        res.status(200).json(currentMenu)
    } catch (err) {
        res.status(500).json({message: ["Internal server error"]})
    }
});

module.exports = router;