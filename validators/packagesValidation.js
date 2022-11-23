const joi = require("joi");

function packageValidation(package) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    description: joi.string().required(),
    timePeriod: joi.number().integer().positive().required(),
    totalFee: joi.number().integer().positive().required(),
    videos: joi.array().items(
      joi.object({
        _id: joi.string().required(),
        title: joi.string().required(),
        description: joi.string(),
        thumbnail: joi.string().required(),
      })
    ),
  });
  return Schema.validate(package);
}

function editPackageValidation(package) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20),
    description: joi.string(),
    timePeriod: joi.number().integer().positive(),
    totalFee: joi.number().integer().positive(),
    videos: joi.array().items(
      joi.object({
        _id: joi.string().required(),
        title: joi.string().required(),
        description: joi.string(),
        thumbnail: joi.string().required(),
      })
    ),
  });
  return Schema.validate(package);
}

function packageCommentValidation(package) {
  const Schema = joi.object({
    comment: joi.string(),
  });
  return Schema.validate(package);
}

function packageRatingValidation(rating) {
  const Schema = joi.object({
    rating: joi.number().integer().positive().min(0).max(5).required(),
  });
  return Schema.validate(rating);
}

function editPackageStatusValidation(package) {
  const Schema = joi.object({
    status: joi
      .string()
      .valid("APPROVED", "UNAPPROVED", "REQUESTCHANGES")
      .required(),
    coachShare: joi.number().integer().positive().required(),
    comment: joi.string().allow(null, ""),
  });
  return Schema.validate(package);
}

exports.packageValidation = packageValidation;
exports.editPackageValidation = editPackageValidation;
exports.packageRatingValidation = packageRatingValidation;
exports.packageCommentValidation = packageCommentValidation;
exports.editPackageStatusValidation = editPackageStatusValidation;
