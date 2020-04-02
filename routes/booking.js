const router = require('express').Router();
const Boom = require('@hapi/boom');
const { bookingHome, roomBooking } = require('../actions/booking');

const verify = require('./verifyToken');

router.get('/', verify, async (req, res, next) => {
    try {
        const response = await bookingHome(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.post('/:hotelId/book/:roomId', verify, async (req, res, next) => {
    try {
        const response = await roomBooking(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.all("*", (req, res, next) => {
    res.json(Boom.notFound('Path Not Available').output.payload.message);
});

module.exports = router;