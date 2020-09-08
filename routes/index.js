var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function (req, res) {
	res.render("landing");
});

//=============
//Auth Routes
//=============
//show register form
router.get("/register", function (req, res) {
	res.render("register");
});

//sign up logic
router.post("/register", function (req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash("error", err.message);
			res.render("register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to Texas Parks " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function (req, res) {
	res.render("login", { page: 'login' });
});

//login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: 'Welcome to Texas Parks!'
	}), function (req, res) {
	});

//Logout Route
router.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
});

module.exports = router;
