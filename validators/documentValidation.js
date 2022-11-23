const joi = require("joi");

function documentValidation(document) {
  const Schema = joi.object({
    title: joi.string().min(2).max(20).required(),
    description: joi.string(),
    access: joi.string().valid("FREE", "PAID").required(),
    type: joi.string().valid("ARTICLE", "BOOK").required(),
  });
  return Schema.validate(document);
}

function documentEditValidation(document) {
  const Schema = joi.object({
    title: joi.string().min(2).max(20),
    description: joi.string(),
    access: joi.string().valid("FREE", "PAID"),
    type: joi.string().valid("ARTICLE", "BOOK"),
  });
  return Schema.validate(document);
}

exports.documentValidation = documentValidation;
exports.documentEditValidation = documentEditValidation;
