const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");


//env constants
const PORT = process.env.PORT || 8000

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded"}));

//routers import
const modelViewerRouter = require("./Routers/model-viewer");
const imagesRouter = require("./Routers/images");
const menuRouter = require("./Routers/menu");
const adminRouter = require("./Routers/admin-panel/admin-router");

//routers used
app.use("/viewer", modelViewerRouter);
app.use("/images", imagesRouter);
app.use("/menu", menuRouter);
app.use("/admin", adminRouter);

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


//git reset --hard origin/master <<<<<<<<<<<<<<<<<<<

//Listening

app.listen(PORT, () => {
    console.log("server started")
});