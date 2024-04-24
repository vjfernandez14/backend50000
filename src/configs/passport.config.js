const passport = require('passport')
const local = require('passport-local')
const Users = require('../models/users.models')
const { createHash, useValidPassword } = require('../utils/crypt-password.util')
const GitHubStrategy = require('passport-github2').Strategy
const { ghClientId, ghClientSecret } = require('./client')
const jwt = require('passport-jwt')
const cookieExtractor = require('../utils/cookie-extractor.util')
const { generateToken } = require('../utils/token.util')
const initializePassportJwt = require('./passport-jwt.config')
const UsersDao = require('../dao/Users.dao')
const { createUser, getUsers } = require('../services/users.service');
const UserDtoCurrent = require('../DTO/current.dto')
const CartsManager = require('../dao/cartsManagerMongo')
const CustomError = require('../handlers/errors/custom-errors')
const dictonaryErrors = require('../handlers/errors/enum-errors')
const logger = require('../factory/logger.factory')

const winstonLogger = logger


const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy



passport.use('current', new JWTStrategy({
    jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'MiCodigo',
},
async (jwt_payload, done) => {  
    try {
        usersDao = new UsersDao();
        const user = await usersDao.find({ _id:jwt_payload.user.id});
        
        if (user) {

            const UserDto = new UserDtoCurrent({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            })
            console.log(UserDto)
            return done(null, UserDto);
        } else {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
    } catch (error) {
        return done(error);
    }
}
));  


const initializePassport = () => {
    usersDao = new UsersDao
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
        try {
            const {first_name, last_name, email, password} = req.body
            const user = await usersDao.find({email: email})
            if(user){   
                winstonLogger.info('User exist')
                throw CustomError.createError({ name: 'Error', message: 'Usuario ya existente', code: dictonaryErrors.USER_ALREADY_EXISTS });
                return done(null, false)
            } 
            
            const newUserInfo = await createUser(req.body) 
            
            
            return done(null, newUserInfo)
                
            } catch (error) {
                console.log(error)
                return done(error)
            }
        }
    ) )
    
}

passport.use('login', new LocalStrategy(
    {usernameField: 'email'},
     async ( username, password, done) => {
        usersDao = new UsersDao
        try {
            const user = await getUsers({email: username})
            

        if(!user) {
            winstonLogger.warning('Usuario no existe')
            throw CustomError.createError({ name: 'Error', message: 'Usuario no encontrado', code: dictonaryErrors.NOT_FOUND })
            
            
        } 
        if(!useValidPassword(user,password)) {
            winstonLogger.error('contraseña incorrecta')
            throw CustomError.createError({ name: 'Error', cause: 'La contraseña proporcionada es incorrecta.', message: 'Contraseña incorrecta', code: dictonaryErrors.INVALID_PASSWORD })
            
        }
        
        

        if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
            user.role = 'admin';
        }

        return done(null,user)
        } catch (error) {
            winstonLogger.error(error)
            return done(error)
        }
     }))

     passport.use('github', new GitHubStrategy({
        clientID: ghClientId,
        clientSecret: ghClientSecret,
        callbackURL: 'http://localhost:8080/api/users/login/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            
            usersDao = new UsersDao
            const { id, login, name, email } = profile._json
    
            const user = await usersDao.find({ email: email }) // Aquí corregí de 'username' a 'email'
            if (!user) {
                const newUserInfo = {
                    first_name: name,
                    email,
                    githubId: id,
                    githubUsername: login,
                }
    
                const newUser = await usersDao.createUser(newUserInfo)
                return done(null, newUser)
            }
    
            return done(null, user)
        } catch (error) {
            winstonLogger.error(error)
            done(error)
        }
    }));

passport.serializeUser((user, done) => {
    winstonLogger.error('Esto es un error')
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    userDao = new UsersDao
    const user = userDao.find({_id: id})
    done(null, user) 
  })

module.exports = initializePassport
//module.exports = initializePassportJwt
