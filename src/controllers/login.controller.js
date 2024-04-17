const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const Users = require('../models/users.models')
const { useValidPassword, createHash } = require('../utils/crypt-password.util')
const passport = require('passport')
const { generateToken, generateResetToken } = require('../utils/token.util')
const { authToken } = require('../utils/token.util')
const { isAdmin } = require('../middlewares/auth.middleware')
const UsersDao = require('../dao/Users.dao')
const transport = require('../utils/nodemailer');
const jwt = require('jsonwebtoken')
const { transports } = require('winston')

const usersDao = new UsersDao


router.get('/', (req, res) => {
    
    if (req.cookies.authToken) {
        res.redirect('/api/products');
    } else {
        
        res.render('login.handlebars');
    }
});

router.get('/current',  passport.authenticate('current', { session: false }), isAdmin, async (req, res) => {
    try {
        user = req.user
        console.log(user.role)
        res.render('admin.handlebars', { user })
        
    } catch (error) {
        console.log(error)
    }
});

router.post('/', passport.authenticate('login', {failureRedirect: '/api/users/login/fail-login'}), async (req,res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
            cartId: req.user.cartId,
        }

       //res.redirect('/api/products')
       const token = generateToken({ id: req.user.id, role: req.user.role})

        


       res.cookie('authToken', token, {
           maxAge: 60000,
           httpOnly: true,
       }).redirect('/api/products')

        

           
        } catch (error) {
        res.status(500).json({status: 'success', message: 'Internal Server error'})
    }
})

router.get('/fail-login', (req,res) => {
    res.status(400).json({status: 'error', error: 'Bad request'})
})

router.get('/logout', (req, res) => {
    console.log('logout');

    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.json({ error: err });
        }

        console.log('redirect');
        
        res.redirect('/api/users/login');
    });
});

router.get('/github', passport.authenticate('github', {scope:['user: email']}), (req,res) => {
    
})


router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req,res) => {
    req.session.user = req.user
    res.redirect('/api/products')
})

router.get('/forgot', (req,res) => {
    res.render('forgot.handlebars')
})

router.post('/forgot', async (req,res) => {
    const userEmail = req.body.email

    try {
       const user = await  usersDao.find({email: userEmail})
       console.log('hace el post')
       console.log(user)
       if(!user){
        return res.status(404).json({error: 'Usuario no encontrador'})
    }

    const resetToken = generateResetToken(user._id)
    console.log(resetToken)
    const resetLink = `http://localhost:8080/api/users/login/forgot/${resetToken}`
    console.log(userEmail)

    await transport.sendMail({
        from: 'victorjosefernandezviloria@gmail.com',
        to: userEmail,
        subject: 'Recuperacion de password',
        html:`
        <h1>Para recuperar tu contraseña</h1>
        <p>Haga click:<a href="${resetLink}">aquí</a></p>
        
        `
    })
    res.render('forgotVer.handlebars', { successMessage: 'Se envió un mail con un link para restablecer tu contraseña' })

    } catch (error) {
        console.log(error)   
    }
})

router.get('/forgot/:token', async (req, res) => {
    const token = req.params.token;
    console.log(token)
    try {
        // Verificar el token JWT
        const decodedToken = jwt.decode(token);
        console.log('first')
        console.log(decodedToken)
        const userId = decodedToken.userId.toString();
        console.log(userId)
        const user = await usersDao.find({ _id: userId });
        console.log(user)
        
        if (!user) {
            // El token es válido pero el usuario no existe, redirigir a una vista de error
            return res.redirect('/error');
        }

        res.render('reset.handlebars', { token });
    } catch (error) {
        // El token es inválido o ha expirado, redirigir a una vista de error
        return res.redirect('/error');
    }
});


router.post('/forgot/:token', async (req,res) => {
    const token = req.params.token
    const newPassword = req.body.password
    const newPasswordCheck = req.body.confirmPassword
    console.log('llega a la ruta')
     

    try {

        if(newPassword !== newPasswordCheck){
            return res.redirect('/api/users/login')
        }
        const descToken = jwt.verify(token,'MiCodigo')
        const userId = descToken.userId.toString()
        
        const user = await usersDao.find({_id:userId})
        if(!user){
            return res.redirect('/forgot')
        }
        const compare = useValidPassword(user,newPassword)
        console.log(compare)
        if(compare) {
            return res.redirect('/api/users/login/forgot');
        }
        const hashedPassword = createHash(newPassword)

        user.password = hashedPassword;
        await usersDao.update(userId, { password: hashedPassword });

        res.redirect('/api/users/login');
        

    } catch (error) {
        console.log(error)
        return res.redirect('/api/users/login')
    }
})

module.exports = router