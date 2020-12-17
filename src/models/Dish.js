const mongoose = require("mongoose")


const DishSchema = mongoose.Schema({
    title: String
})

module.exports = mongoose.model("Dish", DishSchema)