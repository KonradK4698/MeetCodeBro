const express = require('express');
const router = express.Router();
const driver = require('../db');

const getDataWithoutSaltHash = (userDataInfo) => {
    const userDataProperties = userDataInfo.properties;
    let propertiesWithoutSaltHash = {};
        for(const key in userDataProperties){
            if(userDataProperties.hasOwnProperty(key) && key !== "hash" && key !== "salt"){
                propertiesWithoutSaltHash[key] =  userDataProperties[key];
            }
        }
    
    const userDataID = userDataInfo.identity.low;
    propertiesWithoutSaltHash.id = userDataID;
    
    const userDataInfoJSON = propertiesWithoutSaltHash;

    return userDataInfoJSON
}

//wyświetl wszystkie zaproszenia
router.get('/getInvitation/:ID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.ID; 
    let invitationsArr = [];
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)<-[i:InviteToFriends]-() RETURN i AS invitations`).subscribe({
        onNext: (data) => {
            const newInvitation = data.get('invitations');
            invitationsArr.push(newInvitation) 
        },
        onCompleted: ()=>{res.status(200).send(invitationsArr); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//wyślij użytkownikowi prośbę o dodanie do znajomych
router.post('/sendInvitation/:senderID/:recipentID', (req,res)=>{
    const session = driver.session();
    const senderID = req.params.senderID;
    const recipentID = req.params.recipentID;
    console.log(`Sender: ${senderID} Recipent: ${recipentID}`)
    session.run(`MATCH (sender:User), (recipent:User) WHERE ID(sender) = ${senderID} AND ID(recipent) = ${recipentID} CREATE (sender)-[i:InviteToFriends]->(recipent) RETURN type(i) AS type`).subscribe({
        onNext: (data) => {console.log(data.get('type'))},
        onCompleted: ()=>{res.status(200).send(JSON.stringify("Zaproszenie wysłane")); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//odrzuć (usuń) prośbę o dodanie do znajomych
router.delete('/deleteInvitation/:userID/:friendID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.userID;
    const friendID = req.params.friendID;
    session.run(`MATCH (u:User), (u2:User) WHERE ID(u) = ${userID} AND ID(u2) = ${friendID} MATCH (u)-[i:InviteToFriends]-(u2) WHERE (i IS NOT NULL = true) DELETE i RETURN true AS confirmation`).subscribe({
        onNext: (data) => {console.log(data.get('confirmation'))},
        onCompleted: ()=>{console.log("Usunięto relację"); res.end(); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//wyświetl wszystkich przyjaciół
router.get('/:userID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.userID; 
    const friendsList = [];
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)-[f:IsFriend]->() RETURN f AS friends`).subscribe({
        onNext: (data) => {
            const getFriend = data.get('friends');
            const newFriend = {
                relationID: getFriend.identity.low,
                friendID: getFriend.end.low,
                relationType: getFriend.type,
                properties: getFriend.properties
            }
            friendsList.push(newFriend)
        },
        onCompleted: ()=>{console.log("Pobrano relacje"); res.status(200).send(friendsList); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//dodaj do listy przyjaciół 
router.post('/:senderID/:recipentID', (req,res)=>{
    const session = driver.session(); 
    const recipentID = req.params.recipentID;
    const senderID = req.params.senderID; 
    session.run(`MATCH (sender: User), (recipent: User) WHERE ID(sender) = ${senderID} AND ID(recipent) = ${recipentID} CREATE (sender)-[f1:IsFriend]->(recipent), (recipent)-[f2:IsFriend]->(sender) RETURN true AS confirmation`).subscribe({
        onNext: (data) => {console.log(data.get('confirmation'))},
        onCompleted: ()=>{console.log("Dodano użytkownika do przyjaciół"); res.end(); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//usuń użytkownika ze znajomych
router.delete('/:userID/:friendID', (req,res)=>{
    const session = driver.session(); 
    const userID = req.params.userID; 
    const friendID = req.params.friendID; 
    session.run(`MATCH (user: User), (friend: User) WHERE ID(user) = ${userID} AND ID(friend) = ${friendID} MATCH (user)-[f:IsFriend]-(friend) DELETE f RETURN COUNT(f) AS deletedRelationCount`).subscribe({
        onNext: (data) => {console.log(data.get('deletedRelationCount'))},
        onCompleted: ()=>{console.log("Usunięto przyjaciela"); res.end(); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//sprawdź jaka relacja istnieje pomiędzy użytkownikami
router.get('/checkRelation/:userID/:friendID', (req,res)=>{
    const session = driver.session(); 
    const userID = req.params.userID; 
    const friendID = req.params.friendID; 
    let relation = []
    session.run(`MATCH (u:User)-[r]-(f:User) WHERE ID(u) = ${userID} AND ID(f) = ${friendID} RETURN collect(r) AS relation`).subscribe({
        onNext: (data) => {relation = data.get('relation')},
        onCompleted: () => {res.status(200).send(relation)},
        onError: (err) => {console.log(err)}
    })
})

//znajdź porponowanych znjaomych na podstawie znajomych przyjaciół
router.get('/suggestFriends/:userID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.userID;
    const usersArray = [];
    session.run(`MATCH q=(u:User)-[:IsFriend*1..3]->(u2:User) WHERE ID(u) = ${userID} AND ID(u2) <> ${userID} RETURN DISTINCT u2 As user`).subscribe({
        onNext: (data) => {
            const getUser = data.get('user');
            const userData = getDataWithoutSaltHash(getUser);
            usersArray.push(userData);
        },
        onCompleted: () => {res.status(200).send(usersArray); session.close()},
        onError: (err) => {console.log(err)}
    })
})

module.exports = router;