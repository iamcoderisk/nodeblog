const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("./database");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
	//local strategy
	passport.use(
		new LocalStrategy(function(username, password, done) {
			let query = {
				username: username
			};
			User.findOne(query, function(err, user) {
				if (err) throw err;
				if (!user) {
					return new done(null, false, { message: "No user found" });
				}
				//match password using bcrypt
				bcrypt.compare(password, user.password, function(err, isMatch) {
					if (isMatch) {
						return done(null, user);
					} else {
						return new done(null, false, { message: "Wrong credentials" });
					}
				});
			});
		})
	);
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
