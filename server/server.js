const express = require('express');
require('dotenv').config();
require('./src/configs/db_connect')
const userRoutes = require('./src/routes/userRoutes')
const categProdRoutes = require('./src/routes/categProdRoutes')
const paymentRoutes = require('./src/routes/paymentRoutes')
const cors = require('cors');


const port = process.env.PORT || 5000;

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public/uploads'));

app.use(cors());


app.use(userRoutes);
app.use(categProdRoutes)
app.use(paymentRoutes)

app.listen(port, () => {
    console.log(`server connected on port : ${port}`)
})