const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	info: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
	ups: { type: Array, default: [] },
	downs: { type: Array, default: [] },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});
module.exports = mongoose.model("Post", postSchema);
