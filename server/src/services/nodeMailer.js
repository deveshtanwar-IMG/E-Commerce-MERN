const nodemailer = require('nodemailer');

const nodeMailer = (otp, res) => {
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

module.exports = nodeMailer;