const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
let User = require("../models/user");

router.get("/register", (req, res) => {
	res.render("register", {
		title: "Register User"
	});
});

router.post("/register", (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;
	req.checkBody("name", "Full name is required").notEmpty();
	req.checkBody("email", "User email is requied").notEmpty();
	req.checkBody("username", "Username is required").notEmpty();
	req.checkBody("password", "Password cannot be blank").notEmpty();
	req.checkBody("password2", "Password do not match").equals(req.body.password);
	let errors = req.validationErrors();

	if (errors) {
		res.render("register", {
			title: "Register",
			errors: errors
		});
	} else {
		let user = new User({
			name: name,
			username: username,
			email: email,
			password: password
		});
		bcrypt.genSalt(20, function(err, salt) {
			bcrypt.hash(user.password, salt, (error, hash) => {
				if (err) {
					console.log(err);
					// return;
				}
				user.password = hash;
				user.save(function(err) {
					if (err) {
						console.log(err);
						return;
					} else {
						req.flash("success", "Registration successful!");
						res.redirect("/users/login");
					}
				});
			});
		});
	}
});
//login form
router.get("/login", (req, res) => {
	res.render("login");
});
//login process
router.post("/login", function(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});
module.exports = router;
