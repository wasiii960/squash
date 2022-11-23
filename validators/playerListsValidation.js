const joi = require("joi");

function requestValidation(request) {
  const Schema = joi.object({
    coachId: joi.string().required(),
    packageId: joi.string().required(),
    startDate: joi.date().required(),
  });
  return Schema.validate(request);
}

function responseValidation(response) {
  const Schema = joi.object({
    responseToRequest: joi.bool().required(),
  });
  return Schema.validate(response);
}

function paymentValidation(payment) {
  const Schema = joi.object({
    moneyRecieved: joi.bool().required(),
  });
  return Schema.validate(payment);
}

exports.requestValidation = requestValidation;
exports.paymentValidation = paymentValidation;
exports.responseValidation = responseValidation;
