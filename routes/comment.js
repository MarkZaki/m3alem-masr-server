const router = require("express").Router();
const Comment = require("../models/Comment");
const AuthFunc = require("./verifyToken");
const { newCommentValidation } = require("../validation");

router.post("/", AuthFunc, async (req, res) => {
	const postId = req.body.post;
	const comments = await Comment.find({ post: postId }).populate(
		"user",
		"name email image"
	);
	if (comments) return res.json(comments);
	else return res.json([]);
});

router.post("/add", AuthFunc, async (req, res) => {
	const { error } = newCommentValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	const comment = new Comment({
		text: req.body.text,
		post: req.body.post,
		user: req.user.id,
		likes: []
	});
	try {
		const newComment = await comment.save();
		const fetchedComment = await Comment.findById(newComment._id).populate(
			"user",
			"name email image"
		);
		return res.send(fetchedComment);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

module.exports = router;
