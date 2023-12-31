const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.auth = (req, res, next) => {
    const bearer = req.headers['authorization'];
    const token = bearer.split(' ')[1]
    if(token){
        jwt.verify(token, secret, (err, authData) => {
            if(err){
                res.send({
                    success: false,
                    message: "Invalid Token"
                })
            }
            else{
                req.userId = authData.userID
                next();
            }
        })
    }
    else{
        console.log('Token not Available');
        res.send({
            success: false,
            message: "Token not Available"
        })
    }
}