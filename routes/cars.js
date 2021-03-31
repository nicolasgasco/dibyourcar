const express = require("express");
const router = express.Router();


router.get("/", ( req, res ) => {

    let db = req.app.locals.db;

    db.collection("cars").find().toArray( (err, allCars ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        if ( allCars.length === 0 ) {
            res.send( { msg: "Database is empty" } );
        }

        res.send( { results: allCars } )
    });
});


router.post("/", ( req, res ) => {

    let db = req.app.locals.db;

    const newCar = req.body;

    db.collection("cars").insertOne( newCar, (err, result ) => {
        if ( err !== null ) {
            res.send(err);
        }
        
        res.send( { results: result.ops } )
    });
});



module.exports = router;