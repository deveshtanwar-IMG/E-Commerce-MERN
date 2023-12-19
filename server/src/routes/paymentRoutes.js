const express = require('express');
const router = express.Router()
const Razorpay = require('razorpay');
const crypto = require('crypto')
const Orders = require('../models/order')
const { auth } = require('../middlewares/auth')

// orders api
router.post('/shipping-details', auth, async (req, res) => {
    try {
        const orderBody = {
            ...req.body,
            order_id: req.body.data.paymentDetails.orderId,
            payment_id: req.body.data.paymentDetails.paymentId,
            amount: req.body.orderData.amount / 100
        }
        await Orders.create(orderBody)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

// generate order id
router.post('/generate-order-id', auth, async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
        }

        instance.orders.create(options, (err, order) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

// verify payment
router.post('/verify-payment', auth, (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(signatureData);
        const generated_signature = hmac.digest('hex');
        if (razorpay_signature === generated_signature) {
            return res.send({
                success: true,
                message: "Payment verified successfully",
                paymentDetails: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id
                }
            });
        } else {
            return res.send({
                success: false,
                message: "invalid payment"
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

// get razorpay key api                      
router.get('/get-key', auth, (req, res) => {
    try {
        res.send({
            "key": process.env.RAZORPAY_API_KEY
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

//get orders api                                    
router.get('/get-orders', auth, async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.userId }, {payment_id : 0})
        res.send({
            orders: orders
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

module.exports = router;