const {Schema, model} = require("mongoose")

const HotDrink = new Schema({
    productGroup: {type: String, default: "hotDrink"},
    name: String,
    volume: Number,
    price: Number

}, {collection: "hot_drinks"})

module.exports = model("HotDrink", HotDrink)