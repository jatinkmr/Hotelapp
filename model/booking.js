const mongoose = require('mongoose');
const Hotel = require('./hotel');
const Room = require('./room');
const User = require('./User');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingDate: {
        type: Date,
        required: true
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: Room,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: Hotel,
        required: true
    },
    fromBookingDate: {
        type: Date,
        required: true
    },
    toBookingDate: {
        type: Date,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    noOfPeople: {
        type: Number,
        required: true
    },
    bringVerificationDocumentType: {
        type: String,
        required: true
    },
    modeOfPayment: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('booking', bookingSchema);