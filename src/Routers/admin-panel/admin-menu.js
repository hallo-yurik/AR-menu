const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({menu: "directed by Robert B. Weide"})
})

module.exports = router;

