const {Schema, model} = require("mongoose")

const Dessert = new Schema({
    title: {
        type: String,
        required: true
    }

}, {collection: "menu"})

// const childSchema = new Schema({ name: 'string' });
//
// const parentSchema = new Schema({
//     // Array of subdocuments
//     children: [childSchema],
//     // Single nested subdocuments. Caveat: single nested subdocs only work
//     // in mongoose >= 4.2.0
//     child: childSchema
// });

// module.exports = model("test", parentSchema)
module.exports = model("Dish", Dessert)