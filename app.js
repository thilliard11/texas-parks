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
mongoose.connect('mongodb+srv://thilliard:%21tuW4%23%40WUS9ZJCt@cluster0-luarx.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true, 
	useUnifiedTopology: true
})
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

app.listen(process.env.PORT || 3000, function() {
	console.log("App is live!");
});