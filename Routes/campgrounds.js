var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../Models/campground"),
    middleware = require("../Middleware");

router.get("/",function(req,res){ //INDEX
	Campground.find({},function(err,allCampgrounds){
		if (err){
			console.log("ERROR");
		}
		else {
			res.render("Campgrounds/index",{campgrounds: allCampgrounds});
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){ //CREATE
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground,function(err,newlyCreated){
		if (err){
			console.log("ERROR");
		}
		else {
			res.redirect("/campgrounds");
		}
	});	
});

router.get("/new",middleware.isLoggedIn,function(req,res){ //NEW
	res.render("Campgrounds/new");
});

router.get("/:id",function(req,res){ //SHOW
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if (err){
			console.log("ERROR");
		}
		else {
			console.log(foundCampground);
			res.render("Campgrounds/show",{campground: foundCampground});
		}
	});
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){ //EDIT
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("Campgrounds/edit",{campground: foundCampground});
	});
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){ //UPDATE
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if (err){
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){ //DESTROY
	Campground.findByIdAndRemove(req.params.id,function(err){
		if (err){
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;