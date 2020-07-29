require('dotenv').config();
var express = require("express"),
	app = express(),
	mongoose   = require("mongoose"),
	passport   = require("passport"),
	LocalStrategy= require("passport-local"),
    methodOverride = require("method-override"),
	User = require("./models/user"),
	flash = require("connect-flash"),
	Event = require("./models/event"),
	bodyParser = require("body-parser");

var authRoutes = require("./routes/auth"),
	eventRoutes = require("./routes/event");

mongoose.connect("mongodb://localhost:27017/Calendar2", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require("moment");

//passport configure
app.use(require("express-session")({
	secret:"This is Calendar",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error	   = req.flash("error");
	res.locals.success	   = req.flash("success");
	next();	
});
app.use("/event",eventRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000,process.env.IP, function(){
	console.log("Calender Started");
});

	
