const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const Users = require('../models/users.models')
const { useValidPassword } = require('../utils/crypt-password.util')
const passport = require('passport')




router.get('/', (req, res) => {
    res.render('login.handlebars')
})

router.post('/', passport.authenticate('login', {failureRedirect: '/api/users/login/fail-login'}), async (req,res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        }

        res.redirect('/api/products')

           
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

module.exports = router