const express = require('express');
const router = express.Router();
const driver = require('../db');

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
router.post('/sendInvitation/:ID', (req,res)=>{
    const session = driver.session();
    const senderID = req.body.ID;
    const recipentID = req.params.ID;
    session.run(`MATCH (sender:User), (recipent:User) WHERE ID(sender) = ${senderID} AND ID(recipent) = ${recipentID} CREATE (sender)-[i:InviteToFriends]->(recipent) RETURN type(i) AS type`).subscribe({
        onNext: (data) => {console.log(data.get('type'))},
        onCompleted: ()=>{console.log("Utworzono relację"); res.end(); session.close()},
        onError: (err)=>{console.log(err)}
    })
})

//odrzuć (usuń) prośbę o dodanie do znajomych
router.delete('/deleteInvitation/:userID/:invID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.userID;
    const invitationID = req.params.invID;
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)-[i:InviteToFriends]-() WHERE (i IS NOT NULL = true AND ID(i) = ${invitationID}) DELETE i RETURN true AS confirmation`).subscribe({
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

module.exports = router;