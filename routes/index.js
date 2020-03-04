const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const auth = require('./auth');
const home = require('./home');
const adminRoutes = require('./admin/admin');

// User Routes
router.use('/v1/user', auth);
router.use('/v1/home', home);

// Admin Routes
router.use('/v1/admin', adminRoutes);

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;