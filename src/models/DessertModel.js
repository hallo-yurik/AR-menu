const {Schema, model} = require("mongoose")

const Dessert = new Schema({
    name: String,
    ingredients: [String],
    image: String,
    ar: String,
    price: Number
}, {collection: "desserts"})

module.exports = model("Dessert", Dessert)