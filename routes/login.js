const express = require('express');
const router = express.Router();
const session = require('../db');
const passport = require('passport');
const utils = require('../lib/util');

router.post('/', (req, res)=>{
    console.log(req.body.password)
    session.run(`MATCH (u:User {email: "${req.body.email}" }) RETURN u AS user`).subscribe({
        onNext: (record) => {
            const password = req.body.password;
            const hash = record.get('user').properties.hash;
            const salt = record.get('user').properties.salt;
            const isValid = utils.validPassword(password,hash,salt);

            if(isValid){
                const tokenObject = utils.issueJWT(record.get('user').properties);
                res.status(200).json({succes: true, token:tokenObject, expiresIn: tokenObject.expires, msg: "Użytkownik został zalogowany"})
            }else{
                res.status(401).json({succes: false, msg: "Błedne hasło"});
            }
        },
        onCompleted: () => {session.close()},
        onError: (error) => {
            console.log(error);
            res.status(401).json({succes:false, msg: "Nie istnieje użytkownik o podanym adresie e-mail"});
        }
    })
})

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res)=>{
    res.status(200).json({ succes: true, msg: "Posiadasz dostęp"})
})

module.exports = router;