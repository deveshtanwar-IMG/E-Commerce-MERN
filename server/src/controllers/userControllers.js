const Users = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const generateOTP = require('../services/generateOTP');
const fs = require('fs');

const secret = process.env.SECRET;

// signup
exports.userSignup = async (req, res) => {
    try {
        const userData = await Users.findOne({ email: req.body.email })
        if (userData) {
            res.send({
                "error": " !! Email already used"
            })
        }
        else {
            const hashPassword = await bcrypt.hash(req.body.password, 13)
            req.body.password = hashPassword;
            const save = await Users.create(req.body)
            if (save) {
                res.send({
                    "success": true,
                    "message": "Registered successfully !!"
                })
            }
            else {
                res.send({
                    "error": "Failed Please try Again Later !!"
                })
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}


// signin
exports.userSignin = async (req, res) => {
    try {
        const userExist = await Users.findOne({ email: req.body.email })
        if (!userExist) {
            res.send({
                "error": "user not found!! please Signup first"
            })
        }
        else {
            const isMatch = await bcrypt.compare(req.body.password, userExist.password)
            if (!isMatch) {
                res.send({
                    "error": "Invalid Credentials"
                })
            }
            else {
                const token = jwt.sign({ email: userExist.email }, secret)
                await Users.updateOne({ email: userExist.email }, { $set: { token: token } })
                delete userExist._doc.password;
                // above line is used to delete pw from userExist before sending to client

                res.send({
                    "success": true,
                    "message": "Login successfully !!",
                    "userDetails": userExist,
                    "token": token
                })
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}


// signout
exports.userSignout = async (req, res) => {
    try {
        const user_id = req.headers['user_id'];
        await Users.updateOne({ _id: user_id }, { $set: { token: '' } })
        res.send('logout successfull')
    } catch (error) {
        console.log(error)
        throw error
    }
}

// forget password
exports.userForgetPassword = async (req, res) => {
    try {
        const userExist = await Users.findOne({ email: req.body.email })
        if (!userExist) {
            res.send({
                "success": false,
                "message": "please enter registered Email"
            })
        }
        else {
            const otp = generateOTP
            console.log(otp)
            await Users.updateOne({ email: userExist.email }, { $set: { otp: otp } })
            // nodemailer code starts here
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'deveshtanwar.img@gmail.com',
                    pass: process.env.PASS
                }
            });

            let mailOptions = {
                from: 'deveshtanwar.img@gmail.com',
                to: 'neuroglial07@gmail.com',
                subject: 'Ecommerece reset password otp',
                text: `your otp for Ecommerece reset password is : ${otp}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.send({ "success": false, "message": error })
                } else {
                    res.send({
                        "success": true,
                        "message": "OTP sent to your Email!!"
                    })
                }
            });
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}


// otp validate
exports.userOtpValidate = async (req, res) => {
    try {
        const checkOTP = await Users.findOne({ email: req.body.email })
        if (checkOTP.otp === req.body.otp) {
            await Users.updateOne({ email: req.body.email }, { $set: { otp: '' } })
            res.send({
                "success": true,
                "message": 'otp validated'
            })
        }
        else {
            res.send({
                "success": false,
                "message": 'Enter Correct OTP'
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

// reset password
exports.userResetPassword = async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 13)
        const userUpdated = await Users.updateOne({ email: req.body.email }, { $set: { password: hashPassword } })
        if (userUpdated) {
            res.send({
                "success": true,
                "message": "password updated successfully"
            })
        }
        else {
            res.send({
                "success": false,
                "message": "Error changing password !! Retry again"
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

// user edit profile
exports.userEditProfile = async (req, res) => {
    try {
        if (!req.file) {
            const userData = await Users.find({email: req.body.email})
            const user = {
                ...req.body,
                image: userData.image
            }
            await Users.updateOne({ email: req.body.email }, user)
                .then(() => {
                    res.send({
                        "success": true,
                        "message": "Profile updated Successfully !!"
                    })
                })
                .catch((err) => {
                    res.send({
                        "success": false,
                        "message": 'please try again later!!'
                    })
                })
        }
        else {
            const userData = {
                ...req.body,
                image: req.file.filename
            }
            const userDbData = await Users.findOne({email: req.body.email})
            if(userDbData.image){
                fs.unlink('./public/uploads/' + `${userDbData.image}`, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Delete File successfully.");
                });
            }
            await Users.updateOne({ email: req.body.email }, userData)
                .then(() => {
                    res.send({
                        "success": true,
                        "message": "Profile updated Successfully !!"
                    })
                })
                .catch((err) => {
                    res.send({
                        "success": false,
                        "message": 'please try again later!!'
                    })
                })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}


// fetch user data
exports.fetchUserData = async (req, res) => {
    try {
        const userData = await Users.findOne({email: req.body.email})
        if(userData){
            delete userData._doc.password;
            delete userData._doc.token;
            delete userData._doc.otp;

            res.send({
                "success": true,
                "userDetails": userData
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}