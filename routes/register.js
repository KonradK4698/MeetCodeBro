
const express = require('express');
const router = express.Router();
const driver = require('../db');
const session = driver.session();
const utils = require('../lib/util');



const registerUser = async (txc, userEmail, userPassword, res)=>{
        let userCount = 0; // zmienna przechowująca zwróconą ilośc użytkowników

        //sprawdzenie czy istnieje użytkownik o podanym adresie e-mail
        const userCountResult = await txc.run(`MATCH (u:User {email: "${userEmail}" }) RETURN count(u) AS userCount`);
        userCountResult.records.forEach(r => userCount = r.get('userCount').low);

        //jesli istnieje wysłać błąd
        if(userCount > 0){
            txc.commit()
            console.log("Użytkownik już istnieje");
            res.status(409);
            res.send("Użytkownik już istnieje")
        } else { 
            // jeśli nie istnieje utworzyć nowego użytkownika
            
            //generowanie zahaszowanego hasła
            const hashPassword = utils.generatePassword(userPassword);
            const salt = hashPassword.salt;
            const hash = hashPassword.hash;

           //dodanie użytkownika do bazy danych
           await txc.run(`CREATE (u:User {email:"${userEmail}", salt: "${salt}", hash: "${hash}" })`).subscribe({
                onCompleted: () => {txc.commit(); res.status(201).end();},
                onError: error => {console.log(error)}
            });

        }
    
}

// const testDB = () => {
//     let data;
//     session.run(`MATCH (u:User {email: "kwakus18@gmail.com" }) RETURN u AS user`).subscribe({
//         onNext: record => { data = record.get('user').properties.email; console.log("data") },
//         onCompleted: () => { session.close()},
//         onError: error => console.log(error)
//     })

    
// }

// testDB();
//add new user to db -  route
router.post('/',  async (req,res)=>{
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const txc = session.beginTransaction();
    await registerUser(txc, userEmail, userPassword, res);
});

// router.get('/', async (req,res)=>{
//     testDB();
//     // console.log(testDB());
//     res.send("Działa");
//     res.end();
// })

    


module.exports = router;

