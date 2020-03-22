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

const roomValidation = data => {
    const schema = Joi.object().keys({
        room_No: Joi.number().min(1).max(500).required(),
        roomType: Joi.string().min(6).max(255).required(),
        price: Joi.number().min(800).max(20000).required(),
        hotelId: Joi.string().min(10).max(255).required(),
        floorNumber: Joi.number().min(0).max(10).required(),
        typeOfBed: Joi.string().max(255).required(),
        fullyFurnished: Joi.boolean().required()
    });
    return Joi.validate(data, schema);
};

module.exports = {
    registerValidation,
    loginValidation,
    hotelValidation,
    roomValidation
}