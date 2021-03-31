const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const cars = require("./routes/cars");

const mongoPassword = process.env.MONG_PASS;

MongoClient.connect(`mongodb+srv://m001-student:${mongoPassword}@sandbox.1ybr6.mongodb.net/bootcamp_project2?retryWrites=true&w=majority`, function(err, client) {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));