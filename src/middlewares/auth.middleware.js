
    const isAdmin = (req, res, next) => {
        console.log(req.user)
        if(req.user && req.user.role === 'admin' || req.user.role === 'premium' ) {
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

    const isPremiumUser = (req, res, next) => {
        if (req.user && req.user.role === 'premium') {
            return next();
        } else {
            return res.status(403).json({ message: 'Acceso no autorizado, solo usuarios premium' });
        }
    }
    
    const isAdminOrPremiumUser = (req, res, next) => {
        if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
            return next();
        } else {
            return res.status(403).json({ message: 'Acceso no autorizado, solo admin o usuarios premium' });
        }
    };

    module.exports = {
        isAdmin,
        isUser,
        isPremiumUser,
        isAdminOrPremiumUser

    }