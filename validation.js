const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(8).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().min(8).required()
    });
    return Joi.validate(data, schema);
};

const loginValidation = data => {
    const schema = Joi.object().keys({
        email: Joi.string().min(8).required().email(),
        password: Joi.string().min(6).required()
    });
    return Joi.validate(data, schema);
};

const hotelValidation = data => {
    const schema = Joi.object().keys({
        hotelName: Joi.string().min(8).required(),
        hotelRating: Joi.number().min(0).max(5).required(),
        location: Joi.string().min(5).max(50).required()
    });
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.hotelValidation = hotelValidation;