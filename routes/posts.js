const router = require("express").Router();
const Post = require("../models/Post");
const AuthFunc = require("./verifyToken");
const { newPostValidation } = require("../validation");

router.get("/", AuthFunc, async (req, res) => {
	const posts = await Post.find().populate("user", "name email image");
	if (posts)
		return res.json(posts.sort((a, b) => b.likes.length - a.likes.length));
	else return res.json([]);
});

router.post("/", AuthFunc, async (req, res) => {
	const { error } = newPostValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	let image = req.body.image;
	image = image.trim();
	const post = new Post({
		info: req.body.info,
		position: req.body.position,
		image: image.length < 1 || image == null ? null : req.body.image,
		user: req.user.id,
		likes: []
	});
	try {
		const newPost = await post.save();
		const fetchedPost = await Post.findById(newPost._id).populate(
			"user",
			"name email image"
		);
		return res.send(fetchedPost);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

router.put("/", AuthFunc, async (req, res) => {
	const postId = req.body.id;
	const userId = req.user.id;

	const post = await Post.findById(postId);

	if (!post) res.status(401).send({ error: "Something went wrong!" });

	const likes = post.likes;

	if (!likes.includes(userId)) {
		likes.push(userId);
	} else {
		for (let i = 0; i < likes.length; i++) {
			if (likes[i] === userId) {
				likes.splice(i, 1);
			}
		}
	}

	const updatedPost = await Post.findByIdAndUpdate(
		{ _id: postId },
		{
			likes: likes
		},
		{ new: true }
	);
	return res.send(updatedPost);
});

module.exports = router;
