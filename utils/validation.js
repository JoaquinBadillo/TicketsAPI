const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(128).required(),
        email: Joi.string().min(6).max(128).required().email(),
        password: Joi.string().min(8).max(128).required(),
        role: Joi.string().max(64).required()
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(128).required().email(),
        password: Joi.string().max(64).required()
    });

    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
};
