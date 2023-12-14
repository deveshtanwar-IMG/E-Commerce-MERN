const mongoose = require('mongoose');
const moment = require('moment')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postal_code: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: false
    },
    order_id: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true
    },
    created:{
        type: String,
        required: false,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    amount:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('orders', orderSchema);