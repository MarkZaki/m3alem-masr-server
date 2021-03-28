const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	info: {
		type: String,
		required: true,
		trim: true
	},
	position: {
		type: String,
		required: true,
		trim: true
	},
	likes: { type: Array, default: [] },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});
module.exports = mongoose.model("Post", postSchema);
