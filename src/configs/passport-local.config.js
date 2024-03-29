const passport = require('passport');
const local = require('passport-local');
const Users = require('../models/users.models');
const { createHash, useValidPassword } = require('../utils/crypt-password.util');
const { createUser } = require('../services/users.service');

const LocalStrategy = local.Strategy;

const initializePassportLocal = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email } = req.body;
                const user = await Users.findOne({ email: email });

                if (user) {
                    console.log('User exists');
                    return done(null, false);
                }

                const newUserInfo = createUser(req.body)

                //const newUser = await Users.create(newUserInfo);
                return done(null, newUserInfo);

            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    ));
};

module.exports = initializePassportLocal;
