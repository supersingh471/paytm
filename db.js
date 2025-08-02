const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://cohort2:supersingh471@cohort2.6d1abj6.mongodb.net/");

const userSchema = mongoose.Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String,
})

const User = mongoose.model("User", username);

module.exports = {
	User
}; 