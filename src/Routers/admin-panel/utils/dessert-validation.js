const path = require("path");
const fs = require("fs");

const validate = (newFormData) => {

    const errors = []

    if (!newFormData.files.dessert_image.size) {
        errors.push("please attach .png image of dessert")
    } else if (path.extname(newFormData.files.dessert_image.path) !== '.png') {
        errors.push("image should be with .png extension")
    }

    if (!newFormData.files.dessert_model.size) {
        errors.push("please attach .usdz model of dessert")
    } else if (path.extname(newFormData.files.dessert_model.path) !== '.usdz') {
        errors.push("model should be with .usdz extension")
    }

    let ingredients = newFormData.fields.ingredients.split(",");
    let clearIngredients = ingredients.filter((ingredient) => ingredient !== "");

    if (!clearIngredients.length) {
        errors.push("please attach ingredients of dessert")
    }

    if (!newFormData.fields.name) {
        errors.push("please attach name of dessert")
    }

    if (!newFormData.fields.price.length) {
        errors.push("please attach price of dessert")
    } else if (!isNaN(newFormData.fields.price)) {
        if (newFormData.fields.price <= 0) {
            errors.push("price can not be 0 or less")
        }

    } else {
        errors.push("price should be a number value")
    }
    return {errors, clearIngredients}
}

const clearFolder = async (dir) => {
    await fs.readdir(dir, async (err, files) => {
        if (err) throw err

        for (const file of files) {
            await fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            });
        }
    })
}

module.exports = {validate, clearFolder};