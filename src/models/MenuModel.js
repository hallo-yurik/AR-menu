const {Schema, model} = require("mongoose")
const DessertModel = require("./DessertModel");
const HotDrinksModel = require("./HotDrinksModel")
const AlcoholModel = require("./AlcoholModel");

const Menu = new Schema({
    version: String,
    creationDate: Date,
    desserts: [DessertModel],
    hotDrinks: [HotDrinksModel],
    alcohol: [AlcoholModel]

}, {collection: "menu"})

module.exports = model("Menu", Menu)