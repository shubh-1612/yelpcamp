var mongoose = require("mongoose"),
    Campground = require("./Models/campground.js"),
    Comment = require("./Models/comment.js");

var data = [
	{
		name: "Cloud's rest",
		image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"

	},
	{
		name: "Desert Mesa",
		image: "https://image.shutterstock.com/image-photo/autumn-tent-camping-zion-national-260nw-80585230.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"

	},
	{
		name: "Canyon Floor",
		image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"

	}
]

function seedDB(){
	Campground.deleteMany({},function(err){
		if (err){
			console.log("ERROR");
		}
		console.log("Removed all campgrounds");
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
                if (err){
                	console.log("ERROR");
                }
				else {
					console.log("Added a campground");
					Comment.create(
					{
						text: "This place is great, but I wish there was internet",
						author: "Homer"
					}, function(err,comment){
						if (err){
							console.log("ERROR");
						}
						else {
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						}			
					});
				}
			});
		});
	});
}

module.exports = seedDB;