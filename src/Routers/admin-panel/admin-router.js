const express = require("express");
const router = express.Router();

//routers import
const dessertsRouter = require("./desserts-router");
const hotDrinksRouter = require("./hot-drinks-router");
const alcoholRouter = require("./alcohol-router");
const adminMenuRouter = require("./admin-menu");

//use routers
router.use("/desserts", dessertsRouter);
router.use("/hot-drinks", hotDrinksRouter);
router.use("/alcohol", alcoholRouter);
router.use("/menu", adminMenuRouter);

router.get("/", async (req, res, next) => {
    res.send("admin panel");
});

router.delete("/logout", async (req, res, next) => {
    req.logOut();
    res.json("You are logged out")
});

module.exports = router;