const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true
    },
    ownerID: {
        type: Number,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    hotelRating: {
        type: String,
        default: 0,
        min: 0,
        max: 5
    },
    location: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('hotel', hotelSchema);