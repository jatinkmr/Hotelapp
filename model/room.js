const mongoose = require('mongoose');
const Hotel = require('./hotel');
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
    room_No: {
        type: Number,
        required: true,
        min: 1,
        max: 500
    },
    roomType:{
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    price: {
        type: Number,
        required: true,
        default: 800
    },
    hotelId: { 
        type: Schema.Types.ObjectId,
        ref: Hotel,
        required: true
    },
    floorNumber: {
        type: Number,
        required: true
    },
    typeOfBed: {
        type: String,
        required: true
    },
    fullyFurnished: {
        type: Boolean,
        required: true
    },
    booked: {
        type: Boolean,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('room', roomSchema);