var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	flash= require("connect-flash"),
	User = require("../models/user");

router.get("/",function(req,res){
	res.render("main");
});

router.get("/register",function(req,res){
	res.render("register",{page : "register"});
});

router.post("/register",function(req,res){
	var newUser = new User({username : req.body.username, email: req.body.email});
	User.register(newUser,req.body.password,function(err,data){
		if(err){
			console.log(err);
			return res.render("register",{error : err.message});
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/event");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login")
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/event",
	failureRedirect:"/login",
	failureFlash: true,
	successFlash: "Welcome"
	
}),function(req,res){
});


router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logout Successfully");
	res.redirect("/");
});

module.exports = router;
	