const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    product_id:{
        type: String
    },
    quantity: {
        type: Number
    },
    category_id: {
        type: String,
        required: true
    },
    sub_category_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('carts', cartSchema);