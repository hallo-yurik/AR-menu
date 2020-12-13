const express = require("express");
const path = require('path');
const app = express();
const modelViewerRouter = require("./Routers/model-viewer");

app.use("/viewer", modelViewerRouter);

app.get("/", (req, res) => {
    res.send("We are on home");
});

//Listening
app.listen(8000, () => {});