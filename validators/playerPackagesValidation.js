const joi = require("joi");

function statsValidation(stats) {
  const schema = joi.object({
    playerId: joi.string().required(),
    packageId: joi.string().required(),
  });
  return schema.validate(stats, { abortEarly: false });
}

function videoUploadValidation(stats) {
  const schema = joi.object({
    playerId: joi.string().required(),
    packageId: joi.string().required(),
    title: joi.string().required(),
    desc: joi.string().required(),
  });
  return schema.validate(stats, { abortEarly: false });
}

function gearValidation(gear) {
  const schema = joi.object({
    name: joi.string().required(),
  });
  return schema.validate(gear, { abortEarly: false });
}

exports.gearValidation = gearValidation;
exports.statsValidation = statsValidation;
exports.videoUploadValidation = videoUploadValidation;
