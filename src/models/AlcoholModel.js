const {Schema, model} = require("mongoose")

const Alcohol = new Schema({
    name: String,
    volume: Number,
    price: Number

}, {collection: "alcohol"})

module.exports = model("Alcohol", Alcohol)