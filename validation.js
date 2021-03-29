const joi = require("@hapi/joi");

const validRegister = props => {
	const valid = {
		name: joi.string().min(6).required(),
		email: joi.string().min(6).required().email(),
		image: joi.string().allow(null, ""),
		password: joi.string().min(6).required()
	};
	const schema = joi.object(valid);
	return schema.validate(props);
};

const validLogin = props => {
	const valid = {
		email: joi.string().min(6).required().email(),
		password: joi.string().min(6).required()
	};
	const schema = joi.object(valid);
	return schema.validate(props);
};

const newPostValidation = props => {
	const valid = {
		info: joi.string().required(),
		position: joi.string().required(),
		image: joi.string().allow(null, "")
	};
	const schema = joi.object(valid);
	return schema.validate(props);
};

const newCommentValidation = props => {
	const valid = {
		text: joi.string().required(),
		post: joi.string().required()
	};
	const schema = joi.object(valid);
	return schema.validate(props);
};

module.exports.validRegister = validRegister;
module.exports.validLogin = validLogin;
module.exports.newPostValidation = newPostValidation;
module.exports.newCommentValidation = newCommentValidation;
