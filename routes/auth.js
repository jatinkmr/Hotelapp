const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { notFound } = require("@hapi/boom");
const { registration } = require('../actions/auth');

router.post("/register", async (req, res, next) => {
    try{
        const response = await registration(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    
    const user = await User.findOne({
        email: req.body.email
    });

    if(!user) {
        return res.status(400).send('Email Does Not Exists !!');
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        return res.status(400).send('Invalid Password !!');
    }

    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;
