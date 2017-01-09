const Joi = require('joi');

exports.options = Joi.object().keys({
    hostname: Joi.string().default('localhost'),
    port: Joi.number().min(1).max(65535).default(32400),
    authToken: Joi.string().required(),
    https: Joi.boolean().default(false)
});
