const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        default: null
    },
    title: {
        type: String,
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

module.exports = mongoose.model('categories', categorySchema);