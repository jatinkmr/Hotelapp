const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true
    },
    ownerID: {
        type: String,
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
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('hotel', hotelSchema);