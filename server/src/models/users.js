const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: Array,
        required: false,
        default : ""
    },
    otp: {
        type: String,
        required: false,
        default : ""
    },
    image:{
        type: String,
        required: false,
        default: ""
    },
    phone:{
        type: Number,
        required:false,
    },
    country:{
        type: String,
        required: false,
        default: 'india'
    },
    state:{
        type: String,
        required: false
    },
    postal_code:{
        type: Number,
        required: false
    },
    address:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('users', userSchema);