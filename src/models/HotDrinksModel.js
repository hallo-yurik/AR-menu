const {Schema, model} = require("mongoose")

const HotDrink = new Schema({
    name: String,
    volume: Number,
    price: Number

}, {collection: "hot_drinks"})

module.exports = model("HotDrink", HotDrink)