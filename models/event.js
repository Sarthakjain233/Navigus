var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var EventSchema = new mongoose.Schema({
	name:String,
	date: String,
	desc: String,
	author:{
		id : {
				type : mongoose.Schema.Types.ObjectId,
				ref : "User"
		  },
		username : String
	}
});

EventSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Event",EventSchema);