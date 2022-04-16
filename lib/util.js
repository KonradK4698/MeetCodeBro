const crypto = require('crypto');
const jasonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'privKey.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

function validPassword(password, hash, salt){
    const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function generatePassword(password){
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return {
        salt: salt, 
        hash: genHash
    };
}

function issueJWT(user){
    const email = user; 
    const momentExpiresNumber = 1; // czas w jakim token zostanie nieaktwyny, zmienna wymagana do moment() js, angular auth.service
    const momentExpiresKey = 'd'; // klucz określający w jakiej jednostce czasu token zostanie dezaktywowany, zmienna wymagana do moment() js angular auth.service
    const expiresIn = momentExpiresNumber + momentExpiresKey; // zmienna określająca czas dezaktywacji tokena, dla JWT sign poniżej

    const payload = {
        sub: email, 
        iat: Date.now()
    }

    const signedToken = jasonwebtoken.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'});

    return {
        token: `Bearer ${signedToken}`,
        momentNumber: momentExpiresNumber,
        momentKey: momentExpiresKey
    }
}

module.exports.validPassword = validPassword;
module.exports.generatePassword = generatePassword;
module.exports.issueJWT = issueJWT;