'use strict';
const MB = 1024 * 1024;
const express = require("express");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database");
mongoose.connect(
	config.database,
	{ useNewUrlParser: true }
);
// mongoose.connect(
// 	"mongodb://localhost:27017/nodekb",

// );
var path = require("path");

var Article = require("./models/article");
var db = mongoose.connection;
//check for db errors
db.on("error", err => {
	console.log(err);
});
//check if it's conencted
db.once("open", () => {
	console.log("connected to mongo db");
});
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// var express = require("express");
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//set static folder
app.use(express.static(path.join(__dirname, "/public/")));

//express session middleware
app.use(
	session({
		secret: "keyboard cat",
		resave: true,
		saveUninitialized: true
	})
);
//express messages
app.use(require("connect-flash")());
app.use(function(req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});
//express validator
app.use(
	expressValidator({
		errorFormatter: function(param, msg, value) {
			var namespace = param.split("."),
				root = namespace.shift(),
				formParam = root;
			while (namespace.length) {
				formParam += "[" + namespace.shift() + "]";
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);

//passport configuration
require("./config/passport")(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.get("*", (req, res, next) => {
	res.locals.user = req.user || null;
	next();
});
app.get("/", (req, res) => {
	Article.find({}, (err, articles) => {
		if (err) {
			console.log("error occured");
		} else {
			res.render("index", {
				title: "Articles",
				articles: articles
			});
		}
	});
});
var articles = require("./routes/articles");
var users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);
/***
 *
 *  app.user({
 * 	"/articles",
 * "/useres"
 *
 * },{
 * articles,
 * users
 * });
 */
app.listen(3000, function() {
	console.log("development server started");
});
