const joi = require("joi");

function profileValidation(profile) {
  const schema = joi.object({
    bio: joi.string().required(),
    dob: joi.date().required(),
    height: joi.string().allow(""),
    country: joi.string().required(),
    city: joi.string().required(),
    playingHand: joi.string().valid("right", "left").allow(""),
    experience: joi.number().required(),
  });
  return schema.validate(profile, { abortEarly: false });
}

function profileUpdateValidation(profile) {
  const schema = joi.object({
    bio: joi.string(),
    dob: joi.date(),
    height: joi.string(),
    playingHand: joi.string().valid("right", "left"),
    experience: joi.number(),
    country: joi.string(),
    city: joi.string(),
  });
  return schema.validate(profile, { abortEarly: false });
}

function gearValidation(gear) {
  const schema = joi.object({
    name: joi.string().required(),
  });
  return schema.validate(gear, { abortEarly: false });
}

exports.gearValidation = gearValidation;
exports.profileValidation = profileValidation;
exports.profileUpdateValidation = profileUpdateValidation;
