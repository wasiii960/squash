const joi = require("joi");

function videoValidation(video) {
  const Schema = joi.object({
    title: joi.string().min(2).max(20).required(),
    description: joi.string(),
    access: joi.string().valid("FREE", "PAID").required(),
    link: joi.string().required(),
  });
  return Schema.validate(video);
}

function videoEditValidation(video) {
  const Schema = joi.object({
    title: joi.string().min(2).max(20),
    description: joi.string(),
    access: joi.string().valid("FREE", "PAID"),
    link: joi.string(),
  });
  return Schema.validate(video);
}

function videoStatusValidation(video) {
  const Schema = joi.object({
    status: joi.string().valid("LIVE", "HIDDEN"),
  });
  return Schema.validate(video);
}

exports.videoValidation = videoValidation;
exports.videoEditValidation = videoEditValidation;
exports.videoStatusValidation = videoStatusValidation;
