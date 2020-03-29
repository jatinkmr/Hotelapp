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
        if (!token) {
            // console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            // console.log('Decoded => ', decoded);
            var userId = decoded._id;
            // console.log("UserID => ", userId);

            User.find({ _id: userId }).then(user => {
                // console.log('user => ', user);
                // console.log(user[0].role);
                if (user[0].role.toLowerCase() == 'hotelowner') {
                    // console.log('Welcome !!');

                    const hotel = new Hotel({
                        hotelName: req.body.hotelName,
                        ownerID: userId,
                        ownerName: user[0].name,
                        hotelRating: req.body.hotelRating,
                        location: req.body.location
                    });

                    try {
                        const savedHotel = hotel.save();
                        return res.json({ id: hotel._id, message: 'Hotel Created !!' });
                        // return res.send
                    } catch (err) {
                        return res.send(Boom.badRequest('Unable to Save Hotel'));
                    }
                    // return res.json({message: "Welcome Owner !!"});
                } else {
                    // console.log('You are not an Owner !!');
                    return res.json(Boom.unauthorized('UnAuthorized User to Create Hotel!! You are Customer !!').output.payload.message);
                }
            }).catch(err => {
                // console.log('Error => ', err);
                return res.json(Boom.notFound('Owner Not Found !!').output.payload.message);
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
            // console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

const deleteHotel = (req, res) => {

    if (req.headers) {
        const token = req.header('auth-token');

        if (!token) {
            // console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            var hotelId = req.params.hotelID;
            // return res.json({'UserID': userId, 'HotelID': hotelId});

            User.find({ _id: userId }).then(user => {
                if (user[0].role.toLowerCase() == 'hotelowner') {
                    Hotel.findByIdAndDelete({ _id: hotelId }, { ownerID: userId }, (err, data) => {
                        if (err) {
                            return res.json(Boom.notFound('Hotel Not Found').output.payload.message);
                        } else {
                            return res.json({ message: 'Hotel Deleted Successfully !!' });
                        }
                    });
                } else {
                    // console.log('You are not an Owner !!');
                    return res.json(Boom.unauthorized('UnAuthorized User to Delete Hotel !! You are a Customer !!').output.payload.message);
                }
            }).catch(err => {
                // console.log('Error => ', err);
                return res.json(Boom.notFound('Owner Not Found !!').output.payload.message);
            });
        } catch (err) {
            // console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

const editHotel = async (req, res) => {
    const { error } = hotelValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (req.headers) {
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
            var hotelId = req.params.hotelID;

            User.find({ _id: userId }).then(user => {
                // console.log('user => ', user);
                // console.log(user[0].role);
                if (user[0].role.toLowerCase() == 'hotelowner') {
                    // console.log('Welcome !!');
                    Hotel.findByIdAndUpdate({ _id: hotelId }, {
                        $set: {
                            hotelName: req.body.hotelName,
                            hotelRating: req.body.hotelRating,
                            location: req.body.location
                        }
                    }, { returnNewDocument: true }, (err, result) => {
                        if(err) {
                            // console.log('Error => ', err);
                            return res.json(Boom.notFound('Hotel Not Found').output.payload.message);
                        }
                        // console.log('REsult => ', result);
                        return res.json({message: 'Hotel Updated Successfully !!'});
                    });
                } else {
                    // console.log('You are not an Owner !!');
                    return res.json(Boom.unauthorized('UnAuthorized User to Update Hotel!! You are Customer !!').output.payload.message);
                }
            }).catch(err => {
                return res.json(Boom.notFound('User Not Found').output.payload.message);
            });
        } catch (err) {
            // console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

const hotelList = async (req, res) => {
    try {
        Hotel.find({}).then(hotel => {
            // console.log(hotel);
            if(!hotel) {
                return res.json(Boom.notFound('No Hotel Found').output.payload.message);
            }
            return res.json(hotel);
        });
    }catch (err) {
        return res.json(Boom.notFound('No Hotel Found').output.payload.message);
    }
};

module.exports = {
    addHotel,
    deleteHotel,
    editHotel,
    hotelList
};