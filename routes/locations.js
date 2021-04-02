const express = require("express");
const router = express.Router();


// Get all results for countries
router.get("/countries", ( req, res ) => {

    let db = req.app.locals.db;

    db.collection("humans").distinct("currently_in.country", (err, allCountries ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allCountries.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allCountries } )
    });
});


// Get all results for cities
router.get("/cities", ( req, res ) => {

    let db = req.app.locals.db;

    db.collection("humans").distinct("currently_in.city", (err, allCities ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allCities.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allCities } )
    });
});



module.exports = router;