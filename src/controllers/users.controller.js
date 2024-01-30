const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const mongoosePaginate = require('mongoose-paginate-v2')
const Users = require('../models/users.models')




router.get('/singup', (req, res) => {
    res.render('singup.handlebars')
})

router.post('/singup', async (req,res) => {
    try {
        const {first_name, last_name, email, password} = req.body

        const newUserInfo = {
            first_name,
            last_name,
            email,
            password    
        }

        
        const user = await Users.create(newUserInfo)
            
            res.json({status: 'success', message: user})

        } catch (error) {
        res.status(500).json({status: 'success', message: 'Internal Server error'})
    }
})

module.exports = router