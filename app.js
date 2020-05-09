var express      = require("express"),
	app 	     = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose"),
	flash        = require("connect-flash"),
	Campground   = require("./models/campground"),
	seedDB       = require("./seed"),
	Comment      = require("./models/comments"),
	passport     = require("passport"),
	LocalStrategy= require("passport-local"),
	User         = require("./models/user");
	methodOverride = require("method-override");

//requiring routes
var commentRoutes 	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes 	 = require("./routes/index");

//seedDB();
mongoose.connect('mongodb://localhost/yelp_camp_v9', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again this is a secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function() {
	console.log("App is live!");
});