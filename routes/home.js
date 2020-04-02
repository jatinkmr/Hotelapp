const router = require('express').Router();
const verify = require('./verifyToken');
const Boom = require('@hapi/boom');

router.get('/', verify, (req, res) => {
    res.json({posts: {title: 'myFirstPost', description: 'Some Random Cool Stuff !!'}});
});

router.all("*", (req, res, next) => {
    res.json(Boom.notFound('Path Not Available').output.payload.message);
});

module.exports = router;