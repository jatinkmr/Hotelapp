const User = require('../model/User');
const Hotel = require('../model/hotel');
const Boom = require('@hapi/boom');
const { hotelValidation } = require('../validation');
const jwt = require('jsonwebtoken');

const addHotel = async (req, res) => {
    const { error } = hotelValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (req.headers) {
        const token = req.header('auth-token');
        console.log('token => ', token);
        if(!token) {
            console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            console.log('Decoded => ', decoded);
            var userId = decoded._id;
            console.log("UserID => ", userId);

            const hotel = new Hotel({
                hotelName: req.body.hotelName,
                ownerName: userId,
                hotelRating: req.body.hotelRating,
                location: req.body.location
            });

            const savedHotel = await hotel.save();
            return res.send({ hotel: hotel._id });
        } catch (err) {
            console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

module.exports.addHotel = addHotel;