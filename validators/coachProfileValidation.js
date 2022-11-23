const joi = require("joi");

function profileValidation(profile) {
  const schema = joi.object({
    bio: joi.string().required(),
    dob: joi.date(),
    height: joi.string(),
    playingHand: joi.string().valid("right", "left"),
    experience: joi.number().required(),
    country: joi.string().required(),
    city: joi.string().required(),
    facebook: joi.string(),
    awards: joi.array().items(joi.string().required()),
    qualifications: joi.array().items(joi.string().required()),
    clubs: joi.array().items(joi.string().required()),
  });
  return schema.validate(profile, { abortEarly: false });
}

function profileUpdateValidation(profile) {
  const schema = joi.object({
    bio: joi.string(),
    dob: joi.date(),
    country: joi.string(),
    city: joi.string(),
    height: joi.string(),
    playingHand: joi.string().valid("right", "left"),
    experience: joi.number(),
    facebook: joi.string(),
    awards: joi.array().items(joi.string().required()),
    qualifications: joi.array().items(joi.string().required()),
    clubs: joi.array().items(joi.string().required()),
  });
  return schema.validate(profile, { abortEarly: false });
}

exports.profileValidation = profileValidation;
exports.profileUpdateValidation = profileUpdateValidation;
