var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var BookSchema = new mongoose.Schema({
	email :{type: String, unique: true,required: true},
});

BookSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Book",BookSchema);