const passport = require('passport');
const jwt = require('passport-jwt');
const Users = require('../models/users.models');
const cookieExtractor = require('../utils/cookie-extractor.util');

const JWTStrategy = jwt.Strategy;

const initializePassportJwt = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'MiCodigo',
    },
    (jwt_payload, done) => {
        try {
            done(null, jwt_payload);
        } catch (error) {
            done(error);
        }
    }));
};

module.exports = initializePassportJwt;
