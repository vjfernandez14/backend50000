const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const mongoosePaginate = require('mongoose-paginate-v2')
const Users = require('../models/users.models')
const { createHash } = require('../utils/crypt-password.util')
const passport = require('passport')




router.get('/singup', (req, res) => {
    res.render('singup.handlebars')
})

router.post('/singup', passport.authenticate('register',{failureRedirect: '/fail-register'}) , async (req,res) => {
    try {
                    
            res.json({status: 'success', message: 'usuario creado'})

        } catch (error) {
        res.status(500).json({status: 'success', message: 'Internal Server error'})
    }
})

router.get('/fail-register', (req,res) => {
    res.status(400).json({status: 'error', error: 'Bad request'})
})

module.exports = router