const Category = require('../models/category');
const Products = require('../models/products')
const Cart = require('../models/cart')

exports.getCategory = async (req, res) => {
    try {
        const categoryData = await Category.find({parent_id : null})
        res.send({
            "success": true,
            "categories": categoryData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.getSubCategory = async (req, res) => {
    try {
        const { id } = req.params
        const SubCategoryData = await Category.find({ parent_id: id })
        res.send({
            "success": true,
            "SubCategories": SubCategoryData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params
        const productData = await Products.find({ sub_category_id: id })
        res.send({
            "success": true,
            "products": productData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.getAllProduct = async (req, res) => {
    try {

        // pagination code
        const page = req.query.page || 0;
        const pageSize = req.query.pageSize || 1;

        const productData = await Products.find()

        const startIndex = (page -1) * pageSize;
        const lastIndex = page * pageSize;

        const results = {}

        results.totalResults = productData.length   
        results.pageCount = Math.ceil(productData.length  / pageSize)

        results.result = productData.slice(startIndex, lastIndex)

        res.send({
            "success": true,
            "products": results
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}


exports.setCartData = async (req, res) => {
    try {
        const { product_id, quantity } = req.body
        const existingCartItem = await Cart.findOne({ userId: req.userId, product_id: product_id })
        if (existingCartItem) {
            const cart = await Cart.updateOne({ _id: existingCartItem._id }, { $set: { quantity: quantity } })
            cart ? res.send({
                "success": true,
                "message": 'Successfully added to cart quantity'
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
                userId: req.userId
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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.removeCartData = async (req, res) => {
    try {
        const { product_id, quantity } = req.body
        const existingCartItem = await Cart.findOne({ userId: req.userId, product_id: product_id })
        if(existingCartItem){
            if (quantity > 0) {
                const cartData = await Cart.updateOne({ _id :  existingCartItem._id}, { $set: { quantity: quantity } })
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
                const deleteData = await Cart.deleteOne({ _id: existingCartItem._id })
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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.deleteFromCart = async (req, res) => {
    try {
        const existingCartItem = await Cart.findOne({ userId: req.userId, product_id: req.body.product_id })
        if(existingCartItem){
            const deleteItem = await Cart.deleteOne({ _id: existingCartItem._id })
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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}


exports.fetchCartData = async (req, res) => {
    try {
        const cartData = await Cart.find({ userId: req.userId })
        if (cartData) {
            res.send({
                "success": true,
                cartData
            })
        }
        else {
            res.send({
                "success": false,
                "message": 'No items available in cart'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

exports.emptyCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.userId })
        res.send({ message: "cart emptied" })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}
