const {Schema, model} = require("mongoose")

const Dessert = new Schema({
    productGroup: {type: String, default: "dessert"},
    name: String,
    ingredients: [String],
    image: String,
    ar: String,
    price: Number
}, {collection: "desserts"})

module.exports = model("Dessert", Dessert)