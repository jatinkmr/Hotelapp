const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const { getUsername, getAllUsers, registration, login } = require('../../actions/admin/admin');
const verify = require('./verifyToken');

router.get('/', (req, res) => {
    res.status(200).send('Admin Page Loaded Successfully !!');
});

router.post('/register', async (req, res, next) => {
    try {
        const response = await registration(req, res);
        return res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const response = await login(req, res);
        return res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.get('/users', verify, async (req, res, next) => {
    try {
        const response = await getAllUsers(req, res);
        return res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

// localhost:8222/api/v1/admin/user/Jatin Kumar Kamboj
router.get('/user/:username', verify, async (req, res, next) => {
    try {
        const response = await getUsername(req, res);
        return res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;