const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(128).required(),
    email: Joi.string().min(6).max(128).required().email(),
    password: Joi.string().min(8).max(64).required(),
    role: Joi.string().max(64).required(),
  });

  return schema.validate(data);
};

const accountValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).max(128).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(128).required().email(),
    password: Joi.string().max(64).required(),
  });

  return schema.validate(data);
};

const ticketValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(128).required(),
    description: Joi.string().max(1024).required(),
    status: Joi.string().max(16).required(),
    priority: Joi.string().max(8).required(),
    category: Joi.string().max(64).required(),
    incident: Joi.string().max(64).required(),
    folio: Joi.string().max(64),
    location: Joi.string().max(64).required(),
  });

  return schema.validate(data);
};

const ticketUpdateValidation = (data) => {
    const schema = Joi.object({
      _id: Joi.string(),
      id: Joi.string(),
      title: Joi.string().max(128),
      description: Joi.string().max(1024),
      status: Joi.string().max(16),
      priority: Joi.string().max(8),
      category: Joi.string().max(64),
      incident: Joi.string().max(64),
      location: Joi.string().max(64),
      folio: Joi.string(),
      userId: Joi.string(),
      date: Joi.date(),
      last_update: Joi.date(),
      __v: Joi.number(),
    });

    return schema.validate(data);
};

module.exports = {
  registerValidation,
  accountValidation,
  loginValidation,
  ticketValidation,
  ticketUpdateValidation
};
