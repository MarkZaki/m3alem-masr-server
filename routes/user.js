const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const AuthFunc = require("./verifyToken");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const { validRegister, validLogin } = require("../validation");

router.post("/register", async (req, res) => {
	// Valid Form
	const { error } = validRegister(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Check already email
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist)
		return res.status(400).send({ message: "email already exist" });

	//Hash password
	const salt = await bcrypt.genSalt(10);
	const passwordHashed = await bcrypt.hash(req.body.password, salt);

	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		image: req.body.image,
		password: passwordHashed
	});
	try {
		const addNewUser = await newUser.save();
		const token = jwt.sign({ id: addNewUser.id }, process.env.SECRET_KEY);
		return res.json({
			token: token,
			user: {
				_id: addNewUser._id,
				name: addNewUser.name,
				email: addNewUser.email,
				image: addNewUser.image
			}
		});
	} catch (err) {
		res.status(400).json({ message: err });
	}
});

router.post("/login", async (req, res) => {
	// Basic Valid
	const { error } = validLogin(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	// Find email
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email not found");
	// Check Password
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Email or Password is wrong");
	//Create and assign token
	const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
	return res.json({
		token: token,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			image: user.image
		}
	});
});

router.get("/", AuthFunc, async (req, res) => {
	// Find email
	const user = await User.findById(req.user.id);
	if (!user) return res.status(400).send("not found");
	const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
	return res.json({
		token: token,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			image: user.image
		}
	});
});

module.exports = router;
