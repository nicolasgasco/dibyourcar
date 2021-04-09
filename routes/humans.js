const { ObjectID } = require("bson");
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


// Find one specific story
router.get("/find/:id", ( req, res ) => {

    let db = req.app.locals.db;

    let id = new ObjectID(req.params.id); 

    db.collection("humans").findOne( {"_id": id}, (err, post ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( !post ) {
            res.send( { msg: "Post doesn't exist" } );
        }

        res.send( { results: post } )
    });
});

// Get all humans per country
router.get("/:country", ( req, res ) => {

    let db = req.app.locals.db;

    let country = req.params.country; 

    // This route exploits the fact that if this object is undefined, the search gives back all results
    // It is a failsafe, frontend uses other more generic route when no country is provided
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

// Get all humans submitted by same user
router.get("/user/:id", ( req, res ) => {

    let db = req.app.locals.db;

    // Id of submitter for filtering
    let id = req.params.id;

    db.collection("humans").find( {"submittedBy" : id} ).toArray( (err, allHumans ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allHumans.length === 0 ) {
            res.send( { "foundStories": false, msg: "Database is empty" } );
            return;
        }

        res.send( { "foundStories": true, results: allHumans } )
    });
});


// Hacer esto con queries country=country&city=city req.query
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

// Delete one specific story
router.delete("/:id", ( req, res ) => {

    let db = req.app.locals.db;

    const id = new ObjectID(req.params.id);

    db.collection("humans").deleteOne( {"_id": id}, (err, result ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        res.send( { deletedCount: result.deletedCount } )
    });
});


// Edit one story
router.put("/:id", ( req, res ) => {

    let db = req.app.locals.db;

    const id = new ObjectID(req.params.id);

    const newObject = req.body;

    db.collection("humans").replaceOne( {"_id": id}, newObject, (err, result ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        res.send( { results: result } )
    });
});

module.exports = router;