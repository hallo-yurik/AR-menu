const express = require("express");
const path = require("path");
const router = express.Router();
//PNG

router.get("/:name", (req, res, next) => {

    let fileName = req.params.name;

    const options = {
        root: path.join(__dirname, '../DessertsImages'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            // console.log('Sent:', fileName)
        }
    });
});

module.exports = router;