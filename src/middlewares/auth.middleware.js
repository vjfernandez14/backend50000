
    const isAdmin = (req, res, next) => {
        console.log(req.user)
        if(req.user && req.user.role === 'admin') {
            return next()
        } else {
            return res.status(403).json({ message: 'Accesso no autorizado, solo admin'})
        }
    }

    const isUser = (req, res, next) => {
        if(req.user && req.user.role === 'user') {
            return next()
        } else {
            return res.status(403).json({message: 'Aceeso no autorizado. solo usuarios'})
        }
    }   

    module.exports = {
        isAdmin,
        isUser,
    }