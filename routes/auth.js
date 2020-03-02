const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const { registration, login } = require('../actions/auth');

router.post("/register", async (req, res, next) => {
    try{
        const response = await registration(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const response = await login(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;
