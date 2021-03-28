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
	if (comments)
		return res.json(comments.sort((a, b) => b.likes.length - a.likes.length));
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

router.put("/", AuthFunc, async (req, res) => {
	const commentId = req.body.id;
	const userId = req.user.id;

	const comment = await Comment.findById(commentId);

	if (!comment) res.status(401).send({ error: "Something went wrong!" });

	const likes = comment.likes;

	if (!likes.includes(userId)) {
		likes.push(userId);
	} else {
		for (let i = 0; i < likes.length; i++) {
			if (likes[i] === userId) {
				likes.splice(i, 1);
			}
		}
	}

	const updatedComment = await Comment.findByIdAndUpdate(
		{ _id: commentId },
		{
			likes: likes
		},
		{ new: true }
	);
	return res.send(updatedComment);
});

module.exports = router;
