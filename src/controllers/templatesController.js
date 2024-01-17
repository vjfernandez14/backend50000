const {Router} = require('express')

const  router = Router()

router.get('/chats', (req ,res) => {
    res.render('chats.handlebars')
})

module.exports =  router