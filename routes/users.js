const { ObjectID } = require("bson");
const express = require("express");
const router = express.Router();

// Bcrypt for password encryption
const bcrypt = require("bcrypt");


function cypherPasswords(req, res, next) {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    req.body = user;
    next();
}

// Get user with given id
router.get("/id/:id", ( req, res ) => {

    let db = req.app.locals.db;

    id = new ObjectID(req.params.id)

    db.collection("users").findOne( { "_id": id },  (err, user ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( !user ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: user } )
    });
});


// Get user with given email
router.get("/email/:email", ( req, res ) => {

    let db = req.app.locals.db;

    email = req.params.email;


    db.collection("users").findOne( { "email": email },  (err, user ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( !user ) {
            res.send( { msg: "Database is empty" } );
            return;
        }

        res.send( { results: user } )
    });
});

// Update password of user certain ID
router.put("/password", cypherPasswords, ( req, res ) => {

    let db = req.app.locals.db;

    const userId = new ObjectID(req.body._id);
    const newPassword = req.body.password;
    const currentDate = new Date();


    db.collection("users").updateOne( { "_id": userId }, { $set: { "password": newPassword, "password_modified": currentDate } },  (err, info ) => {
        if ( err !== null ) {
            res.send(err);
        }

        if ( !info.result.nModified === 0 ) {
            res.send( { "msg": "No entry was modified"} );
            return;
        }

        res.send( { nModified: info.result.nModified } )
    });
});

module.exports = router;