var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleware = require("../middleware")


//INDEX ROUTE - show all campgrounds
router.get("/", function(req, res) {
	// get all campgrounds from DB
	Campground.find({}, function(error, allCampgrounds) {
		if(error) {
			console.log(error)
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
});

//CREATE ROUTE- add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
//get data from form and add to campground array
	var name = req.body.name
	var image = req.body.image
	var desc = req.body.description
	var price = req.body.price
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description:desc, author:author};
	//create a new and save to db
	Campground.create(newCampground, function(error, newlyCreated) {
		if(error) {
			console.log(error) 
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(
		function(error, foundCampground) {
		if(error) {
			console.log(error);
		} else {
			//render SHOW template
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){	
		res.render("campgrounds/edit", {campground: foundCampground});			
	});
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect
})

//DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
