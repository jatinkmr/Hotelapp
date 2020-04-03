const User = require('../model/User');
const Booking = require('../model/booking');
const Hotel = require('../model/hotel');
const Room = require('../model/room');
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
                // console.log('User => ', users);
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

const roomBooking = async (req, res, next) => {

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
            var hotelId = req.params.hotelId;
            var roomId = req.params.roomId;

            var booking = new Booking({
                fromBookingDate: new Date(req.body.fromBookingDate),
                toBookingDate: new Date(req.body.toBookingDate),
                noOfPeople: req.body.noOfPeople,
                bringVerificationDocumentType: req.body.bringVerificationDocumentType,
                modeOfPayment: req.body.modeOfPayment,
                paymentCompleted: req.body.paymentCompleted
            });

            booking.userId = userId;
            booking.hotelId = hotelId;
            booking.roomId = roomId;

            Room.findOne({_id: roomId}).then(room => {
                // console.log('Room => ', room);
                if(room.booked === true) {
                    return res.json({error: false, message: 'Room Already Booked !!'});
                } else {
                    // console.log('HotelId => ', hotelId);
                    // console.log('Room HotelId => ', room.hotelId);
                    if(room.hotelId == hotelId) {
                        // console.log('HotelId is Same');
                        // return res.json({error: false, message: 'Room Available'});
                        Room.findByIdAndUpdate({_id: roomId}, {
                            $set: {
                                booked: "true"
                            }
                        }, (err, result) => {
                            if(err) {
                                console.log('Not Updated !');
                            } else {
                                console.log('Updated !');
                            }
                        });
                        // console.log('Room after True => ', room);
                        User.findOne({_id: userId}).then(user => {
                            if (user.role.toLowerCase() == 'hotelowner') {
                                // console.log('HotelOwner');
                                booking.bookedBy = "Hotel Owner";
                                console.log('Entered Data => ', booking);
                            } else {
                                // console.log('Customer');
                                booking.bookedBy = "Customer";
                                // console.log('Entered Data => ', booking);
                            }

                            try {
                                const savedBooking = booking.save();
                                return res.json({ id: booking._id, message: 'Booking Confirmed !!' });
                            } catch(err) {
                                return res.send(Boom.badRequest('Unable to Save Booking !!'));
                            }
                        }).catch(err => {
                            // console.log('Error => ', err);
                            return res.json(Boom.notFound('User Not Found !! ').output.payload.message);
                        });
                    } else {
                        // console.log('HotelId is Different');
                        return res.json({error: false, message: 'HotelId of Room is Different !!'});
                    }
                }
            }).catch(err => {
                return res.json(Boom.notFound('Room not Found').output.payload.message);
            });
        } catch(err) {
            return res.json(Boom.unauthorized('UnAuthorized').output.payload.message);
        }
    }
    return res.status(500);
};

const getVacantRoom = async (req, res, next) => {

    Room.find({booked: false}).then(rooms => {
        return res.json(rooms);
    }).catch(err => {
        return res.json(Boom.notFound('No Vacant Room Available !!').output.payload.message);
    })
};

module.exports = {
    bookingHome,
    roomBooking,
    getVacantRoom
};