const express = require("express");
const app = express();

// API routes
const humans = require("./routes/humans");
const locations = require("./routes/locations");
const current_user = require("./routes/current_user");


// Database initialization
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(`mongodb+srv://m001-student:${process.env.MONG_PASS}@sandbox.1ybr6.mongodb.net/bootcamp_project2?retryWrites=true&w=majority`, function(err, client) {
    
    if ( err != null ) {
        res.send(err);
    } 

    app.locals.db = client.db("bootcamp_project2");
    console.log(`Connected to database...`);
});

app.use(express.static("public"));
app.use(express.json());

// External routes
app.use("/api/humans/", humans);
app.use("/api/locations/", locations);
app.use("/api/currentuser/", current_user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));