const jwt = require('jsonwebtoken')

exports.Auth = async (req, res, next) => {
    const authHeader = req.header('Authorization')

    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(400).send({
            status: "failed",
            message: "Access Denied"
        })
    }

    try {
        const verified = jwt.verify(token, process.env.API_KEY)
        req.user = verified
        return next();

    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "invalid Token"
        })
    }

}