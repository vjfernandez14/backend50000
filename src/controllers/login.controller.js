const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const Users = require('../models/users.models')




router.get('/', (req, res) => {
    res.render('login.handlebars')
})

router.post('/', async (req,res) => {
    try {
        const { email, password} = req.body

       
        const user = await Users.findOne({email})
            console.log(user)

        if(!user) return res.status(400).json({message: 'bad Request'})

        if(user.password !== password) return res.status(400).json({message: 'bad Request'})

        if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
            user.role = 'admin';
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        }



        res.redirect('/api/products')

           
        } catch (error) {
        res.status(500).json({status: 'success', message: 'Internal Server error'})
    }
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

module.exports = router