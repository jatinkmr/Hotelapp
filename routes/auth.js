const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const { registration, login } = require('../actions/auth');
const { addHotel } = require('../actions/hotel');
const verify = require('./verifyToken');

router.post("/register", async (req, res, next) => {
    try{
        const response = await registration(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const response = await login(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/addhotel', verify, async (req, res, next) => {
    try {
        const response = await addHotel(req, res);
        return  res.json(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;
