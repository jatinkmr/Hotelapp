const User = require('../model/User');
const Hotel = require('../model/hotel');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const bookingHome = async (req, res, next) => {

    if(req.headers) {
        const token = req.header('auth-token');
        // console.log('token => ', token);
        if (!token) {
            // console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            // console.log('Decoded => ', decoded);
            var userId = decoded._id;
            // console.log("UserID => ", userId);

            User.findOne({_id: userId}).then(users => {
                console.log('User => ', users);
                if (users.role.toLowerCase() == 'hotelowner') {
                    // console.log('You are HotelOwner !!');

                    Hotel.find({ownerID: userId}).then(hotels => {
                        // console.log('Hotels => ', hotels);
                        return res.json({message: 'Welcome to Home Page !!', userData: users, hotelData: hotels});
                    }).catch(err => {
                        // console.log('error =>', err);
                        return res.json(Boom.notFound('Your Hotels Not Found !!').output.payload.message);
                    });
                } else {
                    // console.log('You are Customer !!');
                    return res.json({message: 'Welcome to Home Page !!', userData: users});
                }
                // return res.json({message: 'Welcome to Home Page', data: users});
            }).catch(err => {
                // console.log('Error =>', err);
                return res.json(Boom.notFound('User Not Found !!').output.payload.message);
            })
        }catch(err) {
            // console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized').output.payload.message);
        }
    }
    return res.status(500);
};

module.exports = {
    bookingHome
};