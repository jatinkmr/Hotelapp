const router = require('express').Router();
const auth = require('./auth');

router.use('/v1/user', auth);

module.exports = router;