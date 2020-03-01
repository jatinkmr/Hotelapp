const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const auth = require('./auth');

router.use('/v1/user', auth);
router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;