const express = require("express");
const router = express.Router();

//routers import
const dessertsRouter = require("./desserts-router");
const hotDrinksRouter = require("./hot-drinks-router");
const alcoholRouter = require("./alcohol-router");

//use routers
router.use("/desserts", dessertsRouter);
router.use("/hot-drinks", hotDrinksRouter);
router.use("/alcohol", alcoholRouter);

router.get("/", async (req, res, next) => {
    res.send("admin panel");
});

router.get("/login", async (req, res, next) => {
    res.send("login");
});

module.exports = router;