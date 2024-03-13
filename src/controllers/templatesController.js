const {Router} = require('express')
const { isAdmin } = require('../middlewares/auth.middleware')
const passport = require('passport')

const  router = Router()

router.get('/chats', passport.authenticate('current', { session: false }), isAdmin , (req ,res) => {
    user = req.user
    console.log(user)
    res.render('chats.handlebars')
})

module.exports =  router 