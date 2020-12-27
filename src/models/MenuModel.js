const {Schema, model} = require("mongoose")
const DessertModel = require("./DessertModel");
const HotDrinksModel = require("./HotDrinksModel")
const AlcoholModel = require("./AlcoholModel");

const Menu = new Schema({
    version: Number,
    creationDate: Date,
    current: Boolean,
    desserts: [DessertModel.schema],
    hotDrinks: [HotDrinksModel.schema],
    alcohol: [AlcoholModel.schema]

}, {collection: "menu"})

module.exports = model("Menu", Menu)