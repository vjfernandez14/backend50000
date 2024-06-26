const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'MiCodigo'

const generateToken = user => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '5m'})
    return token
}

const authToken = (req,res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).json({status: 'error', error: 'Unauthorized'})

    const token = authHeader.split(' ')[1]

    jwt.verify(token,PRIVATE_KEY, (error, credentials) => {
        console.log(error)
        if(error) return res.status(401).json({status: 'error', error: 'Unauthorized'})

    req.user = credentials.user

    next()
    })     
}

const generateResetToken = user => {
    const userId = user._id.toString()
    console.log(userId)
    const resetToken = jwt.sign({userId: user._id.toString()}, PRIVATE_KEY, {expiresIn: '1h'})
    return resetToken
}   

module.exports = {
    generateToken,
    authToken,
    generateResetToken,
}