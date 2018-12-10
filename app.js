const express = require("express");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
mongoose.connect("mongodb://localhost/nodekb");
mongoose.connect(
	"mongodb://localhost:27017/nodekb",
	{ useNewUrlParser: true }
);
var path = require("path");

let Article = require("./models/article");
let db = mongoose.connection;
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
let articles = require("./routes/articles");
app.use("/articles", articles);
app.listen(3000, function() {
	console.log("development server started");
});
