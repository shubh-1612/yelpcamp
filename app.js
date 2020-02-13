var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStratergy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./Models/campground"),
    Comment = require("./Models/comment"),
    User = require("./Models/user")
    seedDB = require("./seeds");

var commentRoutes = require("./Routes/comments"),
    campgroundRoutes = require("./Routes/campgrounds"),
    indexRoutes = require("./Routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
//mongoose.connect("mongodb+srv://Shubh:spuderman@cluster0-3wqcs.mongodb.net/test?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/Public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
// seedDB();

app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
	next();
});

app.get("/",function(req,res){
	res.render("landing");
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT || 3000,function(){
	console.log("Server started");
}); 

