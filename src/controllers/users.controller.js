const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const mongoosePaginate = require('mongoose-paginate-v2')
const Users = require('../models/users.models')
const { createHash } = require('../utils/crypt-password.util')
const passport = require('passport')
const logger = require('../factory/logger.factory')
const UserDtoCurrent = require('../DTO/current.dto')
const { isPremiumUser } = require('../middlewares/auth.middleware')
const multer = require('multer')
const upload = require('../middlewares/multer')


const winstonLogger = logger







router.get('/singup', (req, res) => {
    res.render('singup.handlebars')
})

router.get('/loggerTest', (req, res) => {
    // Ejemplos de mensajes de registro en diferentes niveles
    winstonLogger.fatal('Este es un mensaje fatal.');
    winstonLogger.error('Este es un mensaje de error.');
    winstonLogger.warning('Este es un mensaje de advertencia.');
    winstonLogger.info('Este es un mensaje de información.');
    winstonLogger.http('Este es un mensaje HTTP.');
    winstonLogger.debug('Este es un mensaje de depuración.');

    res.send('Logs enviados a la consola.');
});


router.post('/singup', passport.authenticate('register',{failureRedirect: '/fail-register'}) , async (req,res) => {
    try {
                    
            res.json({status: 'success', message: 'usuario creado'})

        } catch (error) {
        res.status(500).json({status: 'success', message: 'Internal Server error'})
    }
})

router.get('/premium/:uid', isPremiumUser, async(req, res) => {
    const {uid} = req.params
    try {
        const user = await Users.findById(uid)
        if(user) {
            const userDto =  new UserDtoCurrent(user)
            res.render('userProfile.handlebars', {user: userDto})
        } else {
            res.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/:uid/documents', (req, res) => {
    res.render('multer.handlebars', { uid: req.params.uid });
});

router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params;
    const files = req.files;

    try {
        const user = await Users.findById(uid);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si se subieron archivos
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const documents = files.map(file => ({
            name: file.originalname,
            reference: file.filename
        }));
        
        user.documents = user.documents.concat(documents)
        console.log(user.documents)
        await user.save() 

        res.status(200).json({ message: 'Files uploaded successfully', uploadedFiles: documents })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:uid/profileImage', upload.array('profileImage'), async (req, res) => {
    const { uid } = req.params;
    const files = req.files;

    try {
        const user = await Users.findById(uid);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si se subieron archivos
        const documents = files.map(file => ({
            name: file.originalname,
            reference: file.filename
        }));
        
        user.documents = user.documents.concat(documents)
        console.log(user.documents)
        await user.save() 

        res.status(200).json({ message: 'Files uploaded successfully', uploadedFiles: documents })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:uid/productImage', upload.array('productImage'), async (req, res) => {
    const { uid } = req.params;
    const files = req.files;

    try {
        const user = await Users.findById(uid);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si se subieron archivos
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const documents = files.map(file => ({
            name: file.originalname,
            reference: file.filename
        }));
        
        user.documents = user.documents.concat(documents)
        console.log(user.documents)
        await user.save() 

        res.status(200).json({ message: 'Files uploaded successfully', uploadedFiles: documents })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/fail-register', (req,res) => {
    res.status(400).json({status: 'error', error: 'Bad request'}) 
})

module.exports = router