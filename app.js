const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cars = require("./cars");


app.use(express.static("public"));
app.use(express.json());

app.use("/api/cars", cars);


app.listen(3000);