function generateToken() {
    return crypto.randomBytes(20).toString('hex')
}

module.exports = generateToken