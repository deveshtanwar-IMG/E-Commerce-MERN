const express = require('express');
const { getCategory, getSubCategory, getProduct, getAllProduct, setCartData, removeCartData, deleteFromCart, fetchCartData, emptyCart } = require('../controllers/categProdController');
const router = express.Router()

// get category api
router.get('/get-category', getCategory)

// get sub category api
router.get('/get-sub-category/:id', getSubCategory)

// get products api
router.get('/get-product/:id', getProduct)

// get all products api
router.get('/get-all-product', getAllProduct)

// cart add post api
router.post('/set-cart-data', setCartData)

// cart remove post api
router.post('/remove-cart-data', removeCartData)

// delete item from cart api
router.post('/delete-from-cart', deleteFromCart )

// fetch cart data api
router.post('/fetch-cart-data', fetchCartData)

// empty cart api
router.post('/empty-cart', emptyCart)

module.exports = router;