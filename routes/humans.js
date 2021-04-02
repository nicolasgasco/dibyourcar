const express = require("express");
const router = express.Router();


// Get all results
router.get("/", ( req, res ) => {

    let db = req.app.locals.db;

    db.collection("humans").find().toArray( (err, allHumans ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allHumans.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allHumans } )
    });
});

// Insert new human
router.post("/", ( req, res ) => {

    let db = req.app.locals.db;

    const newHuman = req.body;

    db.collection("humans").insertOne( newHuman, (err, result ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        res.send( { results: result.ops } )
    });
});



module.exports = router;