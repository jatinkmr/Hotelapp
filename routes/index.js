const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const auth = require('./auth');
const home = require('./home');

router.use('/v1/user', auth);
router.use('/v1/home', home);
router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;