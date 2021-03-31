const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const cars = require("./routes/cars");

MongoClient.connect("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.1ybr6.mongodb.net/bootcamp_project2?retryWrites=true&w=majority", function(err, client) {
    if ( err != null ) {
        res.send(err);
        return;
    } 

    app.locals.db = client.db("bootcamp_project2");
    console.log("Connected to database...");
});

app.use(express.static("public"));
app.use(express.json());

app.use("/api/cars/", cars);


app.listen(3000);