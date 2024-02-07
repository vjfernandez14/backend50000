const passport = require('passport')
const local = require('passport-local')
const Users = require('../models/users.models')
const { createHash, useValidPassword } = require('../utils/crypt-password.util')
const GitHubStrategy = require('passport-github2').Strategy
const { ghClientId, ghClientSecret } = require('./client')


const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
        try {
            const {first_name, last_name, email} = req.body
            const user = await Users.findOne({email: email})
            if(user){
                console.log('User exists')
                return done(null, false)
            }

            const newUserInfo = {
                first_name,
                last_name,
                email,
                password: createHash(password),    
            }

            const newUser = await Users.create(newUserInfo)
            return done(null, newUser)
                
            } catch (error) {
                console.log(error)
                return done(error)
            }
        }
    ) )
    
}

passport.use('login', new LocalStrategy(
    {usernameField: 'email'},
     async (username, password, done) => {
        try {
            const user = await Users.findOne({email: username})
            console.log(user)

        if(!user) {
            console.log('Usuario no existe')
            return done(null,false)
        }

        if(!useValidPassword(user,password)) {
            console.log('contraseña incorrecta')
            return done(null,false)
        }

        if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
            user.role = 'admin';
        }

        return done(null,user)
        } catch (error) {
            done(error)
        }
     }))

     passport.use('github', new GitHubStrategy({
        clientID: ghClientId,
        clientSecret: ghClientSecret,
        callbackURL: 'http://localhost:8080/api/users/login/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
    
            const { id, login, name, email } = profile._json
    
            const user = await Users.findOne({ email: email }) // Aquí corregí de 'username' a 'email'
            if (!user) {
                const newUserInfo = {
                    first_name: name,
                    email,
                    githubId: id,
                    githubUsername: login,
                }
    
                const newUser = await Users.create(newUserInfo)
                return done(null, newUser)
            }
    
            return done(null, user)
        } catch (error) {
            console.log(error)
            done(error)
        }
    }));

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = Users.findById(id)
    done(null, user)
  })

module.exports = initializePassport