const joi = require("joi");

function validateUser(user) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return Schema.validate(user);
}

function passwordChangeValidation(data) {
  const Schema = joi.object({
    password: joi.string().required(),
    passwordNew: joi.string().required(),
  });
  return Schema.validate(data);
}

function statusValidation(data) {
  const Schema = joi.object({
    status: joi
      .string()
      .valid("active", "banned", "ACTIVE", "BANNED")
      .required(),
  });
  return Schema.validate(data);
}

exports.validateUser = validateUser;
exports.statusValidation = statusValidation;
exports.passwordChangeValidation = passwordChangeValidation;
