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

// Get all humans
router.get("/:country/:city?", ( req, res ) => {

    let db = req.app.locals.db;

    let country = req.params.country;
    country = country.charAt(0).toUpperCase() + country.substring(1).toLowerCase();
    

    let city = req.params.city;
    ( city ) ? city = city.charAt(0).toUpperCase() + city.substring(1).toLowerCase() : city = null; 
    
    let searchFilterCountry = { "currently_in.country" : country};
    let searchFilterCity;
    if ( city ) {
        searchFilterCity = { "currently_in.city" : city};
    }

    db.collection("humans").find( searchFilterCountry, searchFilterCity ).toArray( (err, allHumans ) => {
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