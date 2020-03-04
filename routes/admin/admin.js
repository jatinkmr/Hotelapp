const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const { getAllUsers } = require('../../actions/admin/admin');

router.get('/', (req, res) => {
    res.status(200).send('Admin Page Loaded Successfully !!');
});

router.get('/users', async (req, res, next) => {
    try {
        const response = await getAllUsers(req, res);
        return res.send(response);
    } catch(err) {
        next(err);
    }
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;