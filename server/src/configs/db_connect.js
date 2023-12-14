const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)
    .then(() => { console.log("database connected successfully") })
    .catch((err) => console.log('error : => ', err))