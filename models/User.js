const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	image: {
		type: String,
		required: false,
		default: "https://m3alem-masr.herokuapp.com/images/default.webp",
		trim: true
	},
	password: {
		type: String,
		required: true,
		min: 6,
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("User", userSchema);
