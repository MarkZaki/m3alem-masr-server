const joi = require("@hapi/joi");

const validRegister = props => {
	const valid = {
		name: joi.string().min(6).required(),
		email: joi.string().min(6).required().email(),
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
		position: joi.string().required()
	};
	const schema = joi.object(valid);
	return schema.validate(props);
};

module.exports.validRegister = validRegister;
module.exports.validLogin = validLogin;
module.exports.newPostValidation = newPostValidation;