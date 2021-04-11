const express = require("express");
const app = express();

// Import routes
const humans = require("./routes/humans");
const locations = require("./routes/locations");
const users = require("./routes/users");

// For environment variables
require("dotenv").config();

// Bcrypt for password encryption
const bcrypt = require("bcrypt");


// Database initialization
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@sandbox.1ybr6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useUnifiedTopology: true },
  function(err, client, res) {
    
    if ( err != null ) {
        res.send(err);
    } 

    app.locals.db = client.db("bootcamp_project2");
    console.log(`Connected to database...`);
});

// Express middleware
app.use(express.static("public"));
app.use(express.json());

// External routes
app.use("/api/humans/", humans);
app.use("/api/locations/", locations);
app.use("/api/users/", users);

// Express session
const expressSession = require("express-session")({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
app.use(expressSession);

// Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    function (email, password, done) {

      app.locals.db.collection("users")
        .find({ email: email })
        .toArray(function (err, users) {
          if (users.length === 0) {
            return done(null, false);
          }
          const user = users[0];
          
          if ( bcrypt.compareSync(password, user.password ) ) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});


passport.deserializeUser(function (email, done) {
  app.locals.db.collection("users")
    .find({ email: email })
    .toArray(function (err, users) {
      if (users.length === 0) {
        console.log("0 users");
        done(null, null);
      }
      console.log("1 user");
      done(null, users[0]);
    });
});

// Route to check if user is logged
app.get("/api/check", (req, res) => {
  if ( req.session.passport ) {
    console.log("Logged: ", req.session.passport)
    res.send( { isLogged: true } );
    return;
  }
  console.log("Logged: ", req.session.passport)
  res.send( { isLogged: false } );

});

app.post("/api/signin", function (req, res) {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const name = req.body.name;
  const surname = req.body.surname;
  const dateCreation = new Date();
  

  app.locals.db.collection("users")
    .findOne({ "email": email }, (err, user) => {

      if ( !user ) {
        app.locals.db.collection("users").insertOne(
          {
            name,
            surname,
            email,
            password,
            date_creation: dateCreation
          },
          (err, respuesta) => {

            if (err !== null) {
              res.send({  new_user: false, success: false, msg: "An error occurred: " + err });
            } else {
              res.send({ new_user: true, success: true, msg: "User was registered" });
            }
          }
        );
      } else {
        res.send({ new_user: false, msg: "User is already registered" });
      }
    });
});

app.post("/api/login",
    passport.authenticate("local", {
      successRedirect: "/success",
      failureRedirect: "/fail",
    })
);

app.get("/success", (req, res) => {
    res.send({ loginDataCorrect: true, msg: "Login successful", user: req.user, session: true });
});

app.get("/fail", (req, res) => {
res.send({ loginDataCorrect: false, msg: "Wrong user or password", session: false });
});

app.put("/api/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.send({ loggedOut: true, msg: "Logout successful" });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));