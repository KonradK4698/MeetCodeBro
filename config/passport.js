const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const session = require('../db');
const path = require('path');


const pathToKey = path.join(__dirname, '..',  'pubKey.pem');

const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};



module.exports = (passport) => {
    passport.use(new JwtStrategy(options, function(jwt_payload, done){
        session.run(`MATCH (u:User {email: "${jwt_payload.sub}" }) RETURN u AS user`).subscribe({
            onNext: record => { const user = record.get('user').properties; done(null, user);},
            onCompleted: () => { session.close()},
            onError: error => { done(error, null) }
        })
    }))
}