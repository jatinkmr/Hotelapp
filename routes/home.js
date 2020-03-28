const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({posts: {title: 'myFirstPost', description: 'Some Random Cool Stuff !!'}});
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;