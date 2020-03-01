const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const auth = require('./auth');

router.use('/v1/user', auth);
router.all("*", (req, res, next) => {
    // res.status(400).send("No Such Route");
    next(notFound());
});

module.exports = router;