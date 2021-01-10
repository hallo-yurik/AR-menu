const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const passport = require("./Passport/passport-main");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const shouldBeLoggedMiddleware = require("./utils/middlewares/passport-should-be-logged")
const shouldNotBeLoggedMiddleware = require("./utils/middlewares/passport-should-not-be-logged")
const cors = require('cors')

// app.use(cors({
//     "origin": "*",
//     "methods": "GET,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
// }))



//env constants
const PORT = process.env.PORT || 8000

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, type: "application/x-www-form-urlencoded"}));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session())
// app.use(cookieParser())
app.use(cors({
    "origin": true,
    "methods": "GET,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
}))
// app.use(cors())


//routers import
const modelViewerRouter = require("./Routers/model-viewer");
const imagesRouter = require("./Routers/images");
const menuRouter = require("./Routers/menu");
const adminRouter = require("./Routers/admin-panel/admin-router");
const loginRouter = require("./Routers/login");

//routers used
app.use("/viewer", modelViewerRouter);
app.use("/images", imagesRouter);
app.use("/menu", menuRouter);
// app.use("/admin", shouldBeLoggedMiddleware, adminRouter);
app.use("/admin", adminRouter);
app.use("/login", shouldNotBeLoggedMiddleware, loginRouter);

app.get("/", (req, res) => {
    res.send("We are on home");
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqdjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
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