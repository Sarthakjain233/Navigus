var express = require("express"),
	router = express.Router(),
	middleware = require("../middleware"),
	Event = require("../models/event");

router.get("/",function(req,res){
	Event.find({},function(err,allevents){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{events : allevents});
		}
	});
});


router.post("https://calendar.google.com/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var date = req.body.date;
  var desc = req.body.desc;
  var author = {
	   id : req.user._id,
	  username : req.user.username
  };
  var newEvent ={name: name ,date:date, desc :desc ,author : author};
  // Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth
// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
)

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = date;


// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 60)

// Create a dummy event for temp uses in our calendar
const event = {
  summary: name,
  description: desc,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: eventEndTime,
    timeZone: "Asia/Kolkata",
  },
}
Event.create(newEvent, function(err, newlyCreated){
        if(err){
            req.flash(err);
        } else {
		  console.log(newlyCreated);
          res.redirect("/event");
        }
    });
});


router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("new");
});

router.get("/book", middleware.isLoggedIn,function(req,res){
	Event.findById(req.params.id,function(err,foundEvent){
		if(err){
				res.redirect("/event");
		}else{
		  res.render("book",{event : foundEvent});
		}
	});
});

router.post("/book",function(req, res){
	var email = req.body.email;
	var book = {email : email};
	var sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		var msg = {
					  to: email,
					  from: 'jainsarthak233@gmail.com',
					  subject: "Booked A Meeting",
					  text: "Your Meeting is fixed",
					  html: "Your Meeting is fixed",
					};
			sgMail.send(msg);
});  
	

module.exports = router;