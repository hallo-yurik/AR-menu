const validate = (body, productName) => {

    const {name, volume, price} = body


    const errors = []
    if (name && !name.length) {
        errors.push(`please attach name of ${productName}`)
    }

    if (price && !price.length) {
        errors.push(`please attach price of ${productName}`)
    } else if (!isNaN(price)) {
        if (+price <= 0) {
            errors.push(`price can not be 0 or less`)
        }

    } else if(price == null) {
        errors.push(`please attach price of ${productName}`)
    } else {
        errors.push("price should be a number value")
    }

    if (volume && !volume.length) {
        errors.push(`please attach volume of ${productName}`)
    } else if (!isNaN(volume)) {
        if (+volume <= 0) {
            errors.push("volume can not be 0 or less")
        }

    } else if (price == null) {
        errors.push(`please attach volume of ${productName}`)
    } else {
        errors.push("volume should be a number value")
    }

    return errors
}

module.exports = validate;