var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../Models/campground"),
    Comment = require("../Models/comment"),
    middleware = require("../Middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){ //NEW nested inside SHOW page
	Campground.findById(req.params.id,function(err,campground){
		if (err){
			console.log("ERROR");
		}
		else {
			res.render("Comments/new",{campground: campground});
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){ //CREATE nested inside SHOW page
	Campground.findById(req.params.id,function(err,campground){
		if (err){
			console.log("ERROR");
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment,function(err,comment){
				if (err){
					req.flash("error","Something went wrong");
					console.log("ERROR");
				}
				else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){ //EDIT nested inside SHOW page
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if (err){
			res.redirect("back");
		}
		else {
			res.render("Comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){ //UPDATE nested inside SHOW page
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if (err){
			res.redirect("back");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){ //DELETE nested inside SHOW page
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if (err){
			res.redirect("back");
		}
		else {
			req.flash("success","Comment deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router;