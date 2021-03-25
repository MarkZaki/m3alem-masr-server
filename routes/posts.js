const router = require("express").Router();
const Post = require("../models/Post");
const AuthFunc = require("./verifyToken");
const { newPostValidation } = require("../validation");

router.get("/", AuthFunc, async (req, res) => {
	const posts = await Post.find().populate("user", "name email image");
	if (posts) return res.json(posts.reverse());
	else return res.json([]);
});

router.post("/", AuthFunc, async (req, res) => {
	const { error } = newPostValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	const post = new Post({
		info: req.body.info,
		position: req.body.position,
		user: req.user.id,
		ups: [],
		downs: []
	});
	try {
		const newPost = await post.save();
		const fetchedPost = await Post.findById(newPost._id).populate(
			"user",
			"name email"
		);
		return res.send(fetchedPost);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

router.put("/", AuthFunc, async (req, res) => {
	const postId = req.body.id;
	const userId = req.user.id;

	const voteType = req.body.vote_type;
	const otherType = voteType === "ups" ? "downs" : "ups";

	const post = await Post.findById(postId);

	if (!post) res.status(401).send({ error: "Something went wrong!" });

	const oldVoteList = post[voteType];
	const oldOtherList = post[otherType];

	if (!oldVoteList.includes(userId)) {
		oldVoteList.push(userId);
	} else {
		oldVoteList.splice(userId);
	}

	if (oldOtherList.includes(userId)) {
		oldOtherList.splice(userId);
	}

	const updatedPost = await Post.findByIdAndUpdate(
		{ _id: postId },
		{
			[voteType]: oldVoteList,
			[otherType]: oldOtherList
		},
		{ new: true }
	);
	return res.send(updatedPost);
});

module.exports = router;
