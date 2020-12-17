const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");

//middlewares
app.use(bodyParser.json());

//routers import
const modelViewerRouter = require("./Routers/model-viewer");
const menuRouter = require("./Routers/menu");

//routers used
app.use("/viewer", modelViewerRouter);
app.use("/menu", menuRouter);

app.get("/", (req, res) => {
    res.send("We are on home");
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqdjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected to db")
    }
})




//Listening
app.listen(8000, () => {
    console.log("server started")
});