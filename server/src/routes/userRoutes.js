const express = require('express')
const router = express.Router();
const { auth } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const { userSignup, userSignin, userSignout, userForgetPassword, userOtpValidate, userResetPassword, userEditProfile, fetchUserData } = require('../controllers/userControllers')

// sign up
router.post('/signup', userSignup)

// sign in 
router.post('/signin', userSignin)

//signout
router.post('/logout', auth, userSignout)

//forget password
router.post('/forget-password', userForgetPassword)

// validate otp
router.post('/otp-validate', userOtpValidate)

// reset password
router.post('/reset-password', userResetPassword)

// user edit profile
router.post('/edit-profile', auth, upload.single('image'), userEditProfile)

// fetch user data
router.post('/get-user-details', auth, fetchUserData)

module.exports = router;