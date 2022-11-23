const joi = require("joi");

function newsValidation(document) {
  const Schema = joi.object({
    title: joi.string().min(2).required(),
    details: joi.string().required(),
  });
  return Schema.validate(document);
}

function newsEditValidation(document) {
  const Schema = joi.object({
    title: joi.string().min(2),
    details: joi.string(),
  });
  return Schema.validate(document);
}

exports.newsValidation = newsValidation;
exports.newsEditValidation = newsEditValidation;
