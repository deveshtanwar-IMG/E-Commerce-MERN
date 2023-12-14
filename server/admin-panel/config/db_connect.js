const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error))
db.once('open', ()=>{console.log('connected to database')})