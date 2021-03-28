const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
		trim: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model("Comment", commentSchema);
