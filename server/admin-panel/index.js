const express = require('express');
require('dotenv').config();
const routes = require('./routes/routes');
require('./config/db_connect');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash')


const app = express();

const port = process.env.PORT || 8000;

// set engine
app.set('view engine', 'ejs')

// middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({ 
    secret:'geeksforgeeks', 
    saveUninitialized: true, 
    resave: true
}));
app.use(flash()); 

// routes
app.use(routes)

// static public directory
app.use(express.static('public'))
app.use(express.static('public/uploads'))

// listen
app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})