const mongoose = require("mongoose")


const DishSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("Dish", DishSchema)