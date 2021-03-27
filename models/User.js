const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6
	},
	email: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false,
		default: "https://m3alem-masr.herokuapp.com/images/default.webp"
	},
	password: {
		type: String,
		required: true,
		min: 6
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("User", userSchema);
