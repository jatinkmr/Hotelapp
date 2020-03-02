const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registration = async (req, res) => {
    const { error } = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const emailExist = await User.findOne({
        email: req.body.email
    });

    if(emailExist) {
        return res.status(400).send('Email already Exists !!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        // res.send(savedUser);
        return res.send({user: user._id});
    } catch(err) {
        return res.status(400).send(err);
    }
};

const login = async (req, res) => {
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
};

module.exports.registration = registration;
module.exports.login = login;