const router = require('express').Router();
const { notFound } = require("@hapi/boom");

const verify = require('./verifyToken');

router.post('/', verify, (req, res, next) => {
    return res.status(200).send('Welcome to Booking Area !!');
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;