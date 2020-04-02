const router = require('express').Router();
const Boom = require('@hapi/boom');
const auth = require('./auth');
const home = require('./home');
const adminRoutes = require('./admin/admin');
const bookingRoutes = require('./booking');

// User Routes
router.use('/v1/user', auth);
router.use('/v1/home', home);

// Admin Routes
router.use('/v1/admin', adminRoutes);

// Booking Routes
router.use('/v1/booking', bookingRoutes);

router.all("*", (req, res, next) => {
    res.json(Boom.notFound('Path Not Available').output.payload.message);
});

module.exports = router;