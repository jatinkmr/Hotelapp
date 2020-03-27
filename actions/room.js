const User = require('../model/User');
const Hotel = require('../model/hotel');
const Room = require('../model/room');
const Boom = require('@hapi/boom');
const { roomValidation } = require('../validation');
const jwt = require('jsonwebtoken');

const addRoom = async (req, res) => {
    const { error } = roomValidation(req.body);
    if (error) {
        // console.log('error =>');
        return res.status(400).send(error.details[0].message);
    }

    if (req.headers) {
        const token = req.header('auth-token');

        if (!token) {
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
                    // console.log('You are Owner');
                    const room = new Room({
                        room_No: req.body.room_No,
                        roomType: req.body.roomType,
                        price: req.body.price,
                        hotelId: req.body.hotelId,
                        floorNumber: req.body.floorNumber,
                        typeOfBed: req.body.typeOfBed,
                        fullyFurnished: req.body.fullyFurnished,
                        booked: req.body.booked
                    });

                    Hotel.find({ _id: room.hotelId }).then(hotel => {
                        // console.log('hotel =>', hotel);
                        if (hotel.length > 0) {
                            // console.log('hotel => ', hotel);
                            try {
                                const savedRoom = room.save();
                                return res.json({ id: room._id, message: 'Room Added !!' });
                            } catch (err) {
                                return res.send(Boom.badRequest('Unable to Save Room'));
                            }
                        } else {
                            return res.json({ message: "Hotel Not Found" });
                        }
                    }).catch(err => {
                        return res.json(Boom.notFound('Hotel Not Found !!'));
                    });
                } else {
                    // console.log('You are not an Owner !!');
                    return res.json(Boom.unauthorized('UnAuthorized User to Add Room!! You are Customer !!').output.payload.message);
                }
            }).catch(err => {
                return res.json(Boom.notFound());
            });
        } catch (err) {
            return res.json({ message: err });
        }
    }
    return res.status(500);
};

const deleteRoom = async (req, res) => {

    if (req.headers) {
        const token = req.header('auth-token');

        if (!token) {
            // console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            var roomId = req.params.roomId;

            User.findOne({ _id: userId }).then(user => {
                // console.log('User => ', user);
                if (user.role.toLowerCase() == 'hotelowner') {
                    // console.log('HotelOwner')
                    Room.findOne({ _id: roomId }).then(rooms => {
                        // console.log('Room =>', rooms);
                        let hotelID = rooms.hotelId;
                        // console.log('HotelID => ', hotelID);
                        // console.log('Booked => ', rooms.booked);
                        if(rooms.booked == true) {
                            // console.log('Not happening');
                            return res.json(Boom.unauthorized('Cannot Be Deleted Due To Booking').output.payload.message);
                        }

                        Hotel.findOne({ _id: hotelID }).then(hotels => {
                            // console.log('hotels =>', hotels);
                            // console.log(hotels.ownerID);
                            // console.log(userId);
                            if (hotels.ownerID === userId) {
                                Room.findByIdAndDelete({ _id: roomId }, { ownerID: userId }, (err, data) => {
                                    if (err) {
                                        return res.json(Boom.notFound('Room not Available').output.payload.message);
                                    } else {
                                        return res.json({ message: "Room Deleted Successfully !!" });
                                    }
                                })
                            } else {
                                return res.json(Boom.unauthorized('You are not an owner of this Room').output.payload.message);
                            }
                        }).catch(err => {
                            return res.json(Boom.notFound('Attached Hotel Not Found !!').output.payload.message);
                        });
                    }).catch(err => {
                        return res.json(Boom.notFound('Room Not Found !!').output.payload.message);
                    });
                } else {
                    // console.log('Customer');
                    return res.json(Boom.unauthorized('UnAuthorized User to Delete Room!! You are Customer !!').output.payload.message);
                }
            }).catch(err => {
                return res.json(Boom.notFound('User Not Found !!').output.payload.message);
            });

        } catch (err) {
            // console.log('Error');
            return res.json(Boom.unauthorized('Unauthorized'));
        }
    }
    return res.status(500);
};

const editRoom = async (req, res, next) => {

    if (req.headers) {
        const token = req.header('auth-token');

        if (!token) {
            // console.log('Nope');
            return res.json(Boom.unauthorized('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            var roomId = req.params.roomId;

            User.findOne({ _id: userId }).then(user => {
                // console.log('User => ', user);
                if (user.role.toLowerCase() == 'hotelowner') {
                    // console.log('HotelOwner');
                    Room.findOne({ _id: roomId }).then(rooms => {
                        // console.log('Room => ', room);
                        var hotelID = rooms.hotelId;
                        // console.log('HotelID => ', hotelID);
                        var newHotelID = req.body.hotelId;

                        if(rooms.booked == true) {
                            // console.log('Not happening');
                            return res.json(Boom.unauthorized('Cannot Be Modified Due To Booking').output.payload.message);
                        }                        

                        Hotel.findOne({ _id: newHotelID }).then(sHotel => {
                            // console.log('hotel => ', sHotel);
                            Hotel.findOne({ _id: hotelID }).then(hotels => {
                                if (hotels.ownerID === userId) {
                                    Room.findByIdAndUpdate({ _id: roomId }, {
                                        $set: {
                                            roomType: req.body.roomType,
                                            price: req.body.price,
                                            hotelId: req.body.hotelId,
                                            floorNumber: req.body.floorNumber,
                                            typeOfBed: req.body.typeOfBed,
                                            fullyFurnished: req.body.fullyFurnished
                                        }
                                    }, { returnNewDocument: true }, (err, result) => {
                                        if (err) {
                                            return res.json(Boom.notFound('Room not Available').output.payload.message);
                                        }
                                        return res.json({ message: 'Room Updated Successfully !!' });
                                    })
                                } else {
                                    return res.json(Boom.unauthorized('You are not owner of this Room').output.payload.message);
                                }
                            });
                        }).catch(err => {
                            return res.json(Boom.notFound('New Hotel Not Found !! ').output.payload.message);
                        });

                    }).catch(err => {
                        return res.json(Boom.notFound('Room Not Found !!').output.payload.message);
                    });
                } else {
                    // console.log('Customer');
                    return res.json(Boom.unauthorized('You are not Authorized to Edit Room !! You are Customer !!'));
                }
            }).catch(err => {
                return res.json(Boom.notFound('User Not Found !!').output.payload.message);
            });
        } catch (err) {
            res.json(Boom.unauthorized('UnAuthorized'));
        }
    }
    return res.status(500);
};

module.exports = {
    addRoom,
    deleteRoom,
    editRoom
};