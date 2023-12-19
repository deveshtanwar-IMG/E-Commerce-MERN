const jwt = require('jsonwebtoken')
const secret = process.env.TOKEN_SECRET;

exports.auth = (req, res, next) => {
    const token = req.cookies.userToken;
    if (token) {
        jwt.verify(token, secret, (err, authData) => {
            if (err) {
                res.json({
                    result: "Invalid Token"
                })
            } else {
                req.userId = authData.id
                next();
            }
        })
    } else {
        console.log('token not available')
        res.redirect('/')
    }
}

exports.rootAuth = (req, res, next) => {
    const token = req.cookies.userToken;
    if (token) {
        jwt.verify(token, secret, (err, authData) => {
            const { id } = authData;
            if (err) {
                res.json({
                    result: "Invalid Token"
                })
            } else {
                res.redirect(`/home`)
            }
        })
    } else {
        console.log('token not available')
        next()
    }
}