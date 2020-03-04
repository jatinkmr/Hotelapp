const router = require('express').Router();
const { notFound } = require("@hapi/boom");

router.get('/', (req, res) => {
    res.status(200).send('Admin Page Loaded Successfully !!');
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;