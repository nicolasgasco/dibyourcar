const express = require("express");
const router = express.Router();


// Get all humans
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

// Get all humans per country
router.get("/:country", ( req, res ) => {

    let db = req.app.locals.db;

    let country = req.params.country; 

    let searchFilterObject;

    // When "All cities" is selected, search must be done per country and not city
    if ( country !== "All" ) {
        searchFilterObject = { "currently_in.country" : country };
    }

    db.collection("humans").find( searchFilterObject ).toArray( (err, allHumans ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allHumans.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allHumans } )
    });
});

// Get all humans per city
router.get("/:country/:city", ( req, res ) => {

    let db = req.app.locals.db;

    let country = req.params.country;
    let city = req.params.city;
    
    let searchFilterObject;

    // When "All cities" is selected, search must be done per country and not city
    if ( city === "Null" ) {
        searchFilterObject = { "currently_in.country" : country };       
    } else {
        searchFilterObject = { "currently_in.city" : city };
    }

    db.collection("humans").find( searchFilterObject ).toArray( (err, allHumans ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allHumans.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allHumans } )
    });
});

// Insert new story
router.post("/", ( req, res ) => {

    let db = req.app.locals.db;

    const newStory = req.body;

    db.collection("humans").insertOne( newStory, (err, result ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        res.send( { results: result.ops } )
    });
});

module.exports = router;