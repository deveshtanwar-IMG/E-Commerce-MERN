const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
        default: '628px-Ethereum_logo_2014 2.png'
    }
})

module.exports = mongoose.model('products', productSchema);