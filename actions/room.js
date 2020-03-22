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
                        fullyFurnished: req.body.fullyFurnished
                    });

                    Hotel.find({_id: room.hotelId}).then(hotel => {
                        console.log('hotel =>', hotel);
                        if(hotel.length > 0) {
                            console.log('hotel => ', hotel);
                            try {
                                const savedRoom = room.save();
                                return res.json({ id: room._id, message: 'Room Added !!' });
                            } catch (err) {
                                return res.send(Boom.badRequest('Unable to Save Room'));
                            }
                        } else {
                            return res.json({message: "Hotel Not Found"});
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
        } catch(err) {
            return res.json({message: err});
        }
    }
    return res.status(500);
};

module.exports = {
    addRoom
};