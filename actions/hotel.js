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
        // console.log('token => ', token);
        if(!token) {
            console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            // console.log('Decoded => ', decoded);
            var userId = decoded._id;
            // console.log("UserID => ", userId);

            User.find({_id: userId}).then(user => {
                // console.log('user => ', user);
                // console.log(user[0].role);
                if(user[0].role.toLowerCase() == 'hotelowner'){
                    console.log('Welcome !!');

                    const hotel = new Hotel({
                        hotelName: req.body.hotelName,
                        ownerID: userId,
                        ownerName: user[0].name,
                        hotelRating: req.body.hotelRating,
                        location: req.body.location
                    });

                    try {
                        const savedHotel = hotel.save();
                        return res.json({id: hotel._id, message: 'Hotel Created !!'});
                        // return res.send
                    } catch(err) {
                        return res.send(Boom.badRequest('Unable to Save Hotel'));
                    }
                    // return res.json({message: "Welcome Owner !!"});
                } else {
                    console.log('You are not an Owner !!');
                    return res.json(Boom.unauthorized('UnAuthorized User to Create Hotel').output.payload.message);
                }
            }).catch(err => {
                console.log('Error => ', err);
                return res.json(Boom.notFound());
            });

            // const hotel = new Hotel({
            //     hotelName: req.body.hotelName,
            //     ownerName: userId,
            //     hotelRating: req.body.hotelRating,
            //     location: req.body.location
            // });

            // const savedHotel = await hotel.save();
            // return res.send({ hotel: hotel._id });
        } catch (err) {
            console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

module.exports.addHotel = addHotel;