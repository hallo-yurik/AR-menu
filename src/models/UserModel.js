const {Schema, model} = require("mongoose")

const User = new Schema({
    username: String,
    password: String,
    verified: {type: Boolean, default: false}
}, {collection: "users"})

module.exports = model("User", User)