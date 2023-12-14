const SubCategory = require('../models/sub-category');
const Category = require('../models/category');
const Products = require('../models/products')
const Cart = require('../models/cart')

exports.getCategory = async (req, res) => {
    const categoryData = await Category.find({})
    res.send({
        "success": true,
        "categories": categoryData
    })
}

exports.getSubCategory = async (req, res) => {
    const { id } = req.params
    const SubCategoryData = await SubCategory.find({ category_id: id })
    res.send({
        "success": true,
        "SubCategories": SubCategoryData
    })
}

exports.getProduct = async (req, res) => {
    const { id } = req.params
    const productData = await Products.find({ sub_category_id: id })
    res.send({
        "success": true,
        "products": productData
    })
}

exports.getAllProduct = async (req, res) => {
    const productData = await Products.find()
    res.send({
        "success": true,
        "products": productData
    })
}

exports.setCartData = async (req, res) => {

    const { _id, quantity } = req.body
    const cartDb = await Cart.findOne({ productId: _id })

    if (cartDb) {
        const cart = await Cart.updateOne({ productId: _id }, { $set: { quantity: quantity } })
        cart ? res.send({
            "success": true,
            "message": 'Successfully added to cart'
        })
            :
            res.send({
                "success": false,
                "message": 'Failed to add in cart'
            })
    }
    else {
        const cartData = {
            ...req.body,
            productId: _id,
        }
        const cart = await Cart.create(cartData)
        cart ? res.send({
            "success": true,
            "message": 'Successfully added to cart'
        })
            :
            res.send({
                "success": false,
                "message": 'Failed to add in cart'
            })
    }
}

exports.removeCartData = async (req, res) => {

    const { _id, quantity } = req.body

    if (quantity > 0) {
        const cartData = await Cart.updateOne({ productId: _id }, { $set: { quantity: quantity } })
        cartData ? res.send({
            "success": true,
            "message": 'Successfully removed from cart'
        })
            :
            res.send({
                "success": false,
                "message": 'Failed to remove from cart'
            })
    }
    else {
        const deleteData = await Cart.deleteOne({ productId: _id })
        deleteData ? res.send({
            "success": true,
            "message": 'Successfully removed from cart'
        })
            :
            res.send({
                "success": false,
                "message": 'Failed to remove from cart'
            })
    }
}

exports.deleteFromCart = async (req, res) => {
    const deleteItem = await Cart.deleteOne({ productId: req.body._id })
    deleteItem ? res.send({
        "success": true,
        "message": 'Successfully removed from cart'
    })
        :
        res.send({
            "success": false,
            "message": 'Failed to remove from cart'
        })
}


exports.fetchCartData = async (req, res) => {
    const userFound = await Cart.find({userId: req.body.userId})
    if(userFound){
        res.send({
            "success": true,
            "cartData": userFound
        })
    }
    else{
        res.send({
            "success" : false,
            "message": 'No items available in cart'
        })
    }
}

exports.emptyCart = async (req, res) => {
    await Cart.deleteMany({userId: req.body.userId})
    res.send({message:"cart emptied"})
}
