const express = require("express");
const router = express.Router();


// Get the id of current user
router.get("/", ( req, res ) => {

    let db = req.app.locals.db;

    db.collection("current_user").findOne( (err, currentUser ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( !currentUser ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: currentUser } )
    });
});

module.exports = router;