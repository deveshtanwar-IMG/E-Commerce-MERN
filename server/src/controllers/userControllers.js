const Users = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateOTP = require('../services/generateOTP');
const fs = require('fs');
const nodeMailer = require('../services/nodeMailer');

const secret = process.env.SECRET;

// signup
exports.userSignup = async (req, res) => {
    try {
        const existingUser = await Users.findOne({ email: req.body.email }, { email: 1 })
        if (existingUser) {
            return res.json({
                success: false,
                error: "Email already in use"
            })
        }
        else {
            const hashPassword = await bcrypt.hash(req.body.password, 13)
            req.body.password = hashPassword;
            const newUser = await Users.create(req.body)
            if (newUser) {
                return res.json({
                    success: true,
                    message: "Registered successfully !!"
                })
            }
            else {
                return res.json({
                    success: false,
                    error: "Failed Please try Again Later !!"
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
                const token = jwt.sign({ userID: userExist._id }, secret)
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
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

// signout
exports.userSignout = async (req, res) => {
    try {
        await Users.updateOne({ _id: req.userId }, { $set: { token: '' } })
        res.send('logout successfull')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
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
            nodeMailer(otp, res)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

// otp validate
exports.userOtpValidate = async (req, res) => {
    try {
        const checkOTP = await Users.findOne({ email: req.body.email, otp: req.body.otp })
        if (!checkOTP) {
            return res.send({
                "success": false,
                "message": 'Invalid OTP'
            })
        };
        await Users.findByIdAndUpdate({ _id: checkOTP._id }, { otp: '' })
        return res.send({
            "success": true,
            "message": 'otp validated'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

// reset password
exports.userResetPassword = async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 13)
        const userUpdated = await Users.updateOne({ email: req.body.email }, { $set: { password: hashPassword } })
        if (userUpdated) {
            return res.send({
                "success": true,
                "message": "password updated successfully"
            })
        }
        else {
            return res.send({
                "success": false,
                "message": "Error changing password !! Retry again"
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

// user edit profile
exports.userEditProfile = async (req, res) => {
    try {
        if (!req.file) {
            delete req.body.image
            await Users.updateOne({ _id: req.userId }, req.body)
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
            const userDbData = await Users.findOne({ _id: req.userId })
            if (userDbData.image) {
                fs.unlink('./public/uploads/' + `${userDbData.image}`, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Delete File successfully.");
                });
            }
            await Users.updateOne({ _id: req.userId }, userData)
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
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

// fetch user data
exports.fetchUserData = async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.userId }, { password: 0, token: 0, otp: 0 })
        res.send({
            "success": true,
            "userDetails": userData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}