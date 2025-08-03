const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://cohort2:supersingh471@cohort2.6d1abj6.mongodb.net/paytm");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
});

const accountSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	balance: {
		type: Number,
		required: true
	}
});


const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
	User,
	Account
}; 